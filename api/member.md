# Member

用 `client.pickMember(<group_id>, <friend_id>)` 得到 `Member` 对象，表示某个群里的某位成员。也可以从群对象 `client.pickGroup(<group_id>).pickMember(<friend_id>)` 取得。

**`Member` 也继承自 `User`**：所以它同样有 `sendMsg`、`getProfile`、`thumbUp` 等通用方法。对群员调用 `sendMsg` 即发起**群临时会话**（不是群消息）。User 通用方法详见 [Friend / User](/api/friend#user-通用方法)。

> 管理类操作（踢人、禁言、设管理员、设头衔）需要你在该群是群主或管理员，否则失败。多数方法返回 `Promise<boolean>`。

本页示例均假设 `client` 已登录。

## 方法

### 踢出

- 方法：`member.kick(msg?, block?)`
- 签名：`kick(msg?: string, block?: boolean): Promise<boolean>`
- 描述：把该群员踢出群。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `msg` | `string` | 否 | - | 附带的踢出消息。 |
| `block` | `boolean` | 否 | `false` | 是否屏蔽（不允许再加群）。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).kick()
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).kick()
```

:::

### 禁言

- 方法：`member.mute(duration?)`
- 签名：`mute(duration?: number): Promise<boolean>`
- 描述：禁言该群员。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `duration` | `number` | 否 | `1800` | 禁言时长（秒），最长 30 天（`2592000`）；传 `0` 解除禁言。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).mute(600) // 10 分钟
await client.pickMember(<group_id>, <friend_id>).mute(0)   // 解除
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).mute(600)
await client.pickMember(<group_id>, <friend_id>).mute(0)
```

:::

### 设置管理员

- 方法：`member.setAdmin(yes?)`
- 签名：`setAdmin(yes?: boolean): Promise<boolean>`
- 描述：设置 / 取消该群员为管理员（需群主权限）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `yes` | `boolean` | 否 | `true` | `true` 设为管理员，`false` 取消。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).setAdmin(true)
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).setAdmin(true)
```

:::

### 设置头衔

- 方法：`member.setTitle(title?, duration?)`
- 签名：`setTitle(title?: string, duration?: number): Promise<boolean>`
- 描述：给该群员设置专属头衔（需群主权限）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `string` | 否 | `""` | 头衔名，空字符串表示清除。 |
| `duration` | `number` | 否 | `-1` | 持续秒数，`-1` 表示永久。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).setTitle("锦鲤", -1)
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).setTitle("锦鲤", -1)
```

:::

### 修改名片

- 方法：`member.setCard(card?)`
- 签名：`setCard(card?: string): Promise<boolean>`
- 描述：修改该群员的群名片。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `card` | `string` | 否 | `""` | 新名片，空字符串表示清空。 |

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).setCard("管理员-小李")
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).setCard("管理员-小李")
```

:::

### 戳一戳

- 方法：`member.poke()`
- 签名：`poke(): Promise<boolean>`
- 描述：在群里戳一戳该成员。

#### 参数

无。

#### 返回值

`Promise<boolean>` —— 是否成功。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).poke()
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).poke()
```

:::

### 加为好友

- 方法：`member.addFriend(comment?)`
- 签名：`addFriend(comment?: string): Promise<boolean>`
- 描述：把该群员加为好友（发送好友申请）。

#### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `comment` | `string` | 否 | `""` | 申请附言。 |

#### 返回值

`Promise<boolean>` —— 是否成功发出申请（对方设置不允许时返回 `false`）。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
await client.pickMember(<group_id>, <friend_id>).addFriend("群里聊过，加个好友")
```

```ts [TypeScript]
await client.pickMember(<group_id>, <friend_id>).addFriend("群里聊过，加个好友")
```

:::

### 刷新资料

- 方法：`member.renew()`
- 签名：`renew(): Promise<MemberInfo>`
- 描述：强制从服务器刷新该群员的资料（名片、头衔、角色等）。

#### 参数

无。

#### 返回值

`Promise<MemberInfo>` —— 最新的群员资料。

#### 示例

::: code-group

```js [JavaScript]
// 假设 client 已登录
const info = await client.pickMember(<group_id>, <friend_id>).renew()
console.log(info.card, info.role)
```

```ts [TypeScript]
const info = await client.pickMember(<group_id>, <friend_id>).renew()
console.log(info.card, info.role)
```

:::

### 其他方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `sendMsg(content, source?)` | 继承自 `User` | 发起群临时会话。 |
| `setScreenMsg(isScreen?)` | `(isScreen?: boolean) => Promise<boolean>` | 屏蔽 / 取消屏蔽该成员的消息。 |
| `getProfile()` | 继承自 `User` | 查资料卡。 |
| `thumbUp(times?)` | 继承自 `User` | 给该成员点赞。 |

## getter 属性

直接读取的只读属性（不是方法）。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `group_id` / `gid` | `number` | 所在群号。 |
| `user_id` / `uin` | `number` | 该成员 QQ 号。 |
| `info` | `MemberInfo \| undefined` | 群员资料对象（访问时可能自动刷新）。 |
| `card` | `string \| undefined` | 群名片（无名片时取昵称）。 |
| `title` | `string \| undefined` | 群头衔。 |
| `is_owner` | `boolean` | 是否是群主。 |
| `is_admin` | `boolean` | 是否是管理员（含群主）。 |
| `is_friend` | `boolean` | 是否是我的好友。 |
| `mute_left` | `number` | 禁言剩余秒数。 |
| `group` | `Group` | 所在群的对象。 |

::: code-group

```js [JavaScript]
// 假设 client 已登录
const m = client.pickMember(<group_id>, <friend_id>)
console.log(m.card, m.title, m.is_admin)
// 也可以反向拿到群对象
await m.group.muteMember(m.user_id, 60)
```

```ts [TypeScript]
const m = client.pickMember(<group_id>, <friend_id>)
console.log(m.card, m.title, m.is_admin)
await m.group.muteMember(m.user_id, 60)
```

:::

### 相关

[Group / Discuss](/api/group) · [Friend / User](/api/friend) · [Client](/api/client)
