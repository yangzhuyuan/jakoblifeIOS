## 1.0.6-nehotspot（本地修复）
+ iOS 14+ 使用 NEHotspotNetwork.fetchCurrent 获取当前 WiFi，修复 getConnectedWifi 返回 12010
+ partialInfo 仅需 SSID 即可成功
+ 修复定位权限拒绝后不回调的问题

## 1.0.6（2023-11-13）
+ 统一错误码格式
+ 修复部分真机未链接wifi可能卡死的bug
## 1.0.0（2022-12-05）
实现Android/iOS平台Wi-Fi功能模块  
注：iOS平台仅支持获取已连接的 Wi-Fi 信息
