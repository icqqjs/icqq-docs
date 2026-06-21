# Guild / Channel（QQ 频道）

icqq 对 QQ 频道（Guild）提供了**基础**的收发支持。本页如实说明当前覆盖范围。

::: warning 覆盖范围
频道相关功能较薄，请按本页列出的方法使用：

- 发送频道消息**暂时仅支持文本、AT、表情**三类消息段。
- 可以列出已加入的频道、子频道、频道成员，并收发 / 撤回子频道消息。
- 没有「主动加入频道」「频道管理」等更复杂的能力。
:::

层级关系：一个 **Guild（频道）** 下有多个 **Channel（子频道）**，消息发到具体的子频道里。频道账号体系用 `tiny_id`（字符串），与 QQ 号是两套 id；`guild_id`、`channel_id` 也都是字符串。

---

## 获取已加入的频道列表

- 方法: `client.getGuildList()`
- 签名: `getGuildList(): { guild_id: string; guild_name: string }[]`
- 描述: 返回当前账号已加入的所有频道（同步方法，读取本地缓存）。

### 示例

```js
// 假设 client 已登录
const guilds = client.getGuildList()
for (const g of guilds) {
  console.log(g.guild_id, g.guild_name)
}
```

---

## 获取子频道列表

- 方法: `client.getChannelList(guild_id)`
- 签名: `getChannelList(guild_id: string): { guild_id: string; channel_id: string; channel_name: string; channel_type: ChannelType }[]`
- 描述: 返回某个频道下的全部子频道。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道 id。 |

### 示例

```js
const channels = client.getChannelList("<guild_id>")
for (const c of channels) {
  console.log(c.channel_id, c.channel_name, c.channel_type)
}
```

> `channel_type` 是 `ChannelType` 枚举，取值见 [枚举与常量](/api/enums)。

---

## 获取频道成员列表

- 方法: `client.getGuildMemberList(guild_id)`
- 签名: `getGuildMemberList(guild_id: string): Promise<GuildMember[]>`
- 描述: 拉取某频道的成员列表。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道 id。 |

### 返回值 `GuildMember[]`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tiny_id` | `string` | 频道成员账号（不是 QQ 号）。 |
| `card` | `string` | 名片。 |
| `nickname` | `string` | 昵称。 |
| `role` | `GuildRole` | 权限。 |
| `join_time` | `number` | 加入时间（秒）。 |

> `GuildRole` 取值：`Member = 1`、`GuildAdmin = 2`、`Owner = 4`、`ChannelAdmin = 5`。

### 示例

```js
const members = await client.getGuildMemberList("<guild_id>")
console.log("成员数：", members.length)
```

---

## 发送频道消息

- 方法: `client.sendGuildMsg(guild_id, channel_id, message)`
- 签名: `sendGuildMsg(guild_id: string, channel_id: string, message: Sendable): Promise<GuildMessageRet>`
- 描述: 向某频道的某子频道发送一条消息。**暂时仅支持文本、AT、表情。**

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道 id。 |
| `channel_id` | `string` | 是 | - | 子频道 id。 |
| `message` | `Sendable` | 是 | - | 文本字符串、消息段或其数组（限文本 / AT / 表情）。 |

### 返回值 `GuildMessageRet`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `seq` | `number` | 消息序号，撤回时用。 |
| `rand` | `number` | 随机标识。 |
| `time` | `number` | 发送时间（秒）。 |

> 频道消息没有 `message_id`，撤回要用返回的 `seq`。

### 失败

发送失败（如被风控）时抛出 `ApiRejection`，用 `try/catch` 捕获。

### 示例

::: code-group

```js [JavaScript]
const { segment } = require("@icqqjs/icqq")
const ret = await client.sendGuildMsg("<guild_id>", "<channel_id>", [
  segment.at("tiny_id_xxx"),
  " 你好频道！"
])
console.log(ret.seq)
```

```ts [TypeScript]
const ret = await client.sendGuildMsg("<guild_id>", "<channel_id>", "你好频道！")
```

:::

---

## 撤回频道消息

撤回需要拿到 `Channel` 对象，再调用它的 `recallMsg(seq)`。

- 方法: `channel.recallMsg(seq)`
- 签名: `recallMsg(seq: number): Promise<boolean>`
- 描述: 撤回子频道中的一条消息。

### 示例

```js
const guild = client.pickGuild("<guild_id>")
const channel = guild.channels.get("<channel_id>")
await channel.recallMsg(ret.seq) // ret.seq 来自 sendGuildMsg 的返回
```

---

## 接收频道消息

频道消息通过 `message.guild` 事件接收，回调参数是 `GuildMessageEvent`。

- 事件: `message.guild`
- 触发: 收到任意频道消息时。

### 回调参数 `GuildMessageEvent`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `guild_id` | `string` | 频道 id。 |
| `guild_name` | `string` | 频道名。 |
| `channel_id` | `string` | 子频道 id。 |
| `channel_name` | `string` | 子频道名。 |
| `seq` | `number` | 消息序号。 |
| `rand` | `number` | 随机标识。 |
| `time` | `number` | 时间（秒）。 |
| `message` | `MessageElem[]` | 已解析的消息段数组。 |
| `raw_message` | `string` | 文本化预览。 |
| `sender` | `{ tiny_id: string; nickname: string }` | 发送者（频道账号 + 昵称）。 |

> 还带便捷方法 `reply(content)`：直接回复到同一子频道（同样限文本 / AT / 表情）。

### 示例

```js
client.on("message.guild", (e) => {
  console.log(`[${e.guild_name}/${e.channel_name}] ${e.sender.nickname}: ${e.raw_message}`)
  if (e.raw_message === "ping") e.reply("pong")
})
```

### 相关

[事件类型参考](/api/events) · [消息段 segment](/api/segment) · [枚举与常量](/api/enums)
