# Friend / User

用 `client.pickFriend(<friend_id>)` 得到 `Friend` 对象；用 `client.pickUser(<uin>)` 得到 `User` 对象。

**`Friend` 继承自 `User`**：`User` 是通用的「用户」基类，对任意 QQ 号（包括陌生人）都可用；`Friend` 在它之上加了好友专属能力（备注、删除好友、离线文件等）。所以下面 **User 通用方法** 在 `Friend` 上同样可用。

本页示例均假设 `client` 已登录。

## User 通用方法

### 发送消息

- 方法：`user.sendMsg(content, source?)`
- 签名：`sendMsg(content: Sendable, source?: Quotable): Promise<MessageRet>`
- 描述：给该用户发送一条私聊消息。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `Sendable` | 是 | - | 文本字符串、单个消息段或其数组。 |
| `source` | `Quotable` | 否 | - | 要引用回复的消息（一般直接传收到的消息事件）。 |

#### 返回值

`Promise<MessageRet>` —— `{ message_id, seq, rand, time }`。`message_id` 是字符串，用于撤回 / 引用。

#### 失败

被风控、未登录或对方限制时，`Promise` 抛出 `ApiRejection`（含 `code` 与 `message`），用 `try/catch` 捕获。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const friend = client.pickFriend(<friend_id>)
const ret = await friend.sendMsg("你好！")
console.log(ret.message_id)
```

```ts [TypeScript]
const friend = client.pickFriend(<friend_id>)
const ret = await friend.sendMsg("你好！")
console.log(ret.message_id)
```

:::

#### 相关

[消息与消息段](/guide/message) · [`segment`](/api/segment)

### 撤回消息

- 方法：`user.recallMsg(message_id)`
- 签名（重载）：
  - `recallMsg(message_id: string): Promise<boolean>`
  - `recallMsg(message: PrivateMessage): Promise<boolean>`
  - `recallMsg(seq: number, rand: number, time: number): Promise<boolean>`
- 描述：撤回一条私聊消息。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 最常用：传 `message_id` 即可。 |
| `message` | `PrivateMessage` | 是 | - | 也可直接传收到的私聊消息对象。 |

#### 返回值

`Promise<boolean>` —— 是否撤回成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const ret = await client.pickFriend(<friend_id>).sendMsg("等下我撤回")
await client.pickFriend(<friend_id>).recallMsg(ret.message_id)
```

```ts [TypeScript]
const ret = await client.pickFriend(<friend_id>).sendMsg("等下我撤回")
await client.pickFriend(<friend_id>).recallMsg(ret.message_id)
```

:::

### 获取聊天记录

- 方法：`user.getChatHistory(time?, cnt?)`
- 签名：`getChatHistory(time?: number, cnt?: number): Promise<PrivateMessage[]>`
- 描述：获取 `time` 之前的若干条私聊记录。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `time` | `number` | 否 | `0` | 起点时间戳（秒）。`0` 表示当前时间；负数表示从最后一条往前偏移。 |
| `cnt` | `number` | 否 | `20` | 取多少条；旧协议超过 `20` 按 `20` 处理。 |

#### 返回值

`Promise<PrivateMessage[]>` —— 服务器记录不足时返回能取到的最多条数。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const list = await client.pickFriend(<friend_id>).getChatHistory(0, 10)
console.log("取到", list.length, "条")
```

```ts [TypeScript]
const list = await client.pickFriend(<friend_id>).getChatHistory(0, 10)
console.log("取到", list.length, "条")
```

:::

### 点赞

- 方法：`user.thumbUp(times?)`
- 签名：`thumbUp(times?: number): Promise<boolean>`
- 描述：给该用户名片点赞，支持给陌生人点赞。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `times` | `number` | 否 | `1` | 点赞次数，最多 `20`，超过按 `20` 处理。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录；陌生人也能点赞
await client.pickUser(<friend_id>).thumbUp(10)
```

```ts [TypeScript]
await client.pickUser(<friend_id>).thumbUp(10)
```

:::

### 其他 User 方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getAvatarUrl(size?)` | `(size?: 0 \| 40 \| 100 \| 140) => string` | 拼出头像 URL，不发请求。 |
| `getSimpleInfo()` | `() => Promise<{ user_id, nickname, sex, age, area }>` | 查简略资料。 |
| `getProfile(idsParse?)` | `() => Promise<Record<string, any>>` | 查资料卡。 |
| `markRead(time?)` | `(time?: number) => Promise<void>` | 把 `time` 之前标记为已读。 |
| `getFileUrl(fid)` | `(fid: string) => Promise<string>` | 取离线文件下载地址。 |
| `getFileInfo(fid)` | `(fid: string) => Promise<{ name, fid, md5, size, duration, url }>` | 取离线文件信息。 |
| `asFriend(strict?)` | `(strict?: boolean) => Friend` | 转成好友对象。 |
| `asMember(gid, strict?)` | `(gid: number, strict?: boolean) => Member` | 转成某群的群员对象。 |

## Friend 专属方法

下列方法只在 `Friend`（你的好友）上有意义。

### 戳一戳

- 方法：`friend.poke(self?)`
- 签名：`poke(self?: boolean): Promise<boolean>`
- 描述：戳一戳该好友。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `self` | `boolean` | 否 | `false` | `true` 表示戳自己（在该好友的会话里）。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickFriend(<friend_id>).poke()
```

```ts [TypeScript]
await client.pickFriend(<friend_id>).poke()
```

:::

### 设置备注

- 方法：`friend.setRemark(remark)`
- 签名：`setRemark(remark: string): Promise<void>`
- 描述：修改对该好友的备注名。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `remark` | `string` | 是 | - | 新备注，传空字符串可清除。 |

#### 返回值

`Promise<void>`。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickFriend(<friend_id>).setRemark("老同学")
```

```ts [TypeScript]
await client.pickFriend(<friend_id>).setRemark("老同学")
```

:::

### 删除好友

- 方法：`friend.delete(block?)`
- 签名：`delete(block?: boolean): Promise<boolean>`
- 描述：删除该好友。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `block` | `boolean` | 否 | `true` | 是否屏蔽此人之后的好友申请。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickFriend(<friend_id>).delete()
```

```ts [TypeScript]
await client.pickFriend(<friend_id>).delete()
```

:::

### 上传离线文件

- 方法：`friend.uploadFile(file, name?, callback?)`
- 签名：`uploadFile(file: string | Buffer, name?: string, callback?: (percentage: string) => void): Promise<{ name, fid, md5, size, duration, url }>`
- 描述：给好友上传一个离线文件（上传后并不会自动发送消息，用 `sendFile` 才会发送）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string \| Buffer` | 是 | - | 本地文件路径，或直接传文件内容 `Buffer`。 |
| `name` | `string` | 否 | - | 对方看到的文件名；`file` 为 `Buffer` 且留空时用 md5 命名。 |
| `callback` | `(percentage: string) => void` | 否 | - | 上传进度回调，参数是百分比字符串。 |

#### 返回值

`Promise<...>` —— 文件信息对象，含 `fid`（撤回 / 转发时用）、`url` 等。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const info = await client.pickFriend(<friend_id>).uploadFile("./report.pdf", "报告.pdf", (p) => {
  console.log("进度", p)
})
console.log(info.fid)
```

```ts [TypeScript]
const info = await client.pickFriend(<friend_id>).uploadFile("./report.pdf", "报告.pdf")
console.log(info.fid)
```

:::

### 获取离线文件地址

- 方法：`friend.getFileUrl(fid)`
- 签名：`getFileUrl(fid: string): Promise<string>`
- 描述：根据文件 id 取离线文件的下载直链。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string` | 是 | - | 文件 id（来自文件消息或 `uploadFile` 返回）。 |

#### 返回值

`Promise<string>` —— 可下载的 URL。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const url = await client.pickFriend(<friend_id>).getFileUrl("<fid>")
console.log(url)
```

```ts [TypeScript]
const url = await client.pickFriend(<friend_id>).getFileUrl("<fid>")
console.log(url)
```

:::

### 其他 Friend 方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `setClass(id)` | `(id: number) => Promise<void>` | 移动到指定好友分组（分组 id 不存在也会成功）。 |
| `sendFile(file, filename?, callback?)` | `(file, filename?, callback?) => Promise<string>` | 上传并发送离线文件，返回 `fid`。 |
| `recallFile(fid)` | `(fid: string) => Promise<boolean>` | 撤回离线文件。 |
| `forwardFile(fid, group_id?, send?)` | `(fid, group_id?, send?) => Promise<string>` | 转发离线文件，返回新 `fid`。 |
| `searchSameGroup()` | `() => Promise<{ groupName, Group_Id }[]>` | 查与该好友的共同群。 |
| `addFriendBack(seq, remark?)` | `(seq, remark?) => Promise<boolean>` | 回添双向好友。 |

## getter 属性

直接读取的只读属性（不是方法）。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `user_id` / `uin` | `number` | 该用户的 QQ 号。 |
| `info` | `FriendInfo \| undefined` | 好友资料对象（`Friend` 上）。 |
| `nickname` | `string \| undefined` | 昵称（`Friend`）。 |
| `sex` | `"male" \| "female" \| "unknown" \| undefined` | 性别（`Friend`）。 |
| `remark` | `string \| undefined` | 备注（`Friend`）。 |
| `class_id` | `number \| undefined` | 所在好友分组 id。 |
| `class_name` | `string \| undefined` | 所在好友分组名。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
const f = client.pickFriend(<friend_id>)
console.log(f.nickname, f.remark, f.sex)
```

```ts [TypeScript]
const f = client.pickFriend(<friend_id>)
console.log(f.nickname, f.remark, f.sex)
```

:::

### 相关

[消息与消息段](/guide/message) · [Client](/api/client) · [Group / Discuss](/api/group)
