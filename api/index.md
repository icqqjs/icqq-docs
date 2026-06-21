# API 参考总览

本节是 **icqq（Node 库）** 的方法参考。每个页面按「对象」组织：你先用 `client.pick*` 拿到一个联系人对象（好友 / 群 / 群员 / 频道），再在它身上调用方法。

## 怎么读本节

- 想知道**整个客户端**能做什么（登录、账号资料、全局消息操作、数据缓存）：看 [Client](/api/client)。
- 想给**某个好友**发消息、撤回、上传文件：看 [Friend / User](/api/friend)。
- 想做**群管理**（踢人、禁言、改名片）：看 [Group / Discuss](/api/group) 和 [Member](/api/member)。
- 不清楚消息内容怎么拼（文本、图片、@）：看 [消息与消息段](/guide/message)、[`segment`](/api/segment)。

每个方法条目都给出 **TypeScript 签名**、参数表、返回值和失败语义，并配一段最小可跑示例。示例统一从 `@icqqjs/icqq` 引入。

## 创建客户端

入口是 `createClient(config?)`，返回一个 `Client` 实例（等价于 `new Client(config)`）。

- 签名：`createClient(config?: Config): Client`

::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")

const client = createClient({
  platform: 2,                 // 登录设备（协议）
  sign_api_addr: "<sign_api_addr>", // 签名服务器地址，登录前必须配置
})
```

```ts [TypeScript]
import { createClient } from "@icqqjs/icqq"

const client = createClient({
  platform: 2,
  sign_api_addr: "<sign_api_addr>",
})
```

:::

> 配置项完整说明见 [配置](/guide/config)。登录必须配置 `sign_api_addr`，否则会登录失败或无法收发消息。

## 客户端生命周期

| 方法 / 属性 | 作用 |
| --- | --- |
| `client.login(uin?, password?)` | 发起登录，过程中可能触发扫码 / 滑块 / 设备锁等事件。详见 [登录](/guide/login)。 |
| `system.online` 事件 | 登录成功上线时触发，应当在这里再开始发消息。 |
| `client.isOnline()` | 返回 `boolean`，当前是否在线（能否收发业务包）。 |
| `client.logout(keepalive?)` | 主动下线。 |

最小骨架：

::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")

const client = createClient({ platform: 2, sign_api_addr: "<sign_api_addr>" })

client.on("system.online", () => {
  console.log("已上线：", client.uin)
})

client.login(<uin>, "<password>")
```

```ts [TypeScript]
import { createClient } from "@icqqjs/icqq"

const client = createClient({ platform: 2, sign_api_addr: "<sign_api_addr>" })

client.on("system.online", () => {
  console.log("已上线：", client.uin)
})

client.login(<uin>, "<password>")
```

:::

## pick\* 一览

拿到一个联系人对象后就可以链式调用它的方法。这些方法**通常不会重复创建对象**，可以放心多次调用。

| 方法 | 参数 | 返回对象 | 说明 |
| --- | --- | --- | --- |
| `client.pickFriend(uin, strict?)` | `uin: number` | [`Friend`](/api/friend) | 好友对象。`strict` 为 `true` 时好友不存在会抛异常。 |
| `client.pickGroup(gid, strict?)` | `gid: number` | [`Group`](/api/group) | 群对象。 |
| `client.pickMember(gid, uin, strict?)` | `gid: number, uin: number` | [`Member`](/api/member) | 群成员对象。 |
| `client.pickUser(uin)` | `uin: number` | [`User`](/api/friend) | 通用用户对象（可对陌生人操作，如点赞）。 |
| `client.pickDiscuss(gid)` | `gid: number` | [`Discuss`](/api/group#讨论组-discuss) | 讨论组对象。 |
| `client.pickGuild(guild_id)` | `guild_id: string` | `Guild` | 频道对象（`guild_id` 是字符串）。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickFriend(<friend_id>).sendMsg("你好")
await client.pickGroup(<group_id>).sendMsg("大家好")
await client.pickMember(<group_id>, <friend_id>).mute(600)
```

```ts [TypeScript]
await client.pickFriend(<friend_id>).sendMsg("你好")
await client.pickGroup(<group_id>).sendMsg("大家好")
await client.pickMember(<group_id>, <friend_id>).mute(600)
```

:::

## 数据缓存

上线后框架会把好友、群、群员等信息加载到下列 `Map`（频道为 `Map`，黑名单为 `Set`），可以直接读取。键都是账号 / 群号（`number`），频道键是 `string`。

| 属性 | 类型 | 内容 |
| --- | --- | --- |
| `client.fl` | `Map<number, FriendInfo>` | 好友列表，键是好友 QQ 号。 |
| `client.sl` | `Map<number, StrangerInfo>` | 陌生人列表（曾经临时会话过的人）。 |
| `client.gl` | `Map<number, GroupInfo>` | 群列表，键是群号。 |
| `client.gml` | `Map<number, Map<number, MemberInfo>>` | 群员列表缓存，外层键是群号，内层键是群员 QQ 号。 |
| `client.guilds` | `Map<string, Guild>` | 已加入的频道列表，键是 `guild_id`（字符串）。 |
| `client.blacklist` | `Set<number>` | 黑名单 QQ 号集合。 |
| `client.classes` | `Map<number, string>` | 好友分组，键是分组 id，值是分组名。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
console.log("好友数量：", client.fl.size)
for (const [gid, info] of client.gl) {
  console.log(gid, info.group_name)
}
```

```ts [TypeScript]
console.log("好友数量：", client.fl.size)
for (const [gid, info] of client.gl) {
  console.log(gid, info.group_name)
}
```

:::

> 群员列表是按需加载的，第一次访问某个群时用 `client.pickGroup(<group_id>).getMemberMap()` 拉取。

## 约定

- **ID 用 `number`**：QQ 号、群号都是数字。
- **`message_id` 是 `string`**：发送 / 收到消息得到的 `message_id` 是字符串，用于撤回和引用回复，不要按数字解析。`guild_id`、`channel_id` 也是字符串。
- **异步方法可能抛 `ApiRejection`**：被风控、未登录或权限不足时，`Promise` 会以 `ApiRejection`（含 `code` 与 `message`）拒绝，用 `try/catch` 捕获。
- **多数管理类方法返回 `Promise<boolean>`**：`true` 表示成功；**发消息类方法返回 `Promise<MessageRet>`**（含 `message_id`）。

## 各页索引

- [Client](/api/client) —— 客户端全局方法：登录状态、账号资料、消息操作、群管理便捷方法、频道、数据与凭证。
- [Friend / User](/api/friend) —— 好友与通用用户：发消息、撤回、戳一戳、备注、删除、文件、聊天记录、点赞。
- [Group / Discuss](/api/group) —— 群与讨论组：发消息、群管理、群员列表、精华、退群、打卡。
- [Member](/api/member) —— 群成员：踢人、禁言、管理员、头衔、名片、加好友、续期。
