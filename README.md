# JunJing.dev

基于 Hugo 和 [Stack](https://github.com/CaiJimmy/hugo-theme-stack) 的中文技术博客。

## 本地预览与构建

使用 Hugo Extended 0.147.9（已验证版本）：

```sh
hugo server --buildDrafts
hugo --cleanDestinationDir --minify
```

构建产物输出至 `docs/`，延续此仓库的静态网站目录。GitHub Pages 可使用当前分支的 `/docs` 目录发布。

主题固定为 Stack v3.31.0，源码保存在 `themes/stack/`，不需要额外下载子模块。原 Paper 主题保留在 `themes/paper/`。

站点配置在 `hugo.toml`；自定义配色和排版在 `assets/scss/custom.scss`；导航页面在 `content/page/`。文章继续放在 `content/posts/`，原有链接保持不变。

Stack 的 GPL-3.0 许可证保留在 `themes/stack/LICENSE`。

## 访问统计

使用[不蒜子原作者的统计服务](https://ibruce.info/2015/04/04/busuanzi/)，页脚显示全站访客数和总浏览量，文章页显示阅读量。`hugo.toml` 的 `params.analytics.busuanzi.enabled` 控制启用状态。

`hugo server` 预览不请求计数接口，并显示“本地预览不计数”。正式站点在页面 load 事件后请求原服务 JSONP 接口，8 秒超时，避免统计服务拖住页面加载。成功数据会缓存在当前浏览器；服务不可用且无缓存时显示 `-`，有缓存则标注为“上次统计数据”，文章阅读量仅复用相同路径的缓存。接入前的历史访问不会自动补录，访客数是服务去重后的估算值。第三方服务故障时无法获取新的真实计数，前端不会伪造数字。
