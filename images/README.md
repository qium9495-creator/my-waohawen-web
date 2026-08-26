# WAO HAVEN 本地产品图片

按系列放入：`images/fuyi/`、`images/art/`、`images/rh-style/`、`images/Puffpop sofa/`。

文件名只使用小写英文字母、数字和短横线，不要中文、空格或括号，例如：

```text
fuyi-sofa-001-01.jpg
fuyi-sofa-001-02.jpg
art-coffee-table-003-01.webp
rh-style-bed-012-01.jpg
```

每款最多 5 张，第一张作为封面。放入图片后，在项目根目录的 `local-products.js` 中复制一段产品对象，修改文字和 `images` 路径。始终使用相对路径，不填写 Vercel 完整网址。
