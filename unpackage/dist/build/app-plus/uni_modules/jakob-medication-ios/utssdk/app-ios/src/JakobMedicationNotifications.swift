import Foundation
import UIKit
import UserNotifications
import AVFoundation

// 仅操作自己的 identifier 前缀。原有推送 delegate 继续接收其他通知。
public final class JakobMedicationNotifications: NSObject, UNUserNotificationCenterDelegate {
    private static let shared = JakobMedicationNotifications()
    private static let prefix = "jakob.medication.v1."
    private static let scopeKey = "jakob.medication.v1.scope"
    private static let errorKey = "jakob.medication.v1.error"
    private static let idsKey = "jakob.medication.v1.identifiers"
    private let center = UNUserNotificationCenter.current()
    private let defaults = UserDefaults.standard
    private var previousDelegate: UNUserNotificationCenterDelegate?
    private var scope = UserDefaults.standard.string(forKey: JakobMedicationNotifications.scopeKey) ?? ""
    private var revision = 0
    private var observing = false
    private var authorizationCallbacks: [(Bool) -> Void] = []
    private var previewPlayer: AVAudioPlayer?
    private var previewToken = 0
    private var playingNotificationToken = ""

    private func cancelPreviewPlayback() {
        previewToken = previewToken + 1
        if let player = previewPlayer {
            player.stop()
        }
        previewPlayer = nil
        playingNotificationToken = ""
        let previewId = Self.prefix + "preview"
        center.removePendingNotificationRequests(withIdentifiers: [previewId])
        center.removeDeliveredNotifications(withIdentifiers: [previewId])
    }

    public static func bootstrap() { shared.installDelegate() }

    public static func invoke(_ method: String, _ payload: String, _ callback: @escaping (String) -> Void) {
        DispatchQueue.main.async {
            shared.installDelegate()
            guard let data = payload.data(using: .utf8),
                  let args = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] else {
                shared.reply(callback, ["ok": false, "code": "INVALID_PAYLOAD"])
                return
            }
            switch method {
            case "setSession": shared.setSession(args["scope"] as? String ?? "", callback)
            case "replace": shared.replace(args, callback)
            case "replaceBP":
                let rowsData=(args["reminders"] as? String ?? "[]").data(using:.utf8)!
                let bpRows=(try? JSONSerialization.jsonObject(with:rowsData)) as? [[String:Any]] ?? []
                if !bpRows.contains(where:{$0["enabled"] as? Bool == true}) { JakobHealthReminderActions.shared.invoke(method,args,callback) }
                else { shared.permission { granted in
                    if granted { JakobHealthReminderActions.shared.invoke(method, args, callback) }
                    else { shared.reply(callback, ["ok": false, "code": "PERMISSION"]) }
                }}
            case "healthAction", "healthEvents", "ackHealthEvents", "syncHealthChecks", "scheduleMedFollowUp", "cancelMedFollowUp": JakobHealthReminderActions.shared.invoke(method, args, callback)
            case "dismissHealthReminder":
                if args["scope"] as? String == shared.scope,
                   let text = args["event"] as? String, let data = text.data(using: .utf8),
                   let event = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any],
                   let token = event["notificationToken"] as? String,
                   !token.isEmpty, token == shared.playingNotificationToken {
                    shared.cancelPreviewPlayback()
                }
                JakobHealthReminderActions.shared.invoke(method, args, callback)
            case "status": shared.status(callback)
            case "openSettings":
                guard let url = URL(string: UIApplication.openSettingsURLString) else {
                    shared.reply(callback, ["ok": false]); return
                }
                UIApplication.shared.open(url, options: [:]) { opened in shared.reply(callback, ["ok": opened]) }
            case "preview": shared.preview(args["sound"] as? String ?? "system", args["seconds"], callback)
            case "stopPreview":
                shared.cancelPreviewPlayback()
                shared.reply(callback, ["ok": true])
            default: shared.reply(callback, ["ok": false, "code": "UNKNOWN_METHOD"])
            }
        }
    }

    private func reply(_ callback: @escaping (String) -> Void, _ result: [String: Any]) {
        let data = try? JSONSerialization.data(withJSONObject: result)
        callback(data.flatMap { String(data: $0, encoding: .utf8) } ?? "{\"ok\":false}")
    }

    private func installDelegate() {
        JakobHealthReminderActions.shared.install()
        if center.delegate !== self {
            previousDelegate = center.delegate
            center.delegate = self
        }
        if !observing {
            observing = true
            NotificationCenter.default.addObserver(self, selector: #selector(becameActive),
                name: UIApplication.didBecomeActiveNotification, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(willResignActive),
                name: UIApplication.willResignActiveNotification, object: nil)
        }
    }

    @objc private func becameActive() { installDelegate(); JakobHealthReminderActions.shared.refill() }
    // 下拉通知栏、控制中心或离开 App 时，停掉本次由 App 播放的闹钟。
    @objc private func willResignActive() { cancelPreviewPlayback() }

    // 串行化系统异步读写。切账号立即使旧回调失效，不等授权弹窗结束。
    private func enqueue(_ job: @escaping (@escaping () -> Void) -> Void) {
        JakobReminderScheduleQueue.shared.enqueue(job)
    }

    private func clearOwned(_ completion: @escaping () -> Void) {
        center.getPendingNotificationRequests { requests in
            DispatchQueue.main.async {
                self.center.removePendingNotificationRequests(withIdentifiers: requests.filter {
                    $0.identifier.hasPrefix(Self.prefix)
                }.map { $0.identifier })
                self.center.getDeliveredNotifications { notifications in
                    DispatchQueue.main.async {
                        self.center.removeDeliveredNotifications(withIdentifiers: notifications.filter {
                            $0.request.identifier.hasPrefix(Self.prefix)
                        }.map { $0.request.identifier })
                        completion()
                    }
                }
            }
        }
    }

    private func setSession(_ value: String, _ callback: @escaping (String) -> Void) {
        JakobHealthReminderActions.shared.reset(value)
        guard scope != value || value.isEmpty else { reply(callback, ["ok": true]); return }
        cancelPreviewPlayback()
        revision += 1
        scope = value
        defaults.set(value, forKey: Self.scopeKey)
        defaults.removeObject(forKey: Self.errorKey)
        // 先直接取消已知请求，防止刚退出就关闭 App 时异步查询尚未完成。
        let known = defaults.stringArray(forKey: Self.idsKey) ?? []
        center.removePendingNotificationRequests(withIdentifiers: known)
        center.removeDeliveredNotifications(withIdentifiers: known)
        defaults.removeObject(forKey: Self.idsKey)
        enqueue { done in
            self.clearOwned { self.reply(callback, ["ok": true]); done() }
        }
    }

    private func authorized(_ settings: UNNotificationSettings) -> Bool {
        if settings.authorizationStatus == .authorized { return true }
        if #available(iOS 12.0, *), settings.authorizationStatus == .provisional { return true }
        if #available(iOS 14.0, *), settings.authorizationStatus == .ephemeral { return true }
        return false
    }

    private func permission(_ completion: @escaping (Bool) -> Void) {
        center.getNotificationSettings { settings in
            DispatchQueue.main.async {
                guard settings.authorizationStatus == .notDetermined else {
                    completion(self.authorized(settings)); return
                }
                self.authorizationCallbacks.append(completion)
                guard self.authorizationCallbacks.count == 1 else { return }
                self.center.requestAuthorization(options: [.alert, .sound]) { granted, _ in
                    DispatchQueue.main.async {
                        let callbacks = self.authorizationCallbacks
                        self.authorizationCallbacks = []
                        callbacks.forEach { $0(granted) }
                    }
                }
            }
        }
    }

    private func request(_ row: [String: Any], title: String) -> UNNotificationRequest? {
        guard let id = row["id"] as? String, !id.isEmpty, id.count < 100,
              let hour = row["hour"] as? Int, (0...23).contains(hour),
              let minute = row["minute"] as? Int, (0...59).contains(minute),
              let weekday = row["weekday"] as? Int, (0...7).contains(weekday),
              let body = row["body"] as? String, !body.isEmpty,
              let sound = row["sound"] as? String, ["system", "alarm", "silent"].contains(sound) else { return nil }
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.threadIdentifier = "jakob.medication"
        let seconds = alarmSeconds(row["soundSeconds"])
        content.sound = notificationSound(sound, seconds)
        content.userInfo = ["jakobMedicationScope": scope, "jakobMedicationSound": sound]
        if sound == "alarm" { content.userInfo["jakobMedicationSoundSeconds"] = String(seconds) }
        content.categoryIdentifier = "jakob.health.medication"
        content.userInfo["healthItems"] = row["items"] as? [[String: Any]] ?? []
        var components = DateComponents()
        components.hour = hour
        components.minute = minute
        components.second = 0
        if weekday != 0 { components.weekday = weekday }
        // 不固定 timezone，按手机当地时间每天/每周重复，无需后台 JS 存活。
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: true)
        return UNNotificationRequest(identifier: Self.prefix + id, content: content, trigger: trigger)
    }

    // 通知铃只能播放一次，且必须短于 30 秒。长铃声是把原来的 2.4 秒闹钟音原样重复。
    private func alarmNotificationSound(_ seconds: Int) -> UNNotificationSound {
        let base = alarmFileBase(seconds)
        let resolved = Bundle.main.url(forResource: base, withExtension: "wav") == nil ? "jakob_medication_alarm" : base
        return UNNotificationSound(named: UNNotificationSoundName(rawValue: resolved + ".wav"))
    }

    private func alarmSeconds(_ value: Any?) -> Int {
        let number = (value as? Int) ?? (value as? NSNumber)?.intValue ?? Int(value as? String ?? "") ?? 24
        return [2, 12, 24].contains(number) ? number : 24
    }

    private func playAlarm(_ seconds: Int) {
        let preferred = alarmFileBase(seconds)
        let base = Bundle.main.url(forResource: preferred, withExtension: "wav") == nil ? "jakob_medication_alarm" : preferred
        guard let url = Bundle.main.url(forResource: base, withExtension: "wav") else { return }
        cancelPreviewPlayback()
        do {
            let player = try AVAudioPlayer(contentsOf: url)
            player.prepareToPlay()
            previewPlayer = player
            if !player.play() {
                try? AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
                try? AVAudioSession.sharedInstance().setActive(true)
                player.play()
            }
        } catch {}
    }

    private func presentInForeground(_ notification: UNNotification, _ completion: @escaping (UNNotificationPresentationOptions) -> Void) {
        let info = notification.request.content.userInfo
        let sound = info["jakobMedicationSound"] as? String ?? "system"
        var options: UNNotificationPresentationOptions
        if #available(iOS 14.0, *) { options = [.banner, .list] } else { options = [.alert] }
        if sound == "alarm" {
            playAlarm(alarmSeconds(info["jakobMedicationSoundSeconds"]))
            playingNotificationToken = notification.request.identifier + "|" + String(notification.date.timeIntervalSince1970)
        } else if sound != "silent" {
            options.insert(.sound)
        }
        completion(options)
    }

    private func notificationSound(_ name: String, _ seconds: Int = 24) -> UNNotificationSound? {
        if name == "silent" { return nil }
        if name == "alarm" { return alarmNotificationSound(seconds) }
        return .default
    }

    private func replace(_ args: [String: Any], _ callback: @escaping (String) -> Void) {
        guard !scope.isEmpty, args["scope"] as? String == scope,
              let rows = args["plan"] as? [[String: Any]], let title = args["title"] as? String else {
            reply(callback, ["ok": false, "code": "STALE_SESSION"]); return
        }
        let requests = rows.compactMap { request($0, title: title) }
        guard requests.count == rows.count, Set(requests.map { $0.identifier }).count == requests.count else {
            reply(callback, ["ok": false, "code": "INVALID_PLAN"]); return
        }
        revision += 1
        JakobHealthReminderActions.shared.medicationPlan(rows, title: title)
        let version = revision
        let schedule: (Bool) -> Void = { granted in
            guard version == self.revision else { self.reply(callback, ["ok": false, "code": "SUPERSEDED"]); return }
            self.enqueue { done in
                guard version == self.revision else { self.reply(callback, ["ok": false, "code": "SUPERSEDED"]); done(); return }
                guard granted || requests.isEmpty else {
                    self.clearOwned { self.reply(callback, ["ok": false, "code": "PERMISSION"]); done() }
                    return
                }
                self.schedule(requests, version: version, callback: callback, done: done)
            }
        }
        if requests.isEmpty { schedule(true) } else { permission(schedule) }
    }

    private func schedule(_ requests: [UNNotificationRequest], version: Int,
                          callback: @escaping (String) -> Void, done: @escaping () -> Void) {
        center.getPendingNotificationRequests { pending in
            DispatchQueue.main.async {
                guard version == self.revision else { self.reply(callback, ["ok": false, "code": "SUPERSEDED"]); done(); return }
                let own = pending.filter { $0.identifier.hasPrefix(Self.prefix) }
                let bp = pending.filter { $0.identifier.hasPrefix(JakobHealthReminderActions.prefix + "bp.") }
                let others = pending.count - own.count - bp.count
                let hasAlarm = requests.contains { $0.content.userInfo["jakobMedicationSound"] as? String == "alarm" }
                let missingSound = hasAlarm && Bundle.main.url(forResource: "jakob_medication_alarm", withExtension: "wav") == nil
                if requests.count + others > 64 || missingSound {
                    // 保存的是新配置，不能继续响旧药品/旧时间，也不能悄悄截断新配置。
                    self.defaults.set(missingSound ? "sound" : "limit", forKey: Self.errorKey)
                    self.clearOwned {
                        self.reply(callback, ["ok": false, "code": missingSound ? "MISSING_SOUND" : "LIMIT"]); done()
                    }
                    return
                }
                let wanted = Set(requests.map { $0.identifier })
                if requests.count + others + bp.count > 64 { self.center.removePendingNotificationRequests(withIdentifiers: bp.map { $0.identifier }) }
                self.defaults.set(Array(wanted), forKey: Self.idsKey)
                self.center.removePendingNotificationRequests(withIdentifiers: own.filter { !wanted.contains($0.identifier) }.map { $0.identifier })
                // 配置未变化的请求保持原样，避免进入前台时打断临近触发的通知。
                let changed = requests.filter { request in
                    !own.contains { old in
                        old.identifier == request.identifier && old.content.title == request.content.title &&
                        old.content.body == request.content.body &&
                        old.content.categoryIdentifier == request.content.categoryIdentifier &&
                        NSArray(array: old.content.userInfo["healthItems"] as? [[String: Any]] ?? []).isEqual(to: request.content.userInfo["healthItems"] as? [[String: Any]] ?? []) &&
                        old.content.userInfo["jakobMedicationScope"] as? String == self.scope &&
                        old.content.userInfo["jakobMedicationSound"] as? String == request.content.userInfo["jakobMedicationSound"] as? String &&
                        old.content.userInfo["jakobMedicationSoundSeconds"] as? String == request.content.userInfo["jakobMedicationSoundSeconds"] as? String &&
                        (old.trigger as? UNCalendarNotificationTrigger)?.dateComponents == (request.trigger as? UNCalendarNotificationTrigger)?.dateComponents
                    }
                }
                self.add(changed, at: 0, version: version, callback: callback, done: done)
            }
        }
    }

    private func add(_ requests: [UNNotificationRequest], at index: Int, version: Int,
                     callback: @escaping (String) -> Void, done: @escaping () -> Void) {
        guard version == revision else { reply(callback, ["ok": false, "code": "SUPERSEDED"]); done(); return }
        guard index < requests.count else {
            defaults.removeObject(forKey: Self.errorKey)
            JakobHealthReminderActions.shared.refill()
            reply(callback, ["ok": true]); done(); return
        }
        center.add(requests[index]) { error in
            DispatchQueue.main.async {
                if error != nil {
                    self.defaults.set("schedule", forKey: Self.errorKey)
                    self.clearOwned { self.reply(callback, ["ok": false, "code": "SCHEDULE"]); done() }
                } else { self.add(requests, at: index + 1, version: version, callback: callback, done: done) }
            }
        }
    }

    private func status(_ callback: @escaping (String) -> Void) {
        center.getNotificationSettings { settings in
            self.center.getPendingNotificationRequests { pending in
                DispatchQueue.main.async {
                    let own = pending.filter { $0.identifier.hasPrefix(Self.prefix) }
                    let next = own.compactMap { ($0.trigger as? UNCalendarNotificationTrigger)?.nextTriggerDate() }.min()
                    let audible = own.contains { $0.content.userInfo["jakobMedicationSound"] as? String != "silent" }
                    let bpAudible = pending.contains { request in
                        guard request.identifier.hasPrefix(JakobHealthReminderActions.prefix),let event=request.content.userInfo["healthEvent"] as? [String:Any],event["kind"] as? String == "bp" else{return false}
                        return request.content.userInfo["jakobMedicationSound"] as? String != "silent"
                    }
                    let error = self.defaults.string(forKey: Self.errorKey) ?? ""
                    self.reply(callback, ["ok": true, "available": true, "ios": true,
                        "healthActions": true, "bpScheduledThrough": JakobHealthReminderActions.shared.scheduledThrough,
                        "bpSchedulingError": JakobHealthReminderActions.shared.schedulingError,
                        "bpSounds": true, "bpSoundDisabled": bpAudible && settings.soundSetting == .disabled,
                        "notifications": self.authorized(settings) && settings.alertSetting != .disabled,
                        "exact": true, "soundDisabled": audible && settings.soundSetting == .disabled,
                        "limitExceeded": error == "limit", "schedulingFailed": !error.isEmpty,
                        "nextAt": (next?.timeIntervalSince1970 ?? 0) * 1000, "pendingCount": own.count])
                }
            }
        }
    }

    private func alarmFileBase(_ seconds: Int) -> String {
        switch seconds {
        case 12: return "jakob_medication_alarm_12"
        case 24: return "jakob_medication_alarm_24"
        default: return "jakob_medication_alarm"
        }
    }

    private func preview(_ sound: String, _ seconds: Any?, _ callback: @escaping (String) -> Void) {
        cancelPreviewPlayback()
        guard sound != "silent" else { reply(callback, ["ok": true]); return }
        let token = previewToken
        if sound == "alarm" {
            let chosen = alarmSeconds(seconds)
            let preferred = alarmFileBase(chosen)
            let base = Bundle.main.url(forResource: preferred, withExtension: "wav") == nil ? "jakob_medication_alarm" : preferred
            guard let url = Bundle.main.url(forResource: base, withExtension: "wav") else {
                reply(callback, ["ok": false, "code": "MISSING_SOUND"]); return
            }
            do {
                let player = try AVAudioPlayer(contentsOf: url)
                player.prepareToPlay()
                previewPlayer = player
                if !player.play() {
                    try AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
                    try AVAudioSession.sharedInstance().setActive(true)
                }
                guard token == previewToken, player.isPlaying || player.play() else {
                    cancelPreviewPlayback(); reply(callback, ["ok": false]); return
                }
                reply(callback, ["ok": true])
            } catch {
                reply(callback, ["ok": false])
            }
            return
        }
        permission { granted in
            guard token == self.previewToken else { self.reply(callback, ["ok": true]); return }
            guard granted, UIApplication.shared.applicationState == .active else {
                self.reply(callback, ["ok": false, "code": "PERMISSION"]); return
            }
            let content = UNMutableNotificationContent()
            content.sound = self.notificationSound(sound, self.alarmSeconds(seconds))
            // 系统提示音没有可停止的音频文件，仍用短通知试听。闹钟音走上面的播放器，离开页面可停。
            let id = Self.prefix + "preview"
            self.center.add(UNNotificationRequest(identifier: id, content: content, trigger: nil)) { error in
                DispatchQueue.main.async {
                    guard token == self.previewToken else { self.reply(callback, ["ok": true]); return }
                    self.reply(callback, ["ok": error == nil])
                    self.center.removeDeliveredNotifications(withIdentifiers: [id])
                }
            }
        }
    }

    public func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification,
                                       withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        if JakobHealthReminderActions.shared.owns(notification) {
            DispatchQueue.main.async {
            if JakobHealthReminderActions.shared.canPresent(notification) {
                JakobHealthReminderActions.shared.recordPresentation(notification)
                self.presentInForeground(notification, completionHandler)
            } else { completionHandler([]) }
            }
            return
        }
        guard notification.request.identifier.hasPrefix(Self.prefix) else {
            if let previous = previousDelegate, previous.responds(to: #selector(userNotificationCenter(_:willPresent:withCompletionHandler:))) {
                previous.userNotificationCenter?(center, willPresent: notification, withCompletionHandler: completionHandler)
            } else { completionHandler([]) }
            return
        }
        DispatchQueue.main.async {
            if notification.request.identifier == Self.prefix + "preview" { completionHandler([.sound]); return }
            guard !self.scope.isEmpty, notification.request.content.userInfo["jakobMedicationScope"] as? String == self.scope else {
                completionHandler([]); return
            }
            guard JakobHealthReminderActions.shared.canPresent(notification) else {completionHandler([]);return}
            JakobHealthReminderActions.shared.recordPresentation(notification)
            self.presentInForeground(notification, completionHandler)
        }
    }

    public func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
                                       withCompletionHandler completionHandler: @escaping () -> Void) {
        DispatchQueue.main.async {
        if JakobHealthReminderActions.shared.handle(response, done: completionHandler) { return }
        if !response.notification.request.identifier.hasPrefix(Self.prefix),
           let previous = self.previousDelegate, previous.responds(to: #selector(self.userNotificationCenter(_:didReceive:withCompletionHandler:))) {
            previous.userNotificationCenter?(center, didReceive: response, withCompletionHandler: completionHandler)
        } else { completionHandler() }
        }
    }

    public override func responds(to selector: Selector!) -> Bool {
        return super.responds(to: selector) || previousDelegate?.responds(to: selector) == true
    }

    public override func forwardingTarget(for selector: Selector!) -> Any? {
        if previousDelegate?.responds(to: selector) == true { return previousDelegate }
        return super.forwardingTarget(for: selector)
    }
}
