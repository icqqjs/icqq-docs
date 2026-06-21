# 文档站结构规范（多实现）

本站是 **icqq 多实现文档站**：同一套 QQ 协议有多个实现，每个实现在站内**独立分区**，互不混写。本页定义分区约定、品牌规则，以及**新增一个实现**时要做什么。

> 这是站点的「元规范」。具体某个实现内部怎么写每一页，看该实现自己的「文档编写规范」（见下表）。

## 分区总览

| 实现 | 形态 | 路由前缀 | 指南 | API 参考 | 编写规范 |
| --- | --- | --- | --- | --- | --- |
| **icqq** | Node.js 库（TypeScript） | 根 `/` | `/guide/` | `/api/` | [`/guide/docs-style`](/guide/docs-style) |
| **icqq-rs** | OneBot 11 桥（Rust） | `/rust/` | `/rust/guide/` | `/rust/api/` | `/rust/guide/`（OneBot HTTP 风格，迁移自原站） |
| _（规划）_ icqq-py | Python 实现 | `/python/` | `/python/guide/` | `/python/api/` | 各自补 |

**根分区是 icqq（Node 库）本身**，因为它是最初的 icqq 实现；其余实现挂在自己的前缀下。

## 为什么要分区，而不是「共享一套 API 文档」

各实现对外的**接口形态根本不同**，无法共用同一份 API 参考：

- **icqq（Node 库）**：在你自己的进程里 `import` 调用——`createClient()` → `Client`，`EventEmitter` 事件，`pickFriend().sendMsg()` 这样的**方法调用**。
- **icqq-rs（OneBot 桥）**：一个独立进程，对外是 **OneBot 11 的 HTTP / WebSocket action**——`POST /send_private_msg`，靠 JSON 信封 + `retcode` 通信。

所以：**库按对象/方法组织文档，桥按 action/HTTP 组织文档**。两者的「编写规范」也因此不同（方法签名 vs HTTP 请求、返回值/异常 vs `retcode` 信封、TS/JS 示例 vs curl/wget/多语言 HTTP 示例）。

## 品牌中性规则

- **站点级**（`.vitepress/config.mts` 的 `title` / `description`、根首页 `index.md`、`nav`、主题色）：**不绑定任何单一实现**，统称 icqq。
- **实现专属的卖点/营销**（如「100% Rust」「零 JS 运行时」「Node ≥ 14」）：**只允许出现在该实现自己的 landing 与指南里**，不进站点级文案。
  - 例：首页统计条按路由切换——`/rust/` 显示 Rust 指标，根显示 Node 库指标（见 `.vitepress/theme/HomeLayout.vue`）。
- `nav` 必须有「实现」下拉，列出所有实现入口，方便横向跳转。

## 链接规则

- 实现**内部**互链一律用**绝对路径带本实现前缀**：Rust 文档里写 `/rust/api/message`，不要写 `/api/message`（那是 Node 库的页）。
- 同目录页可用相对链 `./quickstart`、`./events/`。
- **跨实现互链**只在「概念对照」或 landing 出现，正文 API 条目内不跨实现引用。

## 新增一个实现（清单）

以加入 `icqq-py`（Python）为例：

1. 建目录：`/python/index.md`（该实现 landing，`layout: home`）、`/python/guide/`、`/python/api/`。
2. 在 `.vitepress/config.mts`：
   - `nav` 的「实现」下拉加一项 `{ text: 'icqq-py · …', link: '/python/' }`。
   - `sidebar` 加 `'/python/'` 键，配该实现的 guide + api 两组侧栏。
3. 写该实现的「文档编写规范」页（若其 API 形态与已有实现不同，单独定模板；相同则复用）。
4. 首页统计条（`HomeLayout.vue`）按 `route.path.startsWith('/python')` 加一组指标。
5. 更新本页「分区总览」表。

## 目录约定

```
/                      icqq（Node 库）—— 根分区
├─ index.md            站点首页（中性 + 指向各实现）
├─ guide/              Node 库 · 指南
├─ api/                Node 库 · API 参考（按对象分章）
├─ STRUCTURE.md        本页：多实现结构规范
├─ rust/               icqq-rs（OneBot 桥）分区
│  ├─ index.md         Rust landing
│  ├─ guide/           桥 · 指南
│  └─ api/             桥 · API 参考（按 action 分类）
└─ .vitepress/         站点配置与主题（站点级，中性）
```
