# Client

`Client` 是整个库的核心对象，用 [`createClient(config)`](/api/index#创建客户端) 得到。它既负责**登录与状态**，也持有**全局数据缓存**，并提供一批全局方法。

本页示例除「登录与状态」一节外，均假设 `client` 已登录。

## 登录与状态

登录流程（扫码 / 密码 / 滑块 / 设备锁）较复杂，细节见 [登录](/guide/login)。这里只列方法签名。

### 登录

- 方法：`client.login(uin?, password?)`
- 签名：`login(uin?: number, password?: string | Buffer): Promise<void>`
- 描述：发起登录。优先用本地缓存的 token；无 token 时按是否传 `password` 走密码登录或扫码登录。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 否 | - | 登录账号。不传则用构造时传入的账号。 |
| `password` | `string \| Buffer` | 否 | - | 密码原文，或 32 位密码 MD5（十六进制字符串）。不传且无 token 时走扫码登录。 |

#### 返回值

`Promise<void>`。登录**结果**通过事件反馈：成功触发 `system.online`，需要验证时触发 `system.login.*`。不要把 `await login()` 当成「已上线」。

### 是否在线

- 方法：`client.isOnline()`
- 签名：`isOnline(): boolean`
- 描述：当前是否处于可收发业务包的在线状态。

### 下线

- 方法：`client.logout(keepalive?)`
- 签名：`logout(keepalive?: boolean): Promise<void>`
- 描述：主动下线。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `keepalive` | `boolean` | 否 | `false` | 是否保持底层 TCP 连接。 |

::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")

const client = createClient({ platform: 2, sign_api_addr: "<sign_api_addr>" })

client.on("system.online", () => {
  console.log("在线：", client.isOnline())
})

client.login(<uin>, "<password>")
```

```ts [TypeScript]
import { createClient } from "@icqqjs/icqq"

const client = createClient({ platform: 2, sign_api_addr: "<sign_api_addr>" })

client.on("system.online", () => console.log("在线：", client.isOnline()))

client.login(<uin>, "<password>")
```

:::

### 相关

[登录](/guide/login) · [配置](/guide/config) · [事件系统](/guide/events)

## 账号资料

修改自己的资料、设置在线状态、查资料卡。多数为 `Promise<boolean>`。

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `setNickname(nickname)` | `(nickname: string) => Promise<boolean>` | 设置昵称。 |
| `setGender(gender)` | `(gender: 0 \| 1 \| 2) => Promise<boolean>` | 设置性别：`0` 未知、`1` 男、`2` 女。 |
| `setBirthday(birthday)` | `(birthday: string \| number) => Promise<boolean>` | 设置生日，`YYYYMMDD` 格式。 |
| `setDescription(description?)` | `(description?: string) => Promise<boolean>` | 设置个人说明。 |
| `setSignature(signature?)` | `(signature?: string) => Promise<boolean>` | 设置个性签名。 |
| `setAvatar(file)` | `(file: string \| Buffer) => Promise<void>` | 设置头像，传本地路径 / URL / Buffer。 |
| `setOnlineStatus(status?)` | `(status?: OnlineStatus \| number) => Promise<boolean>` | 设置在线状态，见下表。 |
| `getOnlineStatus()` | `() => Promise<...>` | 获取当前在线状态。 |
| `getProfile(uin_uid, idsParse?)` | `(uin_uid: number \| string) => Promise<...>` | 获取某用户的资料卡。 |

`OnlineStatus` 常用值：`Online`(11) 在线、`Absent`(31) 离开、`Invisible`(41) 隐身、`Busy`(50) 忙碌、`Qme`(60) Q我吧、`DontDisturb`(70) 请勿打扰。

### 设置昵称

- 方法：`client.setNickname(nickname)`
- 签名：`setNickname(nickname: string): Promise<boolean>`
- 描述：修改自己的昵称。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `nickname` | `string` | 是 | - | 新昵称。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

### 设置在线状态

- 方法：`client.setOnlineStatus(status?)`
- 签名：`setOnlineStatus(status?: OnlineStatus | number): Promise<boolean>`
- 描述：切换在线状态（在线 / 离开 / 隐身 / 忙碌等）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `status` | `OnlineStatus \| number` | 否 | 当前状态或 `Online` | 目标状态，见上表枚举值。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
const { OnlineStatus } = require("@icqqjs/icqq")

await client.setNickname("我的新昵称")
await client.setSignature("在线一切随缘")
await client.setOnlineStatus(OnlineStatus.Busy) // 忙碌
```

```ts [TypeScript]
import { OnlineStatus } from "@icqqjs/icqq"

await client.setNickname("我的新昵称")
await client.setSignature("在线一切随缘")
await client.setOnlineStatus(OnlineStatus.Busy)
```

:::

### 获取资料卡

- 方法：`client.getProfile(uin_uid, idsParse?)`
- 签名：`getProfile(uin_uid: number | string, idsParse?: Record<number, { key: string; parse: (val: any) => any }>): Promise<Record<string, any>>`
- 描述：获取某个用户的资料卡信息。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin_uid` | `number \| string` | 是 | - | 用户的 QQ 号（`number`）或 uid（`string`）。 |
| `idsParse` | `Record<number, {...}>` | 否 | - | 自定义字段解析规则，一般不传。 |

## 消息操作

这些是全局发消息 / 撤回 / 取记录的快捷方法，内部等价于先 `pick*` 再调用对象方法。发送类返回 `Promise<MessageRet>`，撤回类返回 `Promise<boolean>`。

### 发送私聊消息

- 方法：`client.sendPrivateMsg(user_id, message, source?)`
- 签名：`sendPrivateMsg(user_id: number, message: Sendable, source?: Quotable): Promise<MessageRet>`
- 描述：给某个好友发送一条私聊消息。等价于 `client.pickFriend(user_id).sendMsg(...)`。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number` | 是 | - | 对方 QQ 号。 |
| `message` | `Sendable` | 是 | - | 文本、单个消息段或其数组。 |
| `source` | `Quotable` | 否 | - | 要引用回复的消息。 |

#### 返回值

`Promise<MessageRet>` —— `{ message_id, seq, rand, time }`，`message_id` 是字符串。

### 发送群消息

- 方法：`client.sendGroupMsg(group_id, message, source?)`
- 签名：`sendGroupMsg(group_id: number, message: Sendable, source?: Quotable): Promise<MessageRet>`
- 描述：向某个群发送一条消息。等价于 `client.pickGroup(group_id).sendMsg(...)`。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number` | 是 | - | 群号。 |
| `message` | `Sendable` | 是 | - | 文本、单个消息段或其数组。 |
| `source` | `Quotable` | 否 | - | 要引用回复的消息。 |

### 发送频道消息

- 方法：`client.sendGuildMsg(guild_id, channel_id, message)`
- 签名：`sendGuildMsg(guild_id: string, channel_id: string, message: Sendable): Promise<...>`
- 描述：向某频道的子频道发送一条消息。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道号（字符串）。 |
| `channel_id` | `string` | 是 | - | 子频道号（字符串）。 |
| `message` | `Sendable` | 是 | - | 消息内容。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
const { segment } = require("@icqqjs/icqq")

const ret = await client.sendGroupMsg(<group_id>, [
  segment.at(<friend_id>),
  "你好！",
])
console.log(ret.message_id)

await client.sendPrivateMsg(<friend_id>, "私聊你一下")
```

```ts [TypeScript]
import { segment } from "@icqqjs/icqq"

const ret = await client.sendGroupMsg(<group_id>, [segment.at(<friend_id>), "你好！"])
console.log(ret.message_id)
```

:::

### 撤回消息

- 方法：`client.deleteMsg(message_id)`
- 签名：`deleteMsg(message_id: string): Promise<boolean>`
- 描述：撤回一条消息（自动判断私聊 / 群聊）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 发送 / 收到消息得到的 `message_id`。 |

#### 返回值

`Promise<boolean>` —— 是否撤回成功。

### 获取单条消息

- 方法：`client.getMsg(message_id)`
- 签名：`getMsg(message_id: string): Promise<PrivateMessage | GroupMessage | undefined>`
- 描述：按 `message_id` 取回一条消息对象。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 目标消息的 id。 |

### 获取聊天记录

- 方法：`client.getChatHistory(message_id, count?)`
- 签名：`getChatHistory(message_id: string, count?: number): Promise<(PrivateMessage | GroupMessage)[]>`
- 描述：从某条消息往前取聊天记录。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 起点消息 id。 |
| `count` | `number` | 否 | `20` | 取多少条。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
client.on("message.group", async (e) => {
  const history = await client.getChatHistory(e.message_id, 5)
  console.log("最近 5 条：", history.length)
  // 撤回刚收到的这条（需有权限）
  await client.deleteMsg(e.message_id)
})
```

```ts [TypeScript]
client.on("message.group", async (e) => {
  const history = await client.getChatHistory(e.message_id, 5)
  console.log("最近 5 条：", history.length)
})
```

:::

### 制作合并转发

- 方法：`client.makeForwardMsg(fake, dm?)`
- 签名：`makeForwardMsg(fake: Forwardable[], dm?: boolean): Promise<JsonElem>`
- 描述：把多条「假消息」打包成一条合并转发消息（制作一次可多处发送）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fake` | `Forwardable[]` | 是 | - | 每项含 `user_id`、`nickname`、`message`。 |
| `dm` | `boolean` | 否 | `false` | 是否制作给好友（私聊）用；群图片与好友图片格式不同。 |

#### 返回值

`Promise<JsonElem>` —— 得到的消息段，再当作普通消息 `sendMsg` 出去即可。

### 获取合并转发内容

- 方法：`client.getForwardMsg(resid, fileName?)`
- 签名：`getForwardMsg(resid: string, fileName?: string): Promise<ForwardMessage[]>`
- 描述：根据合并转发的 `resid` 拉取里面的消息列表。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `resid` | `string` | 是 | - | 转发消息的资源 id。 |
| `fileName` | `string` | 否 | `"MultiMsg"` | 内部文件名，一般不用传。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
const forward = await client.makeForwardMsg([
  { user_id: <friend_id>, nickname: "小明", message: "第一条" },
  { user_id: <friend_id>, nickname: "小明", message: "第二条" },
])
await client.sendGroupMsg(<group_id>, forward)
```

```ts [TypeScript]
const forward = await client.makeForwardMsg([
  { user_id: <friend_id>, nickname: "小明", message: "第一条" },
  { user_id: <friend_id>, nickname: "小明", message: "第二条" },
])
await client.sendGroupMsg(<group_id>, forward)
```

:::

### 设置精华消息

- 方法：`client.setEssenceMessage(message_id)`
- 签名：`setEssenceMessage(message_id: string): Promise<string>`
- 描述：把一条群消息设为精华。等价于 `client.pickGroup(group_id).addEssence(seq, rand)`。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 群消息的 id（私聊消息会被拒绝）。 |

> 对应 `removeEssenceMessage(message_id)` 用来移除精华。

### 相关

[消息与消息段](/guide/message) · [`segment`](/api/segment) · [Friend.sendMsg](/api/friend#发送消息) · [Group.sendMsg](/api/group#发送群消息)

## 群管理便捷方法

下列方法是 [Group](/api/group) / [Member](/api/member) 对象方法的**全局快捷封装**，内部都是先 `pickGroup` / `pickMember` 再调用。**推荐直接用 `client.pickGroup(<group_id>)` 拿对象操作**，可读性更好；这些方法主要为习惯 cqhttp 风格的用户保留。多数返回 `Promise<boolean>`。

| 便捷方法 | 等价对象方法 | 说明 |
| --- | --- | --- |
| `setGroupName(group_id, name)` | `Group.setName` | 改群名。 |
| `sendGroupNotice(group_id, content)` | `Group.announce` | 发简易群公告。 |
| `setGroupWholeBan(group_id, enable?)` | `Group.muteAll` | 全员禁言开关。 |
| `setGroupBan(group_id, user_id, duration?)` | `Member.mute` | 禁言群员，默认 `1800` 秒。 |
| `setGroupKick(group_id, user_id, reject_add_request?, message?)` | `Member.kick` | 踢出群员。 |
| `setGroupCard(group_id, user_id, card)` | `Member.setCard` | 改群名片。 |
| `setGroupAdmin(group_id, user_id, enable?)` | `Member.setAdmin` | 设 / 取消管理员。 |
| `setGroupSpecialTitle(group_id, user_id, special_title, duration?)` | `Member.setTitle` | 设群头衔，`duration` 默认 `-1`（永久）。 |
| `setGroupLeave(group_id)` | `Group.quit` | 退群（群主则解散）。 |
| `sendGroupPoke(group_id, user_id)` | `Member.poke` | 群内戳一戳。 |
| `inviteFriend(group_id, user_id)` | `Group.invite` | 邀请好友进群。 |
| `sendGroupSign(group_id)` | `Group.sign` | 群打卡。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
// 便捷写法
await client.setGroupBan(<group_id>, <friend_id>, 600)

// 推荐写法（等价）
await client.pickGroup(<group_id>).muteMember(<friend_id>, 600)
```

```ts [TypeScript]
await client.setGroupBan(<group_id>, <friend_id>, 600)
// 推荐：
await client.pickGroup(<group_id>).muteMember(<friend_id>, 600)
```

:::

## 频道

频道相关的全局只读方法。`guild_id` / `channel_id` 都是字符串。

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getGuildInfo(guild_id)` | `(guild_id: string) => { guild_id, guild_name } \| null` | 频道基本信息。 |
| `getChannelList(guild_id)` | `(guild_id: string) => Channel[]` | 子频道列表。 |
| `getGuildMemberList(guild_id)` | `(guild_id: string) => Promise<...>` | 频道成员列表。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
for (const [guild_id, guild] of client.guilds) {
  console.log(guild_id, guild.guild_name)
  console.log("子频道：", client.getChannelList(guild_id).length)
}
```

```ts [TypeScript]
for (const [guild_id, guild] of client.guilds) {
  console.log(guild_id, guild.guild_name)
}
```

:::

## 数据属性与凭证

直接读取的属性（不是方法）。数据缓存表见 [总览](/api/index#数据缓存)。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `client.uin` | `number` | 当前登录账号。 |
| `client.nickname` | `string` | 当前账号昵称。 |
| `client.fl` | `Map<number, FriendInfo>` | 好友列表。 |
| `client.gl` | `Map<number, GroupInfo>` | 群列表。 |
| `client.gml` | `Map<number, Map<number, MemberInfo>>` | 群员列表缓存。 |
| `client.status` | `OnlineStatus \| number` | 当前在线状态。 |
| `client.cookies[domain]` | `string` | 指定域名的 Cookie 串（如 `client.cookies["qun.qq.com"]`）。 |
| `client.bkn` | `number` | csrf token（bkn）。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
console.log(client.uin, client.nickname)
const cookie = client.cookies["qun.qq.com"]
const bkn = client.bkn
```

```ts [TypeScript]
console.log(client.uin, client.nickname)
const cookie = client.cookies["qun.qq.com"]
const bkn = client.bkn
```

:::

### 相关

[总览](/api/index) · [Group / Discuss](/api/group) · [Member](/api/member)
