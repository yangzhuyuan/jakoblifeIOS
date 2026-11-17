import DCloudUTSFoundation
import UIKit
public typealias InvokeMedicationIOS = (_ method: String, _ payload: String, _ callback: @escaping (_ result: String) -> Void) -> Void
@objc(UTSSDKModulesJakobMedicationIosJakobReminderHook)
@objcMembers
public class JakobReminderHook : NSObject, UTSiOSHookProxy {
    public func applicationDidFinishLaunchingWithOptions(_ application: UIApplication?, _ launchOptions: Map<UIApplication.LaunchOptionsKey, Any>? = nil) -> Bool {
        JakobMedicationNotifications.bootstrap()
        return false
    }
}
public var invokeMedicationIOS: InvokeMedicationIOS = {
(_ method: String, _ payload: String, _ callback: @escaping (_ result: String) -> Void) -> Void in
JakobMedicationNotifications.invoke(method, payload, {
(_ result: String) -> Void in
callback(result)
})
}
@objc(UTSSDKModulesJakobMedicationIosJakobReminderHookByJs)
@objcMembers
public class JakobReminderHookByJs : JakobReminderHook {
    public func applicationDidFinishLaunchingWithOptionsByJs(_ application: UIApplication?, _ launchOptions: Map<UIApplication.LaunchOptionsKey, Any>? = nil) -> Bool {
        return self.applicationDidFinishLaunchingWithOptions(application, launchOptions)
    }
}
public func invokeMedicationIOSByJs(_ method: String, _ payload: String, _ callback: UTSCallback) -> Void {
    return invokeMedicationIOS(method, payload, {
    (result: String) -> Void in
    callback(result)
    })
}
@objc(UTSSDKModulesJakobMedicationIosIndexSwift)
@objcMembers
public class UTSSDKModulesJakobMedicationIosIndexSwift : NSObject {
    public static func s_invokeMedicationIOSByJs(_ method: String, _ payload: String, _ callback: UTSCallback) -> Void {
        return invokeMedicationIOSByJs(method, payload, callback)
    }
}
