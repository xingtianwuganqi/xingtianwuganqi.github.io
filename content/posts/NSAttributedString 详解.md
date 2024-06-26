---
title: NSAttributedString 详解
date: 2018-08-29
tags: [Swift]
categories: iOS笔记
---

# NSAttributedString 详解

* 主要的几个属性：

```
@available(iOS 6.0, *)
public static let font: NSAttributedStringKey // 字体，value是UIFont对象,默认：字体：Helvetica(Neue) 字号：12

@available(iOS 6.0, *)
public static let paragraphStyle: NSAttributedStringKey // 绘图的风格（居中，换行模式，间距等诸多风格），value是NSParagraphStyle对象

@available(iOS 6.0, *)
public static let foregroundColor: NSAttributedStringKey // 文字颜色，value是UIFont对象，默认值为黑色

@available(iOS 6.0, *)
public static let backgroundColor: NSAttributedStringKey // 背景色，value是UIFont，默认值为nil, 透明色

@available(iOS 6.0, *)
public static let ligature: NSAttributedStringKey // 字符连体，value是NSNumber，0 表示没有连体字符，1 表示使用默认的连体字符

@available(iOS 6.0, *)
public static let kern: NSAttributedStringKey // 字符间隔，value是NSNumber，正值间距加宽，负值间距变窄

@available(iOS 6.0, *)
public static let strikethroughStyle: NSAttributedStringKey // 删除线，value是NSNumber

@available(iOS 6.0, *)
public static let underlineStyle: NSAttributedStringKey // 下划线，value是NSNumber

@available(iOS 6.0, *)
public static let strokeColor: NSAttributedStringKey // 描绘边颜色，value是UIColor,默认值为nil，设置的属性同ForegroundColor

@available(iOS 6.0, *)
public static let strokeWidth: NSAttributedStringKey // 描边宽度，value是NSNumber，负值填充效果，正值中空效果

@available(iOS 6.0, *)
public static let shadow: NSAttributedStringKey // 阴影，value是NSShadow对象，默认值为nil

@available(iOS 7.0, *)
public static let textEffect: NSAttributedStringKey // 文字效果，value是NSString，目前只有图版印刷效果可用, 使用此属性指定的文字效果，如NSTextEffectLetterpressStyle。此属性的默认值为nil，表示没有文本效应

@available(iOS 7.0, *)
public static let attachment: NSAttributedStringKey // 附属，value是NSTextAttachment 对象,常用于文字图片混排

@available(iOS 7.0, *)
public static let link: NSAttributedStringKey // 链接，value是NSURL or NSString

@available(iOS 7.0, *)
public static let baselineOffset: NSAttributedStringKey // 基础偏移量，value是NSNumber对象，正值上偏，负值下偏, 默认值是0

@available(iOS 7.0, *)
public static let underlineColor: NSAttributedStringKey // 下划线颜色，value是UIColor对象,默认值为nil

@available(iOS 7.0, *)
public static let strikethroughColor: NSAttributedStringKey // 删除线颜色，value是UIColor，默认值为黑色

@available(iOS 7.0, *)
public static let obliqueness: NSAttributedStringKey // 字体倾斜，取值为 NSNumber （float）,正值右倾，负值左倾, 默认值是0(表示没有倾斜)

@available(iOS 7.0, *)
public static let expansion: NSAttributedStringKey //字体扁平化，取值为 NSNumber （float）,正值横向拉伸文本，负值横向压缩文本

@available(iOS 7.0, *)
public static let writingDirection: NSAttributedStringKey //设置文字书写方向，从左向右书写或者从右向左书写

@available(iOS 6.0, *)
public static let verticalGlyphForm: NSAttributedStringKey //垂直或者水平，value是 NSNumber，0 表示横排文本，1 表示竖排文本 在iOS中, 总是以横向排版		
	
```

<!-- more -->
* NSParagraphStyle与NSMutableParagraphStyle包括以下属性

	* alignment ->对齐方式
	* firstLineHeadIndent ->首行缩进
	* headIndent ->缩进
	* tailIndent ->尾部缩进
	* lineBreakMode ->断行方式
	* maximumLineHeight ->最大行高
	* minimumLineHeight ->最低行高
	* lineSpacing ->行距
	* paragraphSpacing ->段距
	* paragraphSpacingBefore ->段首空间
	* baseWritingDirection ->句子方向
	* lineHeightMultiple ->可变行高,乘因数。
	* hyphenationFactor ->连字符属性
