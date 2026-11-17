import Foundation
import UserNotifications

// BP uses dated requests; completing one occurrence never removes another time.
// Refill the bounded system queue on foreground and every notification action.
final class JakobHealthReminderActions {
    static let shared = JakobHealthReminderActions()
    static let prefix = "jakob.health.v1."
    private let center = UNUserNotificationCenter.current()
    private let defaults = UserDefaults.standard
    private let key = "jakob.health.v1.state"
    private var state: [String: Any] { get { defaults.dictionary(forKey: key) ?? [:] } set { defaults.set(newValue, forKey: key) } }
    private var revision = 0
    private var installed = false
    private var scope: String { state["scope"] as? String ?? "" }
    private var events: [[String: Any]] { get { state["events"] as? [[String: Any]] ?? [] } set { var next=state;next["events"]=newValue;state=next } }
    private var rows: [[String: Any]] { state["bp"] as? [[String: Any]] ?? [] }
    private func stamp(_ date: Date, _ format: String) -> String { let f=DateFormatter();f.locale=Locale(identifier:"en_US_POSIX");f.dateFormat=format;return f.string(from:date) }
    private func date(_ value: String) -> Date? { let f=DateFormatter();f.locale=Locale(identifier:"en_US_POSIX");f.dateFormat="yyyy-MM-dd HH:mm";return f.date(from:value) }
    private func persist(_ name: String, _ value: Any) { var next=state;next[name]=value;state=next }
    private func reply(_ cb: @escaping(String)->Void, _ value: [String:Any]) {
        if value["ok"] as? Bool == false { print("[JakobReminder] " + json(value)) }
        let data=try? JSONSerialization.data(withJSONObject:value);cb(data.flatMap{String(data:$0,encoding:.utf8)} ?? "{\"ok\":false}")
    }
    private func json(_ value: Any) -> String { guard let data=try? JSONSerialization.data(withJSONObject:value) else{return "[]"};return String(data:data,encoding:.utf8) ?? "[]" }
    private func parse(_ value: Any?) -> Any? { guard let text=value as? String,let data=text.data(using:.utf8) else{return value};return try? JSONSerialization.jsonObject(with:data) }

    func install() {
        guard !installed else{return};installed=true
        let zh=Locale.preferredLanguages.first?.hasPrefix("zh") == true
        center.getNotificationCategories { old in
            let categories = ["bp","medication"].map { kind -> UNNotificationCategory in
                let done=UNNotificationAction(identifier:"health.completed",title:zh ? (kind=="bp" ? "已测量":"已服药") : (kind=="bp" ? "Measured":"Taken"),options:[])
                let later=UNNotificationAction(identifier:"health.snoozed",title:zh ? "10分钟后提醒":"Remind in 10 min",options:[])
                return UNNotificationCategory(identifier:"jakob.health."+kind,actions:[done,later],intentIdentifiers:[],options:[])
            }
            self.center.setNotificationCategories(Set(old.filter{!$0.identifier.hasPrefix("jakob.health.")}).union(categories))
        }
    }
    func reset(_ newScope: String) {
        guard scope != newScope || newScope.isEmpty else{return}
        let oldScope=scope
        revision += 1
        let known=state["ids"] as? [String] ?? []
        center.removePendingNotificationRequests(withIdentifiers:known)
        center.removeDeliveredNotifications(withIdentifiers:known)
        state=["scope":newScope]
        removeMedFollowUps()
        center.getDeliveredNotifications{values in
            self.center.removeDeliveredNotifications(withIdentifiers:values.filter{$0.request.identifier.hasPrefix(Self.prefix) && $0.request.content.userInfo["jakobMedicationScope"] as? String == oldScope}.map{$0.request.identifier})
        }
    }
    func medicationPlan(_ plan: [[String: Any]], title: String) { persist("medication",plan);persist("medicationTitle",title) }
    var scheduledThrough: Double { state["through"] as? Double ?? 0 }
    var schedulingError: [String:Any] { state["schedulingError"] as? [String:Any] ?? [:] }
    private func schedulingReply(_ ok: Bool, owner: String, callback: @escaping(String)->Void) {
        guard owner == scope else { reply(callback,["ok":false,"code":"STALE_SESSION"]); return }
        var result: [String:Any] = ok ? [:] : schedulingError
        result["ok"] = ok
        if !ok && result["code"] == nil { result["code"] = "SCHEDULE" }
        result["bpScheduledThrough"] = scheduledThrough
        reply(callback,result)
    }
    private func schedulingFailed(_ code: String, stage: String, error: Error? = nil,
                                  planned: Int = 0, pending: Int = 0) -> Bool {
        var result: [String:Any] = ["code":code,"stage":stage,"plannedCount":planned,"pendingCount":pending]
        if let error = error {
            let native = error as NSError
            result["nativeDomain"] = native.domain
            result["nativeCode"] = native.code
            result["message"] = native.localizedDescription
        }
        persist("schedulingError",result)
        print("[JakobReminder] " + json(result))
        return false
    }

    func invoke(_ method: String, _ args: [String:Any], _ callback: @escaping(String)->Void) {
        guard !scope.isEmpty, args["scope"] as? String == scope else {reply(callback,["ok":false,"code":"STALE_SESSION"]);return}
        switch method {
        case "replaceBP":
            guard let rows=parse(args["reminders"]) as? [[String:Any]], rows.count<=8,rows.allSatisfy({["system","alarm","silent"].contains($0["sound"] as? String ?? "system")}) else{reply(callback,["ok":false,"code":"INVALID_PLAN"]);return}
            persist("bp",rows);persist("title",args["title"] as? String ?? "Blood pressure reminder")
            let owner = scope
            refill { ok in self.schedulingReply(ok,owner:owner,callback:callback) }
        case "healthEvents":
            collectDelivered { self.reply(callback,["ok":true,"events":self.json(self.events)]) }
        case "dismissHealthReminder":
            guard let value=parse(args["event"]) as? [String:Any],let token=value["notificationToken"] as? String,!token.isEmpty else{reply(callback,["ok":false,"code":"INVALID_EVENT"]);return}
            let owner=scope
            center.getDeliveredNotifications { notifications in DispatchQueue.main.async {
                guard owner==self.scope else{self.reply(callback,["ok":false,"code":"STALE_SESSION"]);return}
                let ids=notifications.filter{self.event($0)?["notificationToken"] as? String == token}.map{$0.request.identifier}
                // Keep future repeating requests and completion records intact.
                self.center.removeDeliveredNotifications(withIdentifiers:ids)
                self.reply(callback,["ok":true])
            }}
        case "ackHealthEvents":
            let ids=Set(parse(args["ids"]) as? [String] ?? [])
            events=events.filter{!ids.contains($0["id"] as? String ?? "")};reply(callback,["ok":true])
        case "healthAction":
            guard let event=parse(args["event"]) as? [String:Any] else{reply(callback,["ok":false]);return}
            act(event){ok in self.reply(callback,["ok":ok])}
        case "scheduleMedFollowUp": scheduleMedFollowUp(args, callback)
        case "cancelMedFollowUp": cancelMedFollowUp(args, callback)
        case "syncHealthChecks":
            if !events.isEmpty {reply(callback,["ok":true]);return}
            guard let checks=parse(args["checks"]) as? [String:[String:[String:Any]]] else{reply(callback,["ok":false]);return}
            persist("measuredDay","");persist("measuredSource","")
            persist("checks",checks)
            let owner = scope
            refill{ok in self.schedulingReply(ok,owner:owner,callback:callback)}
        default: reply(callback,["ok":false,"code":"UNKNOWN_METHOD"])
        }
    }
    private func completed(_ kind: String, _ id: String, _ day: String, _ time: String) -> Bool {
        let checks=state["checks"] as? [String:[String:[String:Any]]] ?? [:]
        return checks[kind]?[day+"|"+time+"|"+id]?["completed"] as? Bool == true
    }
    private func event(_ notification: UNNotification) -> [String:Any]? {
        let info=notification.request.content.userInfo
        guard info["jakobMedicationScope"] as? String == scope else{return nil}
        let notificationToken=notification.request.identifier+"|"+String(notification.date.timeIntervalSince1970)
        if var value=info["healthEvent"] as? [String:Any] {value["notificationToken"]=notificationToken;return value}
        guard let items=info["healthItems"] as? [[String:Any]],!items.isEmpty else{return nil}
        let delivered=notification.date,parts=(notification.request.trigger as? UNCalendarNotificationTrigger)?.dateComponents
        let at=Calendar.current.date(bySettingHour:parts?.hour ?? Calendar.current.component(.hour,from:delivered),minute:parts?.minute ?? Calendar.current.component(.minute,from:delivered),second:0,of:delivered) ?? delivered
        return ["kind":"medication","itemIds":items.compactMap{$0["id"] as? String},"date":stamp(at,"yyyy-MM-dd"),"time":stamp(at,"HH:mm"),"scheduledAt":at.timeIntervalSince1970*1000,"label":items.compactMap{$0["name"] as? String}.joined(separator:"、"),"body":notification.request.content.body,"title":notification.request.content.title,"sound":info["jakobMedicationSound"] as? String ?? "system","notificationToken":notificationToken]
    }
    private func append(_ value: [String:Any], action: String, at: Date=Date()) {
        var item=value;item["id"]=UUID().uuidString;item["action"]=action;item["at"]=at.timeIntervalSince1970*1000
        var pending=events;pending.append(item);events=pending
    }
    private func collectDelivered(_ done: @escaping()->Void) {
        let owner=scope
        center.getDeliveredNotifications { values in DispatchQueue.main.async {
            guard owner==self.scope else{done();return}
            var seen=self.state["seen"] as? [String:Double] ?? [:]
            for notification in values {
                guard let value=self.event(notification) else{continue}
                let key=notification.request.identifier+"|"+String(notification.date.timeIntervalSince1970)
                if seen[key]==nil{self.append(value,action:"reminded",at:notification.date);seen[key]=notification.date.timeIntervalSince1970}
            }
            seen=seen.filter{$0.value>Date().timeIntervalSince1970-90*86400};self.persist("seen",seen);done()
        }}
    }
    func handle(_ response: UNNotificationResponse, done: @escaping()->Void) -> Bool {
        guard var value=event(response.notification) else{return false}
        recordPresentation(response.notification)
        if response.actionIdentifier == UNNotificationDefaultActionIdentifier {
            if value["kind"] as? String == "bp",valid(value),canPresent(response.notification),value["date"] as? String == stamp(Date(),"yyyy-MM-dd") {
                append(value,action:"openBP")
            }
            refill{_ in done()};return true
        }
        guard response.actionIdentifier.hasPrefix("health.") else{return false}
        value["action"]=String(response.actionIdentifier.dropFirst("health.".count))
        act(value){_ in done()};return true
    }
    func recordPresentation(_ notification: UNNotification) {
        guard let value=event(notification) else{return}
        let key=notification.request.identifier+"|"+String(notification.date.timeIntervalSince1970)
        var seen=state["seen"] as? [String:Double] ?? [:]
        if seen[key]==nil{append(value,action:"reminded",at:notification.date);seen[key]=notification.date.timeIntervalSince1970;persist("seen",seen)}
    }
    func owns(_ notification: UNNotification) -> Bool { notification.request.identifier.hasPrefix(Self.prefix) }
    func canPresent(_ notification: UNNotification) -> Bool { guard let value=event(notification) else{return false};return !(value["itemIds"] as? [String] ?? []).allSatisfy{completed(value["kind"] as? String ?? "",$0,value["date"] as? String ?? "",value["time"] as? String ?? "")} }

    private func valid(_ value: [String:Any]) -> Bool {
        let kind=value["kind"] as? String ?? "",time=value["time"] as? String ?? "",ids=value["itemIds"] as? [String] ?? []
        let plans=kind=="bp" ? rows : (state["medication"] as? [[String:Any]] ?? [])
        return !ids.isEmpty && ids.allSatisfy{id in plans.contains{row in
            if kind=="bp" {return row["id"] as? String == id && row["enabled"] as? Bool == true && (row["times"] as? [String] ?? []).contains(time)}
            return String(format:"%02d:%02d",row["hour"] as? Int ?? -1,row["minute"] as? Int ?? -1)==time && (row["items"] as? [[String:Any]] ?? []).contains{$0["id"] as? String == id}
        }}
    }

    private func act(_ input: [String:Any], done: @escaping(Bool)->Void) {
        guard let kind=input["kind"] as? String,["bp","medication"].contains(kind),let action=input["action"] as? String,["completed","undone","snoozed","measured"].contains(action),let day=input["date"] as? String else{done(false);return}
        if action=="measured" {append(input,action:action);done(true);return}
        let ids=input["itemIds"] as? [String] ?? [],time=input["time"] as? String ?? ""
        if action != "measured",!valid(input){done(false);return}
        if action=="snoozed" {
            guard !ids.isEmpty,!ids.allSatisfy({completed(kind,$0,day,time)}) else{done(false);return}
            var value=input;value["snoozeAt"]=Date().addingTimeInterval(600).timeIntervalSince1970*1000
            var snoozes=state["snoozes"] as? [String:[String:Any]] ?? [:]
            if kind=="bp" {snoozes[kind+"|"+ids.sorted().joined(separator:"|")]=value}
            else {
                // Home groups medicines by time; preserve each original sound and dosage when snoozing.
                for plan in state["medication"] as? [[String:Any]] ?? [] {
                    guard String(format:"%02d:%02d",plan["hour"] as? Int ?? -1,plan["minute"] as? Int ?? -1)==time else{continue}
                    let weekday=plan["weekday"] as? Int ?? 0
                    if weekday != 0,let scheduled=date(day+" "+time),Calendar.current.component(.weekday,from:scheduled) != weekday {continue}
                    let items=(plan["items"] as? [[String:Any]] ?? []).filter{ids.contains($0["id"] as? String ?? "")}
                    if items.isEmpty{continue}
                    let selected=items.compactMap{$0["id"] as? String}.sorted(),sound=plan["sound"] as? String ?? "system"
                    var group=value;group["itemIds"]=selected;group["sound"]=sound
                    if sound == "alarm" { group["soundSeconds"] = plan["soundSeconds"] ?? 24 }
                    group["body"]=items.map{item in ["name","dose","note"].compactMap{item[$0] as? String}.filter{!$0.isEmpty}.joined(separator:" · ")}.joined(separator:"\n")
                    group["title"]=input["title"] as? String ?? state["medicationTitle"] as? String ?? "Medication reminder"
                    snoozes[kind+"|"+selected.joined(separator:"|")+"|"+sound]=group
                }
            }
            persist("snoozes",snoozes)
            append(value,action:action)
        } else {
            var checks=state["checks"] as? [String:[String:[String:Any]]] ?? [:],records=checks[kind] ?? [:]
            for id in ids{records[day+"|"+time+"|"+id]=["completed":action != "undone","updatedAt":Date().timeIntervalSince1970*1000]};checks[kind]=records;persist("checks",checks)
            append(input,action:action)
            if kind == "medication" && action == "completed" { removeDoseFollowUps(day, time) }
        }
        let owner=scope
        center.getDeliveredNotifications{values in DispatchQueue.main.async{
            guard owner==self.scope else{done(false);return}
            let matches=values.filter{notification in
                guard let value=self.event(notification),value["kind"] as? String == kind,value["date"] as? String == day else{return false}
                return value["time"] as? String == time && !(Set(value["itemIds"] as? [String] ?? []).isDisjoint(with:ids))
            }
            self.center.removeDeliveredNotifications(withIdentifiers:matches.map{$0.request.identifier});self.refill(done)
        }}
    }
    private func alarmNotificationSound(_ seconds: Int) -> UNNotificationSound {
        let base: String
        switch seconds {
        case 12: base = "jakob_medication_alarm_12"
        case 24: base = "jakob_medication_alarm_24"
        default: base = "jakob_medication_alarm"
        }
        let resolved = Bundle.main.url(forResource: base, withExtension: "wav") == nil ? "jakob_medication_alarm" : base
        return UNNotificationSound(named: UNNotificationSoundName(rawValue: resolved + ".wav"))
    }

    private func request(_ event: [String:Any], at: Date, id: String, title: String) -> UNNotificationRequest {
        let content=UNMutableNotificationContent();content.title=event["title"] as? String ?? title;content.body=event["body"] as? String ?? event["label"] as? String ?? title
        let kind=event["kind"] as? String ?? "bp";content.categoryIdentifier="jakob.health."+kind
        if kind == "medication" {
            content.title=state["medicationTitle"] as? String ?? content.title
            let ids=Set(event["itemIds"] as? [String] ?? [])
            let plans=state["medication"] as? [[String:Any]] ?? []
            var seen=Set<String>()
            let items=plans.flatMap{$0["items"] as? [[String:Any]] ?? []}.filter { item in
                guard let id=item["id"] as? String,ids.contains(id) else{return false}
                return seen.insert(id).inserted
            }
            if !items.isEmpty {
                content.body=items.map{item in ["name","dose","note"].compactMap{item[$0] as? String}.filter{!$0.isEmpty}.joined(separator:" · ")}.joined(separator:"\n")
            }
        }
        var sound=event["sound"] as? String ?? "system"
        var secondsValue: Any? = event["soundSeconds"]
        if kind == "bp",let ids=event["itemIds"] as? [String],let row=rows.first(where:{ids.contains($0["id"] as? String ?? "")}) {
            if let body=row["notificationBody"] as? String {content.body=body}
            sound=row["sound"] as? String ?? "system"
            secondsValue=row["soundSeconds"] ?? secondsValue
        }
        let seconds=(secondsValue as? Int) ?? (secondsValue as? NSNumber)?.intValue ?? 24
        var notificationEvent=event;notificationEvent["sound"]=sound
        if sound == "alarm" { notificationEvent["soundSeconds"] = seconds }
        content.userInfo=["healthEvent":notificationEvent,"jakobMedicationScope":scope,"jakobMedicationSound":sound]
        if sound == "alarm" { content.userInfo["jakobMedicationSoundSeconds"] = String([2, 12, 24].contains(seconds) ? seconds : 24) }
        content.threadIdentifier="jakob.health."+kind
        content.sound=sound=="silent" ? nil : sound=="alarm" ? alarmNotificationSound([2, 12, 24].contains(seconds) ? seconds : 24) : .default
        let calendar = Calendar.current
        var components = calendar.dateComponents([.year,.month,.day,.hour,.minute,.second],from:at)
        components.calendar = calendar
        components.timeZone = calendar.timeZone
        let trigger=UNCalendarNotificationTrigger(dateMatching:components,repeats:false)
        return UNNotificationRequest(identifier:Self.prefix+id,content:content,trigger:trigger)
    }
    func refill(_ done: @escaping(Bool)->Void = {_ in}) {
        let owner = scope
        JakobReminderScheduleQueue.shared.enqueue { finished in
            guard owner == self.scope else { done(false); finished(); return }
            self.refillNow { ok in done(ok); finished() }
        }
    }
    private func refillNow(_ done: @escaping(Bool)->Void) {
        guard !scope.isEmpty else{done(true);return}
        revision += 1;let version=revision,owner=scope,now=Date();var requests:[UNNotificationRequest]=[]
        for offset in 0..<32 {
            guard let dayDate=Calendar.current.date(byAdding:.day,value:offset,to:now) else{continue}
            let day=stamp(dayDate,"yyyy-MM-dd"),weekday=(Calendar.current.component(.weekday,from:dayDate)+5)%7+1
            for row in rows where row["enabled"] as? Bool == true {
                guard let id=row["id"] as? String,let days=row["weekdays"] as? [Int],days.contains(weekday),let times=row["times"] as? [String] else{continue}
                for time in times {
                    guard let at=date(day+" "+time),at>now,!completed("bp",id,day,time) else{continue}
                    var event:[String:Any]=["kind":"bp","itemIds":[id],"date":day,"time":time,"scheduledAt":at.timeIntervalSince1970*1000,"label":row["name"] as? String ?? "Measure blood pressure","sound":row["sound"] as? String ?? "system"]
                    if row["sound"] as? String == "alarm" { event["soundSeconds"] = row["soundSeconds"] ?? 24 }
                    requests.append(request(event,at:at,id:"bp."+id+"."+day+"."+time,title:state["title"] as? String ?? "Blood pressure reminder"))
                }
            }
        }
        var retained:[String:[String:Any]]=[:]
        for (id,event) in state["snoozes"] as? [String:[String:Any]] ?? [:] {
            guard valid(event),let ms=event["snoozeAt"] as? Double,ms>now.timeIntervalSince1970*1000,let kind=event["kind"] as? String,let ids=event["itemIds"] as? [String] else{continue}
            if ids.allSatisfy({completed(kind,$0,event["date"] as? String ?? "",event["time"] as? String ?? "")}){continue}
            retained[id]=event;requests.append(request(event,at:Date(timeIntervalSince1970:ms/1000),id:"snooze."+id,title:kind=="bp" ? (state["title"] as? String ?? "Blood pressure reminder") : "Medication reminder"))
        }
        persist("snoozes",retained)
        requests.sort{(($0.trigger as? UNCalendarNotificationTrigger)?.nextTriggerDate() ?? .distantFuture)<(($1.trigger as? UNCalendarNotificationTrigger)?.nextTriggerDate() ?? .distantFuture)}
        placeRefill(requests, version: version, owner: owner, now: now, done: done)
    }
    private func unchanged(_ old: UNNotificationRequest, _ new: UNNotificationRequest) -> Bool {
        return old.identifier == new.identifier && old.content.body == new.content.body &&
            old.content.title == new.content.title && old.content.categoryIdentifier == new.content.categoryIdentifier &&
            NSDictionary(dictionary: old.content.userInfo).isEqual(to: new.content.userInfo) &&
            (old.trigger as? UNCalendarNotificationTrigger)?.dateComponents == (new.trigger as? UNCalendarNotificationTrigger)?.dateComponents
    }
    private func recordPending(_ requests: [UNNotificationRequest]) {
        let own = requests.filter { $0.identifier.hasPrefix(Self.prefix) && $0.content.userInfo["jakobMedicationScope"] as? String == scope }
        persist("ids",own.map { $0.identifier })
        persist("through",own.filter { $0.identifier.hasPrefix(Self.prefix + "bp.") }
            .compactMap { ($0.trigger as? UNCalendarNotificationTrigger)?.nextTriggerDate()?.timeIntervalSince1970 }.max().map { $0 * 1000 } ?? 0)
    }
    private func placeRefill(_ requests: [UNNotificationRequest], version: Int, owner: String, now: Date, done: @escaping (Bool) -> Void) {
        center.getPendingNotificationRequests { pending in DispatchQueue.main.async {
            guard version == self.revision, owner == self.scope else { done(false); return }
            let own = pending.filter { $0.identifier.hasPrefix(Self.prefix) }
            let room = max(0, 64 - (pending.count - own.count))
            let minimum = requests.filter { (($0.trigger as? UNCalendarNotificationTrigger)?.nextTriggerDate() ?? .distantFuture) < now.addingTimeInterval(86400) }.count
            guard minimum <= room, (requests.isEmpty || room > 0) else {
                self.center.removePendingNotificationRequests(withIdentifiers:own.filter { !self.isMedFollow($0.identifier) }.map { $0.identifier })
                self.persist("ids",[String]()); self.persist("through",0)
                done(self.schedulingFailed("LIMIT",stage:"capacity",planned:minimum,pending:pending.count-own.count)); return
            }
            let wanted = Array(requests.prefix(room)), ids = Set(wanted.map { $0.identifier })
            // Reuse unchanged notifications. iOS replaces a changed request with the same ID.
            // Repeated foreground refreshes must not clear all BP requests and compete to re-add them.
            self.center.removePendingNotificationRequests(withIdentifiers:own.filter { !ids.contains($0.identifier) && !self.isMedFollow($0.identifier) }.map { $0.identifier })
            let changed = wanted.filter { request in !own.contains { self.unchanged($0,request) } }
            self.add(changed,at:0,version:version,owner:owner) { added in
                self.center.getPendingNotificationRequests { actual in DispatchQueue.main.async {
                    guard version == self.revision, owner == self.scope else { done(false); return }
                    self.recordPending(actual)
                    guard added else { done(false); return }
                    // Do not report success for a partial queue, or count already-fired requests as missing.
                    let missing = wanted.filter { request in
                        (request.trigger as? UNCalendarNotificationTrigger)?.nextTriggerDate() != nil &&
                            !actual.contains { self.unchanged($0,request) }
                    }
                    guard missing.isEmpty else {
                        done(self.schedulingFailed("SCHEDULE_INCOMPLETE",stage:"verify",planned:wanted.count,pending:actual.count)); return
                    }
                    self.persist("schedulingError",[String:Any]()); done(true)
                }}
            }
        }}
    }
    private func isMedFollow(_ identifier: String) -> Bool { identifier.hasPrefix(Self.prefix + "medfollow.") }
    private func medFollowId(_ event: [String:Any]) -> String? {
        guard let day=event["date"] as? String, let time=event["time"] as? String else { return nil }
        let ids: [String]
        if let list=event["itemIds"] as? [String] { ids=list.filter { !$0.isEmpty }.sorted() }
        else { ids=((event["itemIds"] as? [Any]) ?? []).compactMap { $0 as? String }.filter { !$0.isEmpty }.sorted() }
        guard !ids.isEmpty else { return nil }
        return Self.prefix + "medfollow." + day + "." + time + "." + ids.joined(separator: ".")
    }
    private func removeMedFollowUps() {
        center.getPendingNotificationRequests { pending in
            let ids=pending.filter { self.isMedFollow($0.identifier) }.map { $0.identifier }
            self.center.removePendingNotificationRequests(withIdentifiers: ids)
            self.center.removeDeliveredNotifications(withIdentifiers: ids)
        }
    }
    private func removeDoseFollowUps(_ day: String, _ time: String, _ done: @escaping () -> Void = {}) {
        let prefix=Self.prefix + "medfollow." + day + "." + time + "."
        center.getPendingNotificationRequests { pending in
            let ids=pending.filter { $0.identifier.hasPrefix(prefix) }.map { $0.identifier }
            self.center.removePendingNotificationRequests(withIdentifiers: ids)
            self.center.removeDeliveredNotifications(withIdentifiers: ids)
            DispatchQueue.main.async { done() }
        }
    }
    private func followEvent(_ args: [String:Any]) -> [String:Any]? {
        guard let text=args["event"] as? String, let data=text.data(using:.utf8),
              var event=(try? JSONSerialization.jsonObject(with:data)) as? [String:Any],
              medFollowId(event) != nil else { return nil }
        event["kind"]="medication"
        event["followUp"]=true
        if event["body"] as? String == nil || (event["body"] as? String ?? "").isEmpty {
            event["body"]="请确认刚才是否已服用降压药物"
        }
        if event["title"] as? String == nil || (event["title"] as? String ?? "").isEmpty {
            event["title"]=state["medicationTitle"] as? String ?? "用药提醒"
        }
        return event
    }
    private func scheduleMedFollowUp(_ args: [String:Any], _ callback: @escaping(String)->Void) {
        guard var event=followEvent(args), let identifier=medFollowId(event) else { reply(callback,["ok":false,"code":"INVALID_EVENT"]); return }
        let atMs=(args["at"] as? NSNumber)?.doubleValue ?? (args["at"] as? Double) ?? 0
        let at=Date(timeIntervalSince1970: atMs/1000)
        guard atMs > Date().timeIntervalSince1970 * 1000 else { reply(callback,["ok":false,"code":"PAST"]); return }
        event["followUp"]=true
        let content=UNMutableNotificationContent()
        content.title=event["title"] as? String ?? "用药提醒"
        content.body=event["body"] as? String ?? "请确认刚才是否已服用降压药物"
        content.sound = .default
        content.threadIdentifier="jakob.health.medication"
        content.userInfo=["healthEvent":event,"jakobMedicationScope":scope,"jakobMedicationSound":"system"]
        let calendar=Calendar.current
        var components=calendar.dateComponents([.year,.month,.day,.hour,.minute,.second], from: at)
        components.calendar=calendar
        components.timeZone=calendar.timeZone
        let request=UNNotificationRequest(identifier:identifier, content:content, trigger:UNCalendarNotificationTrigger(dateMatching:components, repeats:false))
        center.removeDeliveredNotifications(withIdentifiers:[identifier])
        center.add(request) { error in DispatchQueue.main.async {
            if let error=error { self.reply(callback,["ok":false,"code":"SCHEDULE","message":error.localizedDescription]) }
            else { self.reply(callback,["ok":true]) }
        }}
    }
    private func cancelMedFollowUp(_ args: [String:Any], _ callback: @escaping(String)->Void) {
        guard let event=followEvent(args), let day=event["date"] as? String, let time=event["time"] as? String else { reply(callback,["ok":false,"code":"INVALID_EVENT"]); return }
        removeDoseFollowUps(day, time) { self.reply(callback,["ok":true]) }
    }
    private func add(_ requests:[UNNotificationRequest], at index:Int, version:Int, owner:String, done:@escaping(Bool)->Void) {
        guard version==revision, owner==scope else { done(false); return }
        guard index<requests.count else { done(true); return }
        center.add(requests[index]){error in DispatchQueue.main.async{
            guard version==self.revision, owner==self.scope else {
                self.center.removePendingNotificationRequests(withIdentifiers:[requests[index].identifier]); done(false); return
            }
            if let error = error { done(self.schedulingFailed("SCHEDULE",stage:"add",error:error,planned:requests.count,pending:index)) }
            else {
                // Track each accepted request immediately so logout can cancel a partially added batch.
                var known = self.state["ids"] as? [String] ?? []
                if !known.contains(requests[index].identifier) { known.append(requests[index].identifier); self.persist("ids",known) }
                self.add(requests, at: index + 1, version: version, owner: owner, done: done)
            }
        }}
    }
}
