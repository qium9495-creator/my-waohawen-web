# WAO HAVEN 本地产品录入说明

网站公开产品页现在直接读取 `local-products.js`，不依赖 Supabase。新增产品时不需要新建 HTML 页面。

## 1. 放置图片

按系列放入对应目录：

- `images/fuyi/`
- `images/art/`
- `images/rh-style/`
- `images/Puffpop sofa/`

文件名只用小写英文、数字和短横线，例如：

`images/fuyi/sofa-fy-001-01.jpg`

一款产品最多 5 张图，数组中的第一张图自动作为封面。

## 2. 新增产品

打开 `local-products.js`，在数组最后一个产品对象后加英文逗号，再复制下面整段：

```js
{
  id: 'fuyi-sofa-001',
  sku: 'WAO-FY-SF-001',
  name: 'Classic Linen Sofa',
  nameZh: '经典亚麻三人沙发',
  collection: 'Fuyi Collection',
  room: 'Living Room',
  category: 'Sofa & Sectionals',
  style: 'American Legacy',
  price: 12800,
  description: '在这里填写产品介绍。',
  material: '实木框架 / 亚麻面料',
  dimensions: '220 × 95 × 82 cm',
  finish: '深胡桃木色',
  images: [
    'images/fuyi/sofa-fy-001-01.jpg',
    'images/fuyi/sofa-fy-001-02.jpg',
    'images/fuyi/sofa-fy-001-03.jpg'
  ],
  status: 'published',
  sort_order: 100
}
```

网站显示名已将 FUYI 改为 `Versailles`。为兼容现有产品链接和图片目录，数据中的内部系列值仍必须使用以下其中一个：

- `Fuyi Collection`
- `Art Collection`
- `RH-Style Collection`

`status: 'published'` 表示展示；改成 `status: 'draft'` 可暂时隐藏。`sort_order` 数字越小越靠前。

## 3. 本地检查

保存文件后打开：

- 全部产品：`http://127.0.0.1:4173/products.html`
- Versailles（兼容旧内部值）：`products.html?collection=Fuyi%20Collection`
- Art：`products.html?collection=Art%20Collection`
- RH-Style：`products.html?collection=RH-Style%20Collection`

点击产品卡片即可进入共用详情页；无需为每款产品复制详情 HTML。

## 4. 发布上线

确认本地图片、筛选和详情正常后，把 `images` 与 `local-products.js` 一起提交到 GitHub。Vercel 会自动更新。

不要把图片写成完整线上网址，也不要使用中文、空格或反斜杠路径。
