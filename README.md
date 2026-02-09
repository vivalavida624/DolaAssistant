# 简单记账应用（纯前端）

本应用是纯前端静态页面，使用 HTML/CSS/JavaScript 实现，不依赖后端数据库。

## 给 Agent 的使用方法（OpenClaw）
如果你是 OpenClaw，请按以下方法使用。

## 使用方法（推荐流程：通过助手记账）

本应用是纯前端静态页面，数据源来自仓库内的 Markdown 文件：

- 记录：`data/records.md`
- 设置：`data/settings.md`
- 小票图片：`receipt-image/`

说明：浏览器端不能直接写回仓库文件（安全限制），所以新增/修改记录建议通过“助手（李狗蛋）”来完成，由助手更新 `records.md` 并保存/重命名小票图片。

### 1) 本地运行（查看账本）

由于页面使用了 `fetch` 读取 `.md` 文件，需要静态服务器：

```bash
python3 -m http.server 8000
```

打开：

- 列表页：`http://localhost:8000/index.html`
- 详情页：在列表点击某条记录进入

可选：开发时自动刷新

- `http://localhost:8000/index.html?autoRefresh=1`
- 可自定义间隔（毫秒）：`?autoRefresh=1&interval=2000`

### 2) 记账（通过 Telegram 发给助手）

你可以用两种方式记账：

#### A) 记账 + 照片（推荐）

在 Telegram 给助手发送：“记账” + 小票照片（可附带地点/金额/备注等）。

助手会：

1. 从对话里补齐字段（至少：地点/日期/金额；可选：备注/明细）
2. 将照片保存到 `receipt-image/`
3. 按规则重命名图片文件（建议格式）：`YYYY-MM-DD_金额_地点.jpg`（地点会做清洗，避免特殊字符）
4. 更新 `data/records.md`，写入：
   - `hasImage: true`
   - `receiptImage: receipt-image/<文件名>`

助手的确认消息只会回复一句（不发长回执）：

`记住了：地点/日期/金额`

#### B) 记账 地点/日期/金额（无照片也可以）

在 Telegram 给助手发送类似：

- `记账 Costco/2026-02-09 19:20/368.90`
- 或不写日期：`记账 Costco/368.90`

规则：

- 日期不写：默认取发送消息当时的时间（本地时区）
- 无照片：记录为无图（`hasImage: false`，`receiptImage` 留空或使用占位）

助手同样只回复一句：

`记住了：地点/日期/金额`

### 3) records.md 记录格式参考

每条记录块示例：

```md
## rec-001
- date: 2026-02-08 14:20
- location: Costco
- amount: 368.90
- note: 家庭周采购
- hasImage: true
- receiptImage: receipt-image/2026-02-08_368.90_Costco.jpg

### items
- 商品名 | 规格 | 数量
```
