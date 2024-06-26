---
title: Swift 简单的圆形进度条
date: 2019-09-15
tags: [Swift, Objective-C]
categories: iOS笔记
---


### 下载时的圆形进度条
##### 示例图：
<!-- more -->
![download.gif](https://upload-images.jianshu.io/upload_images/8042403-4ab441e0e881395f.gif?imageMogr2/auto-orient/strip)
##### 代码如下：

```
import UIKit
func degreesToRadians(x:CGFloat) -> CGFloat{
    return CGFloat(double_t.pi) * (x) / 180.0
}
let ProgressDownload = 1


class NewsYBDownLoadVIew: UIView {

    var _trackLayer:CAShapeLayer?
    var _progressLayer:CAShapeLayer?
    private var progress:CGFloat = 0
    
    //中间叉的图片
    private let cancelImg : UIImageView = {
        let image = UIImageView()
        image.image = UIImage(named: "news_yb_cancel_down")
        return image
    }()
    // 在合适的位置设计setprogress 属性即可
    var setprogress:CGFloat = 0{
        
        willSet {
            changeProgress(progress: newValue)
        }
    
    }
    
    override func draw(_ rect: CGRect) {
        // Drawing code
        //创建一个track shape layer
        _trackLayer = CAShapeLayer()
        _trackLayer?.frame = self.bounds
        _trackLayer?.fillColor = UIColor.clear.cgColor
        _trackLayer?.strokeColor = UIColor(hexString: "#a6a6a6")!.cgColor
        self.layer.addSublayer(_trackLayer!)
        
        //
        _trackLayer?.opacity = 1 //背景透明度
        _trackLayer?.lineCap = CAShapeLayerLineCap.round //指定线的边缘是园的
        _trackLayer?.lineWidth = CGFloat(ProgressDownload) //线的宽度
    
        /*
         center：圆心的坐标
         radius：半径
         startAngle：起始的弧度
         endAngle：圆弧结束的弧度
         clockwise：true为顺时针，false为逆时针
         方法里面主要是理解startAngle与endAngle
         */
        let path = UIBezierPath.init(arcCenter: CGPoint(x:self.frame.size.width/2,y:(self.frame.height/2)), radius: self.frame.width/2, startAngle: degreesToRadians(x: -90), endAngle: degreesToRadians(x: 270), clockwise: true)
        _trackLayer?.path = path.cgPath
        // 把path传递給layer，然后layer会处理相应的渲染，整个逻辑和CoreGraph是一致的。
        _progressLayer = CAShapeLayer()
        _progressLayer?.frame = self.bounds
        _progressLayer?.fillColor = UIColor.clear.cgColor
        _progressLayer?.strokeColor = UIColor(hexString: "#FFB644")!.cgColor
            _progressLayer?.lineCap = CAShapeLayerLineCap.round
        _progressLayer?.lineWidth = CGFloat(ProgressDownload)
        _progressLayer?.path = path.cgPath
        _progressLayer?.opacity = 1
        _progressLayer?.strokeEnd = 0
        self.layer.addSublayer(_progressLayer!)
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = UIColor.white
        self.setUpSubViews()
    }
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func setUpSubViews(){
        self.addSubview(cancelImg)
        cancelImg.frame = CGRect(x: 5, y: 5, width: 9, height: 9)
    }
    
    func changeProgress(progress: CGFloat) {
        self.progress = progress
        _progressLayer?.strokeEnd = self.progress
    }
    
}


```
