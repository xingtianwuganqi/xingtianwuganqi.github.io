
---
title: mac 蓝牙键盘、鼠标断开连接之后无法重新连接的解决办法
date: 2018-08-08
categories: 随笔
---



### 网上找的方法，记录一下
find ~/Library -name com.apple.Bluetooth.\*.plist -exec rm{}\;

sudo rm /Library/Preferences/com.apple.Bluetooth.plist

重启之后重新配置一下蓝牙设备。
