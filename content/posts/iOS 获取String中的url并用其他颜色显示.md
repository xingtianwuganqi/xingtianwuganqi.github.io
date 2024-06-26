---
title: iOS 获取String中的url并用其他颜色显示
date: 2018-08-09
tags: [Swift, Objective-C]
categories: iOS笔记
---

### 这里用textView显示带url的String
```
fileprivate let detailText	= UITextView().then { (textview)in

    textview.font = UIFont.systemFont(ofSize:14)

    textview.textColor = UIColor(hexString:"#333333")

    textview.isEditable =false;        //必须禁止输入，否则点击将弹出输入键盘

    textview.isScrollEnabled =false;

}

```
<!-- more -->
### 用这个方法获取url,获取url的数组
```
private func getUrls(str:String) -> [String] {

        varurls = [String]()
        
        // 创建一个正则表达式对象
        do{

            let dataDetector = try NSDataDetector(types:NSTextCheckingTypes(NSTextCheckingResult.CheckingType.link.rawValue))

            // 匹配字符串，返回结果集
            let res = dataDetector.matches(in: str,options:NSRegularExpression.MatchingOptions(rawValue:0),range:NSMakeRange(0, str.count))
                                                   
            // 取出结果
            for checkingRes in res {
                urls.append((str as NSString).substring(with: checkingRes.range))

            }
        }

        catch{
            print(error)
        }
        returnurls
    }

```
### 获取url数组
```
let arr =self.getUrls(str: state.detail)

let attrubuteStr = NSMutableAttributedString(string: state.detail)

if arr.count >0{

 	for i in arr {

       let nsString = NSString(string: state.detail)

       let bigRange = nsString.range(of: state.detail)

       let range = nsString.range(of: i)

    	attrubuteStr.addAttribute(NSAttributedStringKey.font, value:  UIFont.systemFont(ofSize:14), range: bigRange)

   		attrubuteStr.addAttribute(NSAttributedStringKey.foregroundColor, value: UIColor(hexString:"#286efa")!, range: range)

    	attrubuteStr.addAttribute(NSAttributedStringKey.link, value: i, range: range)
    }

}else{

  let nsString = NSString(string: state.detail)

  let bigRange = nsString.range(of: state.detail)

  attrubuteStr.addAttribute(NSAttributedStringKey.font, value:  UIFont.systemFont(ofSize:14), range: bigRange)

}
self.detailText.attributedText = attrubuteStr
```
### 最后实现textView的代理方法，点击url触发事件
```
func textView(_textView:UITextView, shouldInteractWith URL:URL, in characterRange:NSRange, interaction:UITextItemInteraction) ->Bool{
    self.navigatorService?.navigatorSubject.onNext(NavigatorItem.WebPage("","\(URL)"))
    return false
}
```
