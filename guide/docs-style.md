# 文档编写规范（icqq Node 库）

本规范用于编写 **icqq（Node 库）** 分区的 `guide/*` 与 `api/*`。目标：文档只描述**库对外的公开能力**——方法、参数、返回值、事件、消息段、调用示例和必要限制；不写协议内部链路、第三方框架、内部实现细节。

> 这是「库」风格的规范（方法调用）。OneBot 桥（HTTP action）是另一套风格，见 `/rust/` 分区。站点级分区约定见 [文档站结构规范](/STRUCTURE)。

## 硬性规则

### 必须写

- 方法 / 事件 / 消息段的名称 + 一句话描述。
- 方法：**TypeScript 签名**、参数表、返回值、失败语义。
- 事件：触发时机、payload 字段表、监听示例。
- 消息段：构造签名、参数表、构造示例、收到时在消息链里的样子。
- 至少一段可跑的示例（`createClient` 起步或假设 `client` 已上线，二选一并说明）。
- 会直接影响调用结果的限制（如需要 `ffmpeg`、需先登录、需 `sign_api_addr`）。

### 禁止写

- 协议内部：wtlogin / NTLogin / SSO / highway / OIDB / protobuf 字段名 / 上传 apply-feed-succ 流程。
- 第三方机器人框架 / 插件 / 业务项目名（概念对照仅可出现在 landing 或介绍页，不进 API 条目）。
- 真实 QQ 号、群号、昵称、token、cookie、sign server 地址。
- 「绝不伪造」「真实 live 链路」这类实现宣言。

### 允许写

- 会影响调用的事实限制：`ffmpeg` / `ffprobe` 依赖、本地路径在运行 Node 的机器上解析、ID 用 `number | string` 的精度建议。
- icqq 与 QQ 协议的能力边界，但只放在介绍页 / 贡献页 / 专门说明，不进单条 API 模板。

## 通用约定

- **标题用中文动作名**（如「发送好友消息」），方法名放在条目首行的 `- 方法:` 里。
- 占位符用尖括号：`<friend_id>`、`<group_id>`、`<message_id>`。
- 示例统一从 `@icqqjs/icqq` 引入：`const { createClient, segment } = require("@icqqjs/icqq")`。
- 类型一律写**面向调用方的 TS 类型**，不写内部类型。
- ID 字段优先 `number`（QQ 号、群号都是数字），返回的 `message_id` 是 `string`，不要按数字解析。
- 面向新手：先给最小可跑示例，再讲参数细节；不堆术语。

## 示例代码规则

库是**方法调用，不是 HTTP**，所以：

- **只用 `js` / `ts` 两种示例**（VitePress Code Group），**不写 curl / wget / python**。
- 示例要么从 `createClient` 完整起步，要么在顶部注明「假设 `client` 已登录」。
- 异步方法用 `await`，并放在 `async` 上下文里（或 `.then()`）。
- 不写第三方 SDK、不写业务重试逻辑。

```md
::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")
// ...
```

```ts [TypeScript]
import { createClient, Sendable } from "@icqqjs/icqq"
// ...
```

:::
```

## 模板一：方法条目

```md
## 发送好友消息

- 方法: `friend.sendMsg(content, source?)`
- 签名: `sendMsg(content: Sendable, source?: Quotable): Promise<MessageRet>`
- 描述: 给该好友发送一条消息。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `Sendable` | 是 | - | 文本字符串、单个消息段或其数组。 |
| `source` | `Quotable` | 否 | - | 要引用回复的消息（一般直接传收到的消息事件）。 |

### 返回值

`Promise<MessageRet>` —— `{ message_id, seq, rand, time }`。`message_id` 是字符串，用于撤回 / 引用。

### 失败

被风控、未登录或对方限制时，Promise 抛出 `ApiRejection`（含 `code` 与 `message`），用 `try/catch` 捕获。

### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const friend = client.pickFriend(<friend_id>)
const ret = await friend.sendMsg([
  segment.at(<friend_id>),
  "你好！"
])
console.log(ret.message_id)
```

```ts [TypeScript]
const friend = client.pickFriend(<friend_id>)
const ret = await friend.sendMsg("你好！")
console.log(ret.message_id)
```

:::

### 相关

[消息与消息段](/guide/message) · [`segment`](/api/segment) · [引用回复 Quotable](/api/types)
```

**字段表规则**：固定五列 `参数 / 类型 / 必填 / 默认 / 说明`。必填只写「是」或「否」，无默认写 `-`，枚举值显式列出（如 `` `0` | `1` | `2` ``）。
**没有参数**仍保留「参数」小节，写「无。」。**无额外失败说明**可省略「失败」小节。

## 模板二：事件条目

```md
## 群消息

- 事件: `message.group`
- 触发: 收到任意群消息时。

### 回调参数 `GroupMessageEvent`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `group_id` | `number` | 群号。 |
| `sender` | `MemberInfo` | 发送者信息。 |
| `message` | `MessageElem[]` | 消息段数组（已解析）。 |
| `raw_message` | `string` | 文本化预览。 |
| `group` | `Group` | 该群对象，可直接操作。 |
| `member` | `Member` | 发送者成员对象。 |

> 还带便捷方法：`reply(content, quote?)` 快速回复、`recall()` 撤回本条。

### 示例

```js
client.on("message.group", (e) => {
  if (e.raw_message === "ping") e.reply("pong", true)
})
```
```

事件命名是分层的：监听 `message` 收全部消息，监听 `message.group` 只收群消息。父事件可收子事件，详见 [事件系统](/guide/events)。

## 模板三：消息段条目

```md
## 图片 `segment.image`

- 构造: `segment.image(file, cache?, timeout?, headers?)`
- 类型: `ImageElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string \| Buffer` | 是 | - | 本地路径、`http(s)://` URL、`base64://...` 或 `Buffer`。 |
| `cache` | `boolean` | 否 | `true` | 是否缓存远程图片。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg([
  "看图：",
  segment.image("https://example.com/cat.png")
])
```

### 收到时

对方发来的图片在 `e.message` 里表现为 `{ type: "image", file, url, ... }`，可用 `url` 字段下载。
```

## 重写检查清单

写 / 改一页前逐项核对：

- 没有第三方框架名、没有协议内部链路 / 服务名。
- 没有真实账号、群号、token、cookie、私有地址。
- 方法条目：有 TS 签名、五列参数表、返回值、（如有）失败说明。
- 事件条目：有触发时机、payload 字段表、监听示例。
- 消息段条目：有构造签名、参数表、构造示例、「收到时」说明。
- 示例只用 `js` / `ts`，从 `@icqqjs/icqq` 引入，异步用 `await`。
- ID 用 `number`；`message_id` 标明是字符串。
