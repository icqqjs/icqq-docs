# Group / Discuss

用 `client.pickGroup(<group_id>)` 得到 `Group` 对象，用来发群消息和做群管理。

> 管理类操作（踢人、禁言、改名片等）需要你在该群是**群主或管理员**，否则会失败。多数方法返回 `Promise<boolean>`，`true` 表示成功。

本页示例均假设 `client` 已登录。

## 消息

### 发送群消息

- 方法：`group.sendMsg(content, source?, anony?)`
- 签名：`sendMsg(content: Sendable, source?: Quotable, anony?: Omit<Anonymous, "flag"> | boolean): Promise<MessageRet>`
- 描述：向群里发送一条消息。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `Sendable` | 是 | - | 文本、单个消息段或其数组。 |
| `source` | `Quotable` | 否 | - | 要引用回复的消息。 |
| `anony` | `boolean \| Anonymous` | 否 | `false` | 是否匿名发送；`true` 自动获取匿名身份。 |

#### 返回值

`Promise<MessageRet>` —— `{ message_id, seq, rand, time }`，`message_id` 是字符串。

#### 失败

被风控、未登录或被全员禁言时抛 `ApiRejection`。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const { segment } = require("@icqqjs/icqq")

const ret = await client.pickGroup(<group_id>).sendMsg([
  segment.at(<friend_id>),
  "欢迎！",
])
console.log(ret.message_id)
```

```ts [TypeScript]
import { segment } from "@icqqjs/icqq"

const ret = await client.pickGroup(<group_id>).sendMsg([segment.at(<friend_id>), "欢迎！"])
console.log(ret.message_id)
```

:::

#### 相关

[消息与消息段](/guide/message) · [`segment`](/api/segment)

### 撤回消息

- 方法：`group.recallMsg(message_id)`
- 签名（重载）：
  - `recallMsg(message_id: string): Promise<boolean>`
  - `recallMsg(message: GroupMessage): Promise<boolean>`
  - `recallMsg(seq: number, rand: number, pktnum?: number): Promise<boolean>`
- 描述：撤回一条群消息（撤回别人的消息需要管理权限）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 最常用：传 `message_id`。 |
| `message` | `GroupMessage` | 是 | - | 也可直接传收到的群消息对象。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
client.on("message.group", async (e) => {
  if (e.raw_message.includes("广告")) {
    await e.group.recallMsg(e.message_id)
  }
})
```

```ts [TypeScript]
client.on("message.group", async (e) => {
  if (e.raw_message.includes("广告")) await e.group.recallMsg(e.message_id)
})
```

:::

## 群员管理

### 踢出群员

- 方法：`group.kickMember(uin, msg?, block?)`
- 签名：`kickMember(uin: number, msg?: string, block?: boolean): Promise<boolean>`
- 描述：把某个群员踢出群。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 是 | - | 群员 QQ 号。 |
| `msg` | `string` | 否 | - | 附带的踢出消息。 |
| `block` | `boolean` | 否 | `false` | 是否一并屏蔽（不允许再加群）。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickGroup(<group_id>).kickMember(<friend_id>)
```

```ts [TypeScript]
await client.pickGroup(<group_id>).kickMember(<friend_id>)
```

:::

### 禁言群员

- 方法：`group.muteMember(uin, duration?)`
- 签名：`muteMember(uin: number, duration?: number): Promise<boolean>`
- 描述：禁言某个群员。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 是 | - | 群员 QQ 号。 |
| `duration` | `number` | 否 | `600` | 禁言时长（秒）；传 `0` 表示解除禁言。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickGroup(<group_id>).muteMember(<friend_id>, 600) // 禁言 10 分钟
await client.pickGroup(<group_id>).muteMember(<friend_id>, 0)   // 解除
```

```ts [TypeScript]
await client.pickGroup(<group_id>).muteMember(<friend_id>, 600)
await client.pickGroup(<group_id>).muteMember(<friend_id>, 0)
```

:::

### 全员禁言

- 方法：`group.muteAll(yes?)`
- 签名：`muteAll(yes?: boolean): Promise<boolean>`
- 描述：开启 / 关闭全员禁言。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `yes` | `boolean` | 否 | `true` | `true` 开启，`false` 关闭。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickGroup(<group_id>).muteAll(true)
```

```ts [TypeScript]
await client.pickGroup(<group_id>).muteAll(true)
```

:::

### 设置群名片

- 方法：`group.setCard(uin, card?)`
- 签名：`setCard(uin: number, card?: string): Promise<boolean>`
- 描述：修改某群员的群名片。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 是 | - | 群员 QQ 号。 |
| `card` | `string` | 否 | `""` | 新名片，空字符串表示清空。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

### 设置管理员

- 方法：`group.setAdmin(uin, yes?)`
- 签名：`setAdmin(uin: number, yes?: boolean): Promise<boolean>`
- 描述：设置 / 取消某群员为管理员（需群主权限）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 是 | - | 群员 QQ 号。 |
| `yes` | `boolean` | 否 | `true` | `true` 设为管理员，`false` 取消。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

### 设置群头衔

- 方法：`group.setTitle(uin, title?, duration?)`
- 签名：`setTitle(uin: number, title?: string, duration?: number): Promise<boolean>`
- 描述：给某群员设置专属头衔（需群主权限）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 是 | - | 群员 QQ 号。 |
| `title` | `string` | 否 | `""` | 头衔名，空字符串表示清除。 |
| `duration` | `number` | 否 | `-1` | 持续秒数，`-1` 表示永久。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickGroup(<group_id>).setCard(<friend_id>, "新人小王")
await client.pickGroup(<group_id>).setAdmin(<friend_id>, true)
await client.pickGroup(<group_id>).setTitle(<friend_id>, "活跃之星")
```

```ts [TypeScript]
await client.pickGroup(<group_id>).setCard(<friend_id>, "新人小王")
await client.pickGroup(<group_id>).setAdmin(<friend_id>, true)
await client.pickGroup(<group_id>).setTitle(<friend_id>, "活跃之星")
```

:::

## 群设置

### 设置群名

- 方法：`group.setName(name)`
- 签名：`setName(name: string): Promise<boolean>`
- 描述：修改群名。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | `string` | 是 | - | 新群名。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

### 发送群公告

- 方法：`group.announce(content)`
- 签名：`announce(content: string): Promise<boolean>`
- 描述：发布一条简易群公告。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `string` | 是 | - | 公告内容。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickGroup(<group_id>).setName("我的新群名")
await client.pickGroup(<group_id>).announce("欢迎大家，请遵守群规")
```

```ts [TypeScript]
await client.pickGroup(<group_id>).setName("我的新群名")
await client.pickGroup(<group_id>).announce("欢迎大家，请遵守群规")
```

:::

## 群员列表与精华

### 获取群员列表

- 方法：`group.getMemberMap(no_cache?)`
- 签名：`getMemberMap(no_cache?: boolean): Promise<Map<number, MemberInfo>>`
- 描述：获取群员列表（键是群员 QQ 号）。第一次会从服务器拉取并缓存。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `no_cache` | `boolean` | 否 | `false` | `true` 强制忽略缓存重新拉取。 |

#### 返回值

`Promise<Map<number, MemberInfo>>` —— 群员 QQ 号到资料的映射。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const members = await client.pickGroup(<group_id>).getMemberMap()
console.log("群人数：", members.size)
for (const [uin, info] of members) {
  console.log(uin, info.card || info.nickname)
}
```

```ts [TypeScript]
const members = await client.pickGroup(<group_id>).getMemberMap()
console.log("群人数：", members.size)
```

:::

### 添加精华消息

- 方法：`group.addEssence(seq, rand)`
- 签名：`addEssence(seq: number, rand: number): Promise<string>`
- 描述：把指定群消息设为精华。`seq` 与 `rand` 来自消息对象 / `MessageRet`。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `seq` | `number` | 是 | - | 消息序号。 |
| `rand` | `number` | 是 | - | 消息随机值。 |

#### 返回值

`Promise<string>` —— 成功时返回提示文案；失败抛 `ApiRejection`。

> 用 `message_id` 更方便：见 [`client.setEssenceMessage(message_id)`](/api/client#设置精华消息)。对应 `removeEssence(seq, rand)` 移除精华。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
client.on("message.group", async (e) => {
  if (e.raw_message === "加精") {
    await e.group.addEssence(e.seq, e.rand)
  }
})
```

```ts [TypeScript]
client.on("message.group", async (e) => {
  if (e.raw_message === "加精") await e.group.addEssence(e.seq, e.rand)
})
```

:::

## 其他群操作

### 邀请好友入群

- 方法：`group.invite(uin)`
- 签名：`invite(uin: number): Promise<boolean>`
- 描述：邀请一个好友加入本群。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `uin` | `number` | 是 | - | 要邀请的好友 QQ 号。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

### 退群

- 方法：`group.quit()`
- 签名：`quit(): Promise<boolean>`
- 描述：退出本群；若自己是群主则**解散该群**。

#### 参数

无。

#### 返回值

`Promise<boolean>` —— 是否成功。

### 群打卡

- 方法：`group.sign()`
- 签名：`sign(): Promise<{ result: number }>`
- 描述：在本群打卡。

#### 参数

无。

#### 返回值

`Promise<{ result: number }>`。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickGroup(<group_id>).invite(<friend_id>)
await client.pickGroup(<group_id>).sign()
// await client.pickGroup(<group_id>).quit()
```

```ts [TypeScript]
await client.pickGroup(<group_id>).invite(<friend_id>)
await client.pickGroup(<group_id>).sign()
```

:::

### 紧凑方法表

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `pickMember(uin, strict?)` | `(uin: number) => Member` | 取该群的某个群员对象。 |
| `pokeMember(uin)` | `(uin: number) => Promise<boolean>` | 群内戳一戳某人。 |
| `setRemark(remark?)` | `(remark?: string) => Promise<void>` | 设置群备注（仅自己可见）。 |
| `setAvatar(file)` | `(file: string \| Buffer) => Promise<void>` | 设置群头像（需管理权限）。 |
| `getAvatarUrl(size?, history?)` | `(size?, history?) => string` | 拼出群头像 URL。 |
| `getChatHistory(seq?, cnt?)` | `(seq?, cnt?) => Promise<GroupMessage[]>` | 取群聊记录。 |
| `getAtAllRemainder()` | `() => Promise<number>` | 查 @全体成员 今日剩余次数。 |
| `getFileUrl(fid)` | `(fid: string) => Promise<string>` | 取群文件下载地址。 |
| `markRead(seq?)` | `(seq?: number) => Promise<void>` | 标记群消息已读。 |
| `allowAnony(yes?)` | `(yes?: boolean) => Promise<boolean>` | 开 / 关匿名聊天。 |
| `removeEssence(seq, rand)` | `(seq, rand) => Promise<string>` | 移除精华消息。 |
| `renew()` | `() => Promise<GroupInfo>` | 强制刷新群资料。 |

## getter 属性

直接读取的只读属性（不是方法）。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `group_id` / `gid` | `number` | 群号。 |
| `info` | `GroupInfo \| undefined` | 群资料对象。 |
| `name` | `string \| undefined` | 群名。 |
| `is_owner` | `boolean` | 我是否是群主。 |
| `is_admin` | `boolean` | 我是否是管理员（含群主）。 |
| `all_muted` | `boolean` | 当前是否全员禁言。 |
| `mute_left` | `number` | 我的禁言剩余秒数。 |
| `fs` | `Gfs` | 群文件系统对象，见 [群文件 Gfs](/api/gfs)。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
const g = client.pickGroup(<group_id>)
console.log(g.name, g.is_admin, g.all_muted)
// 群文件操作走 g.fs
```

```ts [TypeScript]
const g = client.pickGroup(<group_id>)
console.log(g.name, g.is_admin, g.all_muted)
```

:::

## 讨论组 Discuss

讨论组是较少使用的群聊形态，对象用 `client.pickDiscuss(<group_id>)` 得到。它能力很简单，主要只有发消息。`Group` 实际上继承自 `Discuss`。

### 发送消息

- 方法：`discuss.sendMsg(content)`
- 签名：`sendMsg(content: Sendable): Promise<MessageRet>`
- 描述：向讨论组发送一条消息。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `Sendable` | 是 | - | 消息内容。 |

#### 返回值

`Promise<MessageRet>`（讨论组的 `message_id` 为空字符串，不支持按 id 撤回）。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickDiscuss(<group_id>).sendMsg("讨论组消息")
```

```ts [TypeScript]
await client.pickDiscuss(<group_id>).sendMsg("讨论组消息")
```

:::

### 相关

[Member](/api/member) · [群文件 Gfs](/api/gfs) · [消息与消息段](/guide/message) · [Client](/api/client)
