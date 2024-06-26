---
title: iOS 获取相册中的视频列表
date: 2019-08-07
tags: [Swift]
categories: iOS笔记
---


#### 获取相册中的视频文件
```
func getAllvideo() {

        let cameraRolls = PHAssetCollection.fetchAssetCollections(with: .smartAlbum, subtype: .smartAlbumVideos, options: nil)
        print(cameraRolls)
        guard cameraRolls.count > 0 else {
            return
        }
        for i in 0 ..< cameraRolls.count {
            let albumCollection = cameraRolls[i]
            // 获取相簿(albumCollection)下所有PHAsset对象并存储在集合albumAssets中
            LOGGER.debug(albumCollection.localizedTitle)
            let albumAssets = PHAsset.fetchAssets(in: albumCollection, options: nil)
    
            for i in 0 ..< albumAssets.count  {
                let asset = albumAssets[i]
                let filetype = asset.mediaType
                if filetype == PHAssetMediaType.video {
                    videoMessage(asset: asset,count: albumAssets.count)
                }
                continue
            }

        }
    }
```
<!-- more -->
#### 获取视频信息
```
// 获取PHAsset 对象的信息
  func videoMessage(asset: PHAsset , count: Int) {
        let options = PHVideoRequestOptions()
        options.version = .current
        options.deliveryMode = .automatic
        options.isNetworkAccessAllowed = true  // 获取iCloud 中的视频
        
        var iconImage = UIImage()
        
        let option = PHImageRequestOptions()
        option.resizeMode = PHImageRequestOptionsResizeMode.fast
        // 获取视频对于的图片
        PHImageManager.default().requestImage(for: asset, targetSize: CGSize(width: 116, height: 78), contentMode: PHImageContentMode.default, options: option) { (image, info) in
            if let img = image {
                iconImage = img
            }
        }

        PHImageManager.default().requestAVAsset(forVideo: asset, options: options) { [weak self](asset, audioMix, info) in
            
            LOGGER.debug(asset)
            LOGGER.debug(audioMix)
            LOGGER.debug(info)
            
            guard let ass = asset else {
                return
            }
            
            guard let url = ass as? AVURLAsset else {
                return
            }
            var size : Float = 0
            do {
                let si = try url.url.resourceValues(forKeys: [URLResourceKey.fileSizeKey])
                size = Float(si.fileSize ?? 0) / (1024.0*1024.0)
            }catch {
                
            }
            // 计算时长
            let time = ass.duration
            let seconds = ceil(Float(time.value)/Float(time.timescale))
            let minute = String(format: "%ld", Int(floor(seconds / 60)))
            let second = String(format: "%.2ld", Int(seconds) % 60)
            let times = "\(minute):\(second)"
        
            //获取拍摄时间
            let date = ass.creationDate?.dateValue
            let dataFormat = DateFormatter()
            dataFormat.dateFormat = "yyyy:MM:dd HH:mm:ss"
            let cDate = dataFormat.string(from: date ?? Date(timeIntervalSinceNow: 0))
            
            
            let name = url.url.absoluteString.components(separatedBy: "/").last?.components(separatedBy: ".").first ?? ""
            let format = url.url.absoluteString.components(separatedBy: "/").last?.components(separatedBy: ".").last ?? ""
            
            let videoinfo = videoInfo(image: iconImage, name: name, time: times, urlStr: url.url.absoluteString, length: times, selected: false, date: cDate, size: size, second: String(format: "%.0f", seconds),format: format)
            // 一定要在主线程中加入到数组，不然会出现崩溃
            DispatchQueue.main.async {
                self?.videoArr.append(videoinfo)
                self?._mainTableView.reloadData()
            }
        }
    }
```
# 在测试中，上述方法可以获取相册视频的文件地址，但是在部分手机上，将文件地址转换成data上传到服务器时出错了
```
let data : Data
        do {
            data = try Data.init(contentsOf: URL.init(string: path))
            manager?.put(data, key: key, token: token, complete: { [weak self](info, key, resp) in
          
                }, option: options)
        }catch let error {
            // 这里报错，打印出来是
            /*
          Error Domain=NSCocoaErrorDomain Code=257 "The file “IMG_0288.MP4” couldn’t be\
          opened because you don’t have permission to view it." UserInfo=
          {NSFilePath=/var/mobile/Media/DCIM/100APPLE/IMG_0288.MP4, 
          NSUnderlyingError=0x17d761b0 {Error Domain=NSPOSIXErrorDomain Code=1 
          "Operation not permitted"}}

            */
            print(error)
            LOGGER.debug("filepath 转 data 失败")
            HUDUtilInstance.showHUD(message: "获取视频失败")
        }
```
通过查资料[https://io.upyun.com/2016/03/23/the-real-files-in-alasset-and-phasset/](https://io.upyun.com/2016/03/23/the-real-files-in-alasset-and-phasset/)
代码调整为
#### 获取相册中的视频文件
```
func getAllvideo() {

        let cameraRolls = PHAssetCollection.fetchAssetCollections(with: .smartAlbum, subtype: .smartAlbumVideos, options: nil)
        print(cameraRolls)
        
        guard cameraRolls.count > 0 else {
            return
        }
        
        for i in 0 ..< cameraRolls.count {
            let albumCollection = cameraRolls[i]
            // 获取相簿(albumCollection)下所有PHAsset对象并存储在集合albumAssets中
            LOGGER.debug(albumCollection.localizedTitle)
            let albumAssets = PHAsset.fetchAssets(in: albumCollection, options: nil)
                for i in 0 ..< albumAssets.count  {
                    let asset = albumAssets[i]
                    let filetype = asset.mediaType
    //                if filetype == PHAssetMediaType.video {
    //                    videoMessage(asset: asset,count: albumAssets.count)
    //                }
                    if filetype == PHAssetMediaType.video {
                            
                        // 通过asset 获取视频
                        let assetResources = PHAssetResource.assetResources(for: asset)
                        var resources : PHAssetResource?
                        for assetRes in assetResources {
                            if #available(iOS 9.1, *) {
                                if assetRes.type == PHAssetResourceType.video || assetRes.type ==  PHAssetResourceType.pairedVideo {
                                    resources = assetRes
                                }else{
                                    print("失败")
                                }
                            } else {
                                // Fallback on earlier versions
                            }
                        }
                        
                        var fileName = ""
                        guard let resource = resources ,resource.originalFilename.count > 0 else{
                            continue
                        }
                        fileName = resource.originalFilename
                        print(fileName)
                        // 获取视频地址成功
                        self.videoMessage(assetPH: asset, fileName: fileName,resource: resource)
                        
                        
                }
            }

        }
    }

```
#### 获取信息
```
// 获取PHAsset 对象的信息
    func videoMessage(assetPH: PHAsset,fileName: String,resource: PHAssetResource) {
        let options = PHVideoRequestOptions()
        options.version = .current
        options.deliveryMode = .automatic
        options.isNetworkAccessAllowed = true
        
        var iconImage = UIImage()
        
        let option = PHImageRequestOptions()
        option.resizeMode = PHImageRequestOptionsResizeMode.fast
        
        // 获取视频对于的图片
        PHImageManager.default().requestImage(for: assetPH, targetSize: CGSize(width: 116, height: 78), contentMode: PHImageContentMode.default, options: option) { (image, info) in
            if let img = image {
                iconImage = img
            }
        }

        PHImageManager.default().requestAVAsset(forVideo: assetPH, options: options) { [weak self](asset, audioMix, info) in
            
            LOGGER.debug(asset)
            LOGGER.debug(audioMix)
            LOGGER.debug(info)
            
            guard let ass = asset else {
                return
            }
            
            guard let url = ass as? AVURLAsset else {
                return
            }
            var size : Float = 0
            do {
                let si = try url.url.resourceValues(forKeys: [URLResourceKey.fileSizeKey])
                size = Float(si.fileSize ?? 0) / (1024.0*1024.0)
            }catch {
                
            }
            // 计算时长
            let time = ass.duration
            let seconds = ceil(Float(time.value)/Float(time.timescale))
            let minute = String(format: "%ld", Int(floor(seconds / 60)))
            let second = String(format: "%.2ld", Int(seconds) % 60)
            let times = "\(minute):\(second)"
        
            //获取拍摄时间
            let date = ass.creationDate?.dateValue
            let dataFormat = DateFormatter()
            dataFormat.dateFormat = "yyyy:MM:dd HH:mm:ss"
            let cDate = dataFormat.string(from: date ?? Date(timeIntervalSinceNow: 0))
            
            
//            let name = url.url.absoluteString.components(separatedBy: "/").last?.components(separatedBy: ".").first ?? ""
//            let format = url.url.absoluteString.components(separatedBy: "/").last?.components(separatedBy: ".").last ?? ""
            
            let name = fileName.components(separatedBy: ".").first ?? ""
            let format = fileName.components(separatedBy: ".").last ?? ""
            
            let videoinfo = videoInfo(image: iconImage, name: name, time: times, urlStr: nil, length: times, selected: false, date: cDate, size: size, second: String(format: "%.0f", seconds),format: format)
            
            self?.getVideo(asset: assetPH, fileName: fileName, resource: resource, info: videoinfo)

            
//            DispatchQueue.main.async {
//                self?.videoArr.append(videoinfo)
//                self?._mainTableView.reloadData()
//            }
        }
    }
```
#### 将视频写入到本地，从本地读取
```
// 获取视频
    func getVideo(asset: PHAsset,fileName: String,resource: PHAssetResource,info: videoInfo) {
        if #available(iOS 9.1, *) {
            if asset.mediaType == PHAssetMediaType.video || asset.mediaSubtypes == PHAssetMediaSubtype.photoLive {
            
                let pathMovieFile = NSTemporaryDirectory().appendingPathComponent(fileName)
                try? FileManager.default.removeItem(atPath: pathMovieFile)
                
                PHAssetResourceManager.default().writeData(for: resource, toFile: URL.init(fileURLWithPath: pathMovieFile), options: nil) { [weak self](error) in
                    guard error == nil else {
                        return
                    }
//                    do {
////                        let data = try Data.init(contentsOf: URL.init(fileURLWithPath: pathMovieFile))
////                        print("转data成功")
//                    }catch let error{
//                        print(error)
//                        print("转data失败")
//                    }
                    var video = info
                    video.setUrl(url: pathMovieFile) // 获取到视频url后存入到视频信息中
                    // 刷新列表， 一定要在主线程中加入到数组，不然会出现崩溃
                    DispatchQueue.main.async {
                        self?.videoArr.append(video)
                        self?._mainTableView.reloadData()
                    }

                }
                
                
            }else{

            }
        } else {
            // Fallback on earlier versions
        }
    }

        // 转成data
        let data : Data
        do {
            data = try Data.init(contentsOf: URL.init(fileURLWithPath: path))
            
        }catch let error {
            print(error)
            LOGGER.debug("filepath 转 data 失败")
            HUDUtilInstance.showHUD(message: "获取视频失败")
        }
```
#### 最后注意在适合的地方删除本地的缓存
