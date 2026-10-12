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

`hugo server` 预览不加载统计脚本，避免本地访问产生无关计数。正式构建后上线才加载真实数据；加载前或服务不可用时显示 `—`，不显示虚假数字。接入前的历史访问不会自动补录，访客数是服务去重后的估算值。
