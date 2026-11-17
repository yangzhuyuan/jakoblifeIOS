# iOS 吃药与血压提醒

此 UTS 插件负责吃药和血压提醒的 iOS 本地通知。页面、账号校验和服务器存储沿用现有提醒模块，不会读取或修改扫描数据。Android 继续使用 `Jakob-MedicationReminder` AAR。

## 打包

使用支持 Swift 混编的 HBuilderX（4.25+，本项目检查使用 4.74）重新云打包 iOS App 或自定义基座。完整替换 `uni_modules/jakob-medication-ios` 目录，包含新增的 `JakobReminderScheduleQueue.swift`、其他 Swift 文件、`config.json` 和三个 WAV 资源。插件入口由 `pages/tabBar/main/Reminders/api/medicationNotifications.js` 在 App 中导入，并仅在 iOS 调用。原生 Swift 和 `Resources` 会随 UTS 编译产物上传，不需要另装第三方 SDK，也不需要配置 APNs 服务。仅更新 WGT 无法加入本次原生能力。

HBuilderX 的 [Swift 混编说明](https://uniapp.dcloud.net.cn/plugin/uts-plugin-hybrid.html) 和 [资源目录说明](https://uniapp.dcloud.net.cn/plugin/uts-for-ios.html#_3-3-依赖资源文件) 描述了编译和资源合并方式。

## 行为

- 使用 `UNCalendarNotificationTrigger` 按手机当地时间每天或每周重复；通知由 iOS 投递，不依赖后台 JS 定时器。
- 提示音支持系统默认、闹钟及静音。保留附件版本的 `soundSeconds`（2、12、24）设置，分别使用 2.4、12、24 秒 PCM WAV；可用 `python scripts/build_medication_ios_sound.py` 重建。前台闹钟与试听通过播放器播放，离开 App 会停止；`dismissHealthReminder` 按投递标识停止对应的前台闹钟，不影响下一次提醒。
- 首次启用请求通知和声音授权；权限关闭时显示提示并可打开 App 的系统设置。声音服从手机静音、音量、专注模式和系统通知设置，不使用紧急通知权限。
- 相同时间、声音的药品合并；每天重复只占一条待处理请求。为兼容系统容量，以整个 App 最多 64 条待处理通知为界，扣除其他功能的现有请求。超出时保留服务器设置、取消过期的吃药计划并显示明确提示，不能悄悄截断。
- 通知、缓存键、分组和请求标识均使用独立的 `jakob.medication` 前缀。删除、关闭、退出和切换账号只取消自己的通知，其他通知的 delegate 回调继续转发。
- 血压使用 `jakob.health.v1.` 前缀的一次性日期通知，按未来 32 天生成候选，再根据整个 App 的剩余容量安排最近的提醒。前台和通知操作时续排；`bpScheduledThrough` 返回已核验的队列截止日期。

## 1.0.1 血压排程修正

- 血压、吃药和前台续排共用串行队列，避免同时读取容量、删除和添加通知。
- 保留配置未变化的通知，只移除过期标识并更新变化项，取消附件版本反复清空队列和固定截为 20 条的处理。
- 系统返回添加失败时不再将部分成功当作全部成功；添加后查询系统队列核对，截止日期以实际已安排的通知计算。
- 保留系统错误的 `code`、`stage`、`nativeDomain`、`nativeCode`、`message`，控制台输出以 `[JakobReminder]` 开头。`status` 的 `bpSchedulingError` 也可读取最近一次错误。不记录账号或授权令牌。

截图的通用提示没有包含系统错误码，不能仅凭截图确定唯一原因。若完整重新打包后血压保存仍失败，需查看上述日志；区分 `STALE_SESSION`、`INVALID_PLAN`、`PERMISSION`、`LIMIT`、`SCHEDULE` 和 `SCHEDULE_INCOMPLETE` 后继续定位。

## 验证

Node 测试覆盖计划生成、星期映射、声音隔离、错误返回、页面提示、账号隔离及 WAV 格式/时长。当前修订在 Windows 环境完成代码检查和 JS/资源回归，未完成 Xcode 编译、IPA 安装和 iPhone 真机验证。

iPhone 打包后重点验证：连续保存血压设置、改变时间/铃声时长后保存、退后台再回前台、血压和吃药同开、实际到点提醒，以及前台弹窗取消停止本次声音。另需验证关闭/删除提醒、账号退出切换和已有推送。
