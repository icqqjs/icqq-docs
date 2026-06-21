# 事件类型参考

本页是 [事件系统](/guide/events) 的「类型详表」配套页，逐个列出每个事件的触发时机与回调参数字段。

事件名是分层的：监听 `message` 收全部消息，监听 `message.group` 只收群消息。父事件能收到子事件。用 `client.on("事件名", 回调)` 注册。

事件分为五组：[message（消息）](#message-消息)、[notice（通知）](#notice-通知)、[request（申请）](#request-申请)、[system（系统）](#system-系统)、[sync（同步）](#sync-同步)。

---

## message（消息）

### 私聊消息

- 事件: `message.private`
- 触发: 收到任意私聊消息时。

#### 回调参数 `PrivateMessageEvent`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `message_id` | `string` | 消息 id，用于撤回 / 引用。 |
| `user_id` | `number` | 发送者账号。 |
| `sender` | `StrangerInfo` 等 | 发送者信息（含 `user_id`、`nickname` 等）。 |
| `message` | `MessageElem[]` | 已解析的消息段数组。 |
| `raw_message` | `string` | 文本化预览。 |
| `time` | `number` | 时间（秒）。 |
| `friend` | `Friend` | 好友对象，可直接操作。 |

> 带便捷方法 `reply(content, quote?)` 快速回复。

```js
client.on("message.private", (e) => {
  if (e.raw_message === "ping") e.reply("pong")
})
```

### 群消息

- 事件: `message.group`
- 触发: 收到任意群消息时。

#### 回调参数 `GroupMessageEvent`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `message_id` | `string` | 消息 id。 |
| `group_id` | `number` | 群号。 |
| `user_id` | `number` | 发送者账号。 |
| `sender` | `MemberInfo` | 发送者信息。 |
| `message` | `MessageElem[]` | 已解析的消息段数组。 |
| `raw_message` | `string` | 文本化预览。 |
| `time` | `number` | 时间（秒）。 |
| `group` | `Group` | 该群对象，可直接操作。 |
| `member` | `Member` | 发送者成员对象。 |

> 带便捷方法：`reply(content, quote?)` 快速回复、`recall()` 撤回本条。

```js
client.on("message.group", (e) => {
  if (e.raw_message === "ping") e.reply("pong", true)
})
```

### 讨论组消息

- 事件: `message.discuss`
- 触发: 收到讨论组消息时。

#### 回调参数 `DiscussMessageEvent`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `discuss_id` | `number` | 讨论组号。 |
| `user_id` | `number` | 发送者账号。 |
| `message` | `MessageElem[]` | 已解析的消息段数组。 |
| `raw_message` | `string` | 文本化预览。 |
| `time` | `number` | 时间（秒）。 |
| `discuss` | `Discuss` | 讨论组对象。 |

> 带便捷方法 `reply(content, quote?)`。

### 频道消息

- 事件: `message.guild`
- 触发: 收到频道（子频道）消息时。

回调参数 `GuildMessageEvent` 的字段表与示例见 [Guild / Channel](/api/guild#接收频道消息)。

---

## notice（通知）

通知分两类：好友通知（`notice.friend.*`）与群通知（`notice.group.*`）。

### 好友增加

- 事件: `notice.friend.increase`
- 触发: 新增一个好友时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `post_type` | `"notice"` | 固定值。 |
| `notice_type` | `"friend"` | 固定值。 |
| `sub_type` | `"increase"` | 固定值。 |
| `user_id` | `number` | 对方账号。 |
| `nickname` | `string` | 好友昵称。 |
| `friend` | `Friend` | 好友对象。 |

### 好友减少

- 事件: `notice.friend.decrease`
- 触发: 删除 / 失去一个好友时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"decrease"` | 固定值。 |
| `user_id` | `number` | 对方账号。 |
| `nickname` | `string` | 好友昵称。 |
| `friend` | `Friend` | 好友对象。 |

### 好友消息撤回

- 事件: `notice.friend.recall`
- 触发: 私聊中有消息被撤回时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"recall"` | 固定值。 |
| `user_id` | `number` | 对方账号。 |
| `operator_id` | `number` | 撤回操作者账号。 |
| `message_id` | `string` | 被撤回消息的 id。 |
| `seq` | `number` | 消息序号。 |
| `rand` | `number` | 随机标识。 |
| `time` | `number` | 时间（秒）。 |
| `friend` | `Friend` | 好友对象。 |

### 好友戳一戳

- 事件: `notice.friend.poke`
- 触发: 私聊中被戳一戳时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"poke"` | 固定值。 |
| `operator_id` | `number` | 操作者账号。 |
| `target_id` | `number` | 目标账号。 |
| `action` | `string` | 戳一戳动作文字。 |
| `suffix` | `string` | 后缀文字。 |
| `friend` | `Friend` | 好友对象。 |

### 群员增加

- 事件: `notice.group.increase`
- 触发: 有人入群时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `notice_type` | `"group"` | 固定值。 |
| `sub_type` | `"increase"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `user_id` | `number` | 新成员账号。 |
| `nickname` | `string` | 新成员昵称。 |
| `group` | `Group` | 群对象。 |

### 群员减少

- 事件: `notice.group.decrease`
- 触发: 有人退群 / 被踢时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"decrease"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `operator_id` | `number` | 主动退群时为本人账号，被踢时为操作管理员 / 群主账号。 |
| `user_id` | `number` | 离开的成员账号。 |
| `dismiss` | `boolean` | 是否因群主退群导致群解散。 |
| `member` | `MemberInfo` | 退群成员信息（可能为空）。 |
| `group` | `Group` | 群对象。 |

### 群消息撤回

- 事件: `notice.group.recall`
- 触发: 群里有消息被撤回时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"recall"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `user_id` | `number` | 被撤回消息的发送者账号。 |
| `operator_id` | `number` | 执行撤回的账号。 |
| `message_id` | `string` | 被撤回消息 id。 |
| `seq` | `number` | 消息序号。 |
| `rand` | `number` | 随机标识。 |
| `time` | `number` | 时间（秒）。 |
| `group` | `Group` | 群对象。 |

### 群戳一戳

- 事件: `notice.group.poke`
- 触发: 群里有戳一戳时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"poke"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `operator_id` | `number` | 操作者账号。 |
| `target_id` | `number` | 目标账号。 |
| `action` | `string` | 动作文字。 |
| `suffix` | `string` | 后缀文字。 |
| `group` | `Group` | 群对象。 |

### 管理员变更

- 事件: `notice.group.admin`
- 触发: 群管理员被设置 / 取消时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"admin"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `user_id` | `number` | 变更的成员账号。 |
| `set` | `boolean` | `true` 设为管理员，`false` 取消。 |
| `group` | `Group` | 群对象。 |

### 群禁言

- 事件: `notice.group.ban`
- 触发: 成员被禁言 / 解禁，或开关全员禁言时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"ban"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `operator_id` | `number` | 操作者账号。 |
| `user_id` | `number` | 被禁言成员账号。 |
| `duration` | `number` | 禁言时长（秒），`0` 表示解禁。 |
| `nickname` | `string` | 匿名禁言时才有。 |
| `group` | `Group` | 群对象。 |

### 群转让

- 事件: `notice.group.transfer`
- 触发: 群主转让群时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"transfer"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `operator_id` | `number` | 原群主账号。 |
| `user_id` | `number` | 新群主账号。 |
| `group` | `Group` | 群对象。 |

### 群打卡

- 事件: `notice.group.sign`
- 触发: 群成员打卡时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"sign"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `user_id` | `number` | 打卡者账号。 |
| `nickname` | `string` | 打卡者昵称。 |
| `sign_text` | `string` | 打卡提示文字。 |
| `group` | `Group` | 群对象。 |

### 群表情回应

- 事件: `notice.group.reaction`
- 触发: 群消息被贴 / 取消表情回应时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sub_type` | `"reaction"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `user_id` | `number` | 操作者账号。 |
| `id` | `string` | 表情 id。 |
| `type` | `number` | 表情类型。 |
| `set` | `boolean` | `true` 回应，`false` 取消。 |
| `seq` | `number` | 被回应的消息序号。 |
| `group` | `Group` | 群对象。 |

---

## request（申请）

申请类事件都带便捷方法 `approve(yes?)` 来同意 / 拒绝。

### 好友申请

- 事件: `request.friend`
- 触发: 收到加好友申请时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `post_type` | `"request"` | 固定值。 |
| `request_type` | `"friend"` | 固定值。 |
| `sub_type` | `"add" \| "single"` | `single` 表示对方已将你加为单向好友。 |
| `user_id` | `number` | 申请人账号。 |
| `nickname` | `string` | 申请人昵称。 |
| `comment` | `string` | 验证消息。 |
| `source` | `string` | 申请来源。 |
| `age` | `number` | 年龄。 |
| `sex` | `Gender` | 性别。 |
| `flag` | `string` | 处理用标识。 |
| `seq` | `number` | 序号。 |
| `time` | `number` | 时间（秒）。 |

```js
client.on("request.friend", (e) => {
  e.approve(true) // 同意
})
```

### 群申请（入群）

- 事件: `request.group.add`
- 触发: 有人申请加入你管理的群时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `request_type` | `"group"` | 固定值。 |
| `sub_type` | `"add"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `group_name` | `string` | 群名。 |
| `user_id` | `number` | 申请人账号。 |
| `nickname` | `string` | 申请人昵称。 |
| `comment` | `string` | 申请理由。 |
| `inviter_id` | `number` | 若是被邀请进群，则为邀请者账号。 |
| `tips` | `string` | 申请提示。 |
| `flag` | `string` | 处理用标识。 |
| `seq` | `number` | 序号。 |
| `time` | `number` | 时间（秒）。 |

### 群邀请

- 事件: `request.group.invite`
- 触发: 你被邀请加入某个群时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `request_type` | `"group"` | 固定值。 |
| `sub_type` | `"invite"` | 固定值。 |
| `group_id` | `number` | 群号。 |
| `group_name` | `string` | 群名。 |
| `user_id` | `number` | 邀请者账号。 |
| `nickname` | `string` | 邀请者昵称。 |
| `role` | `GroupRole` | 邀请者在群里的权限。 |
| `flag` | `string` | 处理用标识。 |
| `seq` | `number` | 序号。 |
| `time` | `number` | 时间（秒）。 |

---

## system（系统）

登录与上下线相关。

### 收到二维码

- 事件: `system.login.qrcode`
- 触发: 扫码登录时收到二维码图片。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image` | `Buffer` | 二维码图片数据。 |

### 收到滑动验证码

- 事件: `system.login.slider`
- 触发: 登录需要滑块验证时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 滑块验证页地址。 |

### 设备锁验证

- 事件: `system.login.device`
- 触发: 登录触发设备锁时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 验证页地址。 |
| `phone` | `string` | 关联手机号。 |

### 身份验证

- 事件: `system.login.auth`
- 触发: 登录需要额外身份验证时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 验证页地址。 |
| `device` | `object` | 设备信息（含 `guid`、`qimei`、`platform` 等）。 |

### 登录错误

- 事件: `system.login.error`
- 触发: 登录失败时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `LoginErrorCode \| number` | 错误码，取值见 [枚举与常量](/api/enums)。 |
| `message` | `string` | 错误描述。 |

### 上线

- 事件: `system.online`
- 触发: 登录成功、可以收发消息时。回调参数为 `undefined`。

```js
client.on("system.online", () => console.log("已上线"))
```

### 下线

- 事件: `system.offline`（含子事件 `system.offline.network`、`system.offline.kickoff`）
- 触发: 掉线时。`network` 为网络原因（默认自动重连），`kickoff` 为被服务器踢下线。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `message` | `string` | 下线原因。 |

---

## sync（同步）

同步事件用于把你**在其他设备上的操作**同步到本进程。

### 私聊消息同步

- 事件: `sync.message`
- 触发: 你在别的设备发出的私聊消息同步过来时。回调参数为 `PrivateMessage`。

### 私聊已读同步

- 事件: `sync.read.private`
- 触发: 你在别处把某人的私聊标记为已读时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `user_id` | `number` | 对方账号。 |
| `time` | `number` | 已读时间点（秒）。 |

### 群聊已读同步

- 事件: `sync.read.group`
- 触发: 你在别处把某群标记为已读时。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `group_id` | `number` | 群号。 |
| `seq` | `number` | 已读到的消息序号。 |

> 还有汇总事件 `sync.read`，会同时收到上面两类已读同步。

### 相关

[事件系统](/guide/events) · [核心类型](/api/types) · [枚举与常量](/api/enums)
