---
title: iOS 实现列表下拉顶部图片放大
date: 2020-01-13
tags: [Swift]
categories: iOS笔记

---
### 实现思路

tableview 下拉中露出的tableview背景时，动态设置顶部的图片高度，使用图片盖住露出的tableview背景


[demo地址](https://github.com/xingtianwuganqi/ListTopImgDemo)


#### 代码示例：

<!-- more -->  


```
import UIKit
import RxSwift

let ScreenW = UIScreen.main.bounds.size.width
let statusBarH = UIApplication.shared.statusBarFrame.size.height

class AccountHeaderView: UIView {
    
    var disposeBag = DisposeBag()
    
    lazy var panoView : UIImageView = {
        let imgView = UIImageView()
        imgView.image = UIImage(named: "avator")
        imgView.contentMode = .scaleAspectFill
        imgView.clipsToBounds = true
        return imgView
    }()
    
    
    var bgImgFrame: CGRect
    
    // 展示其他信息
    var infoView: UIView?
    
    lazy var backPanoView :  UIView = {
        let view = UIView()
        return view
    }()
        
    override init(frame:CGRect) {
        
        self.bgImgFrame = CGRect(x: 0, y: 0, width: ScreenW, height: 200)
        super.init(frame: frame)
                
        self.addSubview(backPanoView)
        self.backPanoView.addSubview(panoView)
        // 展示其他信息
        self.infoView = UIView()
        self.addSubview(infoView!)
        
        self.backPanoView.frame = self.bgImgFrame
        
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.panoView.snp.makeConstraints { (make) in
            make.edges.equalToSuperview()
        }
    
        
        self.infoView?.snp.makeConstraints { (make) in
            make.top.equalToSuperview().offset(200)
            make.left.right.equalToSuperview()
            make.bottom.equalToSuperview()
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    func scrollVieDidScroll(offsetY: CGFloat) {
        
        // 在tableview滑动过程中重新这只backPanoView 的frame
        if offsetY <= 0{
            var rect = self.backPanoView.frame
            rect.origin.y = offsetY
            rect.size.height = 200 - offsetY
            self.backPanoView.frame = rect
            self.panoView.setNeedsLayout()
            
        }
        
    }
}

```