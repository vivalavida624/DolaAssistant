# 记账应用规划与实施记录

## 1. 目标
构建一个简单记账应用，要求：
- 不使用框架（仅 HTML/CSS/JavaScript）
- 三个页面：列表页（主页）、详情页、配置页
- 不使用数据库/后端，使用 Markdown（`.md`）存储数据

## 2. 页面规划

### 2.1 列表页（主页）
页面文件：`index.html`
- 展示全部购物记录
- 字段：时间、地点、金额、备注、是否包含图片
- 支持点击进入详情页
- 后续按需求调整为：表头只展示一次，记录行只展示具体内容

### 2.2 详情页
页面文件：`detail.html`
- 显示单条购物记录详细信息
- 展示小票图片
- 展示商品明细：名称、规格、数量
- 后续按需求调整布局顺序：左侧购物明细，右侧小票图片

### 2.3 配置页
页面文件：`settings.html`
- 配置用户姓名与头像
- 提供头像预览
- 保存到浏览器本地存储（localStorage）
- 支持导出 `settings.md`

## 3. 数据与结构规划

### 3.1 目录结构
- `index.html`
- `detail.html`
- `settings.html`
- `styles.css`
- `app.js`
- `data/records.md`
- `data/settings.md`
- `assets/avatar-default.svg`
- `receipt-image/receipt-placeholder.svg`
- `receipt-image/receipt-1.svg`
- `README.md`

### 3.2 Markdown 数据格式

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

`data/settings.md` 格式：

```md
- name: 小舒
- avatar: assets/avatar-default.svg
```

## 4. 已完成修改记录

### 4.1 初版功能实现
- 完成三页面搭建：`index.html`、`detail.html`、`settings.html`
- 实现统一样式：`styles.css`
- 实现数据读取与解析：`app.js`
  - 读取并解析 `data/records.md`
  - 读取 `data/settings.md`
  - 渲染列表与详情
  - 配置保存到 localStorage
  - 导出 settings.md
- 补充示例资源与文档：`assets/*`、`README.md`

### 4.2 本地访问问题排错
问题现象：浏览器显示站点无法连接（类似 `localhost refused to connect`）。
处理结果：
- 确认是本地静态服务未成功启动（端口绑定权限问题）
- 重新启动静态服务后恢复正常访问

### 4.3 列表页优化（表头只出现一次）
按需求完成：
- 将原先每条记录内的“时间/地点/金额/备注/图片”小标签移除
- 改为列表顶部单独渲染一行表头
- 每条记录只展示对应值
- 调整列表样式与移动端显示逻辑（支持横向滚动保持列对齐）

### 4.4 新增测试数据
按需求新增约 20 条案例数据：
- `data/records.md` 从 2 条扩充到 22 条
- 保持字段与格式统一，可直接被页面解析

### 4.5 详情页左右布局调整
按需求完成：
- 将详情页内容顺序改为：
  - 左侧：购物明细
  - 右侧：小票图片

### 4.6 自动刷新能力（开发模式）
按需求完成：
- 在 `app.js` 增加自动刷新开关
- 当 URL 参数包含 `autoRefresh=1` 时，页面按间隔自动刷新
- 可选参数 `interval`（毫秒）用于控制刷新周期
- 示例：
  - `http://localhost:8000/index.html?autoRefresh=1`
  - `http://localhost:8000/index.html?autoRefresh=1&interval=1000`

## 5. 当前状态
- 功能状态：可用
- 数据状态：已有 22 条记录样例
- 运行方式：通过本地静态服务访问（不可直接 `file://` 打开）

## 6. 后续可扩展项（可选）
- 增加“新增/编辑记录”页面并导出 `records.md`
- 增加筛选（按日期/地点）与排序控制
- 增加金额统计（按月汇总）
