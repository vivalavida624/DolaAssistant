# 简单记账应用（纯前端）

## 功能
- `index.html`：记录列表页（主页）
- `detail.html`：记录详情页（小票图片 + 商品明细）
- `settings.html`：应用配置页（姓名 + 头像）
- 所有初始数据来自 Markdown 文件：
  - `data/records.md`
  - `data/settings.md`

## 运行
因为页面里使用了 `fetch` 读取 `.md` 文件，请使用本地静态服务器访问：

```bash
python3 -m http.server 8000
```

然后打开 `http://localhost:8000/index.html`。

## 数据格式
`data/records.md` 每条记录格式：

```md
## rec-001
- date: 2026-02-08 14:20
- location: 山姆会员店
- amount: 368.90
- note: 家庭周采购
- hasImage: true
- receiptImage: receipt-image/receipt-1.svg

### items
- 商品名 | 规格 | 数量
```

`data/settings.md`：

```md
- name: 小舒
- avatar: assets/avatar-default.svg
```

## 说明
浏览器端不能直接修改项目里的本地 `.md` 文件：
- 设置页支持保存到浏览器（`localStorage`）
- 同时支持导出 `settings.md`，你可以手动替换 `data/settings.md`
