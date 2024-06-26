---
title: 创建私有cocoaPods库及遇到的问题
date: 2020-03-03
tags: [Swift, Objective-C]
categories: iOS笔记

---


#### 1 .创建远端（github/gitlab）仓库

>例如：创建->projectMain作为项目主功能仓库，创建->project_login为后期引用的（登录）组件化工程。创建->project_SDK为后期引用的（基础组件SDK）组件化工程。创建->project_Repo为版本管理仓库。。等等

#### 2.创建本地仓库
>例如：新建桌面文件A文件（如有多级仓库可在A文件下创建子文件a文件、b文件、c文件等）

#### 3.将远端URL仓库克隆至本地:
```
#关键代码
git clone http://xxxx.git

tips
cd 至A文件执行克隆，如：git clone http://project_login.git
```
<!-- more -->  
#### 4. 创建podspec文件（描述pod库版本文件）:  <font color=#A52A2A> pod spec create 工程名称 </font>

>如：进入步骤3中克隆的项目文件，在隐藏文件.git同级执行：pod spec create project_login
```
tips
pod spec create project_login
```

#### 5.配置spec（描述pod库版本文件）:<font color=#A52A2A>直接XCode打开或者文本编译器打开</font>
```
Pod::Spec.new do |spec|
  spec.name         = "project_login"
  spec.version      = "1.0.2"
  spec.summary      = "project_login."
  spec.description  = <<-DESC
                project_login
                   DESC
  spec.homepage     = "http://192.168.65.252/jingjun/project_login.git"
  spec.license      = { :type => "MIT", :file => "LICENSE" }
  spec.swift_version = '4.0'
  spec.author       = { "jingjun" => "254032134@qq.com" }
  spec.platform     = :ios, "10.0"
  spec.source       = { :git => "http://192.168.65.252/jingjun/project_login.git", :tag => "#{spec.version}" }

  spec.source_files  = "project_name/swiftText/*.{swift}" 
  spec.frameworks = "Foundation","UIKit"
  #spec.ios.dependency "SDWebImage"
  spec.ios.dependency "SnapKit"
  spec.ios.dependency "RxSwift"

end
```
备注版：

```
#项目中有很多配置，下面仅书写必要的几个（一定注意配置正确）：
#下面`spec`有的直接写是`s` 注意上下对应
Pod::Spec.new do |spec|

#项目名称一般与创建的远端仓库名字一致
spec.name         = "mPaaS_Login"
#对应版本号（所有代码但凡改动就需要修改版本号：最大保持四位数：1.0.0.0）
spec.version      = "1.0.0"
#简单描述
spec.summary      = "A short description of mPaaS_Login."
#简单功能描述：一定注意`<<-DESC` 在第一行，描述内容另起一行 ，最后`DESC`一行包裹
spec.description  = <<-DESC
login
DESC
#文件页可随意写一般写仓库链接
spec.homepage     = "http://192.168.66.56:9080/iOS_HF/mPaaS_Login.git"
#协议
spec.license      = { :type => "MIT" }
#作者（版权）
spec.author             = "ws"
#支持平台版本 如还支持其他平台可百度拓展
spec.platform     = :ios, "8.0"
#项目源文件地址 远端仓库地址
spec.source       = { :git => "http://192.168.66.56:9080/iOS_HF/mPaaS_Login.git", :tag => "#{spec.version}" }
#仓库暴露的一些文件，如有引用其他动态库、静态库百度拓展
spec.ios.source_files = "HF_NHBankA/HF_NHBankA/Sources/**/*.{h,m,mm}"
#添加依赖 如有依赖下面检测合法性记得加上文件源
spec.ios.dependency "HF_mPaaSSDK"
#收尾
end
```
source_files 极易写错，注意是从project_login.podspec同级文件夹开始，一层一层写
```
// 如果swiftText文件下就是.swift文件就在swiftText后面写/*
spec.source_files  = "project_name/swiftText/*.{swift}" 
// 如果swiftText文件下还有文件夹，可以写成
spec.source_files  = "project_name/swiftText/**/*.{h,m,swift}" 
```
#### 6. 检测sepc文件配置是否正确:<font color=#A52A2A>pod lib lint --allow-warnings</font>
```
pod lib lint是只从本地验证你的pod能否通过验证
pod spec lint是从本地和远程验证你的pod能否通过验证

`--allow-warnings`意思是忽略警告，一般都加，如有报错，针对错误问题修改配置文件，如配置文件确认无误，并提示编译问题可按照： ([https://www.jianshu.com/p/88180b4d2ab7](https://www.jianshu.com/p/88180b4d2ab7))文章配置.。无误后继续`步骤7`

#万能检测命令：sources 为对应版本管理库地址
pod lib lint --allow-warnings  --sources=http://192.168.66.56:9080/iOS_HF/mPaaS_Repo.git --use-libraries --skip-import-validation --verbose


#万能检测命令：sources 为对应版本管理库地址
pod lib lint --allow-warnings  --sources=http://192.168.66.56:9080/iOS_HFAPP/HFmPaaS_Repo.git --use-libraries --skip-import-validation --verbose 
```
#### 7. 提交代码至远端仓库
```
#添加文件
git add .
#提交添加描述
git commit -m "描述"
#推送至远端仓库
git push
#打tag标签,与`步骤5`中spec文件版本保持一致
git tag 1.0.0
#推送本次所打的所有tag标签到远程origin。
git push --tags
// 注意.podspec 中的文件.version 和 tag 相同
```
#### 8. （首次）将本地私有仓库与远程管理库连接 :<font color=#A52A2A>pod repo add 版本管理仓库名 远端版本管理仓库地址url.git</font>   
```
#关联版本仓库
pod repo add project_login 'http://192.168.65.252/jingjun/project_login.git'
```
#### 9. 将spec文件推送到远程管理库 : <font color=#A52A2A>pod repo push 版本管理仓库名 组件库名.podspec --use-libraries --allow-warnings --verbose</font>  
```
pod repo push project_login project_login.podspec --use-libraries --allow-warnings --verbose

#万能推送命令(需改成自己的文件名称)：
project_login project_login.podspec --sources='http://192.168.65.252/jingjun/project_login.git,https://github.com/CocoaPods/Specs.git' --use-libraries --skip-import-validation --verbose --allow-warnings
```
#### 10.引用私有库
在主项目里Podfile文件里添加需要引用私有源地址:
```
source 'http://192.168.65.252/jingjun/project_login.git'  
source 'https://github.com/CocoaPods/Specs.git'

pod 'project_login',:git => 'http://192.168.65.252/jingjun/project_login.git'
```

### 遇到的问题
#### 1）Encountered an unknown error (Unable to find a specification for `xxxx` depended upon by `xxxx`
// 给--sources 赋值的时候，一定也要带上官方的源。
>官方的源：https://github.com/CocoaPods/Specs.git
```
pod repo push project_login project_login.podspec --sources='http://192.168.65.252/jingjun/project_login.git,https://github.com/CocoaPods/Specs.git' --use-libraries --skip-import-validation --verbose --allow-warnings
```

#### 2）[!] The `project_login.podspec` specification does not validate.
>.podspec文件存在警告时不能成功push。加 --allow-warnings

```
// 在后面加上 --allow-warnings
pod repo push project_login project_login.podspec --sources='http://192.168.65.252/jingjun/project_login.git,https://github.com/CocoaPods/Specs.git' --use-libraries --skip-import-validation --verbose --allow-warnings
```
#### 3）ERROR | [iOS] unknown: Encountered an unknown error (Unable to find a specification for `RxSwift ` depended upon by `RxSwiftExt/Core`

```
// 首先在.podspec 文件中加
spec.ios.dependency "SnapKit"
spec.ios.dependency "RxSwift"

// 再在项目的podfile 文件中加入
source 'https://github.com/CocoaPods/Specs.git'
source 'http://192.168.65.252/jingjun/project_login.git'

// 然后调用命令
pod repo push project_login project_login.podspec --sources='http://192.168.65.252/jingjun/project_login.git,https://github.com/CocoaPods/Specs.git' --use-libraries --skip-import-validation --verbose --allow-warnings
```
#### 4）ERROR | [iOS] unknown: Encountered an unknown error (Pod::DSLError) during validation
>一般是.podspec 文件格式有问题，检测是否错误输入

####5）[!] CocoaPods could not find compatible versions for pod "PLMediaStreamingKit":  In Podfile:    PLMediaStreamingKit (~> 2.3.2)Specs satisfying the `PLMediaStreamingKit (~> 2.3.2)` dependency were found, but they required a higher minimum deployment target.
```
spec.platform 的iOS版本要与主文件中 platform :ios , '7.0'，的版本一致
```

