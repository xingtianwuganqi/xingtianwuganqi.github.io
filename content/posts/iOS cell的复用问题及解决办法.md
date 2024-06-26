---
title: iOS cell的复用问题及解决办法
date: 2020-04-06
tags: [iOS]
categories: iOS笔记
---
UITableView中单元格复用有两种方法,dequeueReusableCell与dequeueReusableCell:indexPath.

```
// 1
open func dequeueReusableCell(withIdentifier identifier: String) -> UITableViewCell? // Used by the delegate to acquire an already allocated cell, in lieu of allocating a new one.
// 2
@available(iOS 6.0, *)
open func dequeueReusableCell(withIdentifier identifier: String, for indexPath: IndexPath) -> UITableViewCell // newer dequeue method guarantees a cell is returned and resized properly, assuming identifier is registered

```
<!-- more -->  

#### 这两个方法的区别
1.方法1返回的cell是一个含有这个重用标识符的无效cell,这个cell没有初始化，需要在下面判断cell是否是空，是空就初始化

```
var cell:UITableViewCell? = tableView.dequeueReusableCell(withIdentifier: "CustomTableCell")
if cell == nil {
    cell = UITableViewCell.init(style: .default, reuseIdentifier: "CustomTableCell")
}
```

2.方法2总是返回一个有效的cell，需要提前注册

```
self.tableView.register(UINib.init(nibName: "CustomTableCell", bundle:.main), forCellReuseIdentifier: "CustomTableCell")

let cell:UITableViewCell = tableView.dequeueReusableCell(withIdentifier: "CustomTableCell", for: indexPath)
```
#### 出现cell复用的问题时：
1.可以给每个cell不同的标识符

```
let identifier = "\(indexPath.row).indentifier"
var cell:UITableViewCell? = tableView.dequeueReusableCell(withIdentifier: indentifier
if cell == nil {
    cell = UITableViewCell.init(style: .default, reuseIdentifier: indentifier)
}
```

2.不设置重用标识符创建cell

```
var cell:UITableViewCell? = tableView.cellForRow(at: indexPath)
if cell == nil {
    cell = UITableViewCell.init(style: .default, reuseIdentifier: indentifier)
}
```
