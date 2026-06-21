# 通知事件

`post_type: "notice"`——群或好友状态发生了变化。

---

## 消息撤回

### 群消息撤回

`notice_type: "group_recall"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 消息发送者 |
| `operator_id` | number | 操作者（谁撤回的，自己撤回则等于 user_id） |
| `message_id` | string | 被撤回的消息 ID |

```json
{
  "post_type": "notice",
  "notice_type": "group_recall",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "operator_id": "<friend_id>",
  "message_id": "<message_id>"
}
```

### 好友消息撤回

`notice_type: "friend_recall"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` | number | 好友 QQ 号 |
| `message_id` | string | 被撤回的消息 ID |

---

## 群成员变动

### 群成员增加

`notice_type: "group_increase"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"approve"`（管理员同意）/ `"invite"`（被邀请） |
| `group_id` | number | 群号 |
| `operator_id` | number | 操作者（审批人或邀请人） |
| `user_id` | number | 新成员 |

```json
{
  "post_type": "notice",
  "notice_type": "group_increase",
  "sub_type": "approve",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "operator_id": "<friend_id>",
  "user_id": "<friend_id>"
}
```

### 群成员减少

`notice_type: "group_decrease"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"leave"`（主动退群）/ `"kick"`（被踢）/ `"kick_me"`（Bot 被踢） |
| `group_id` | number | 群号 |
| `operator_id` | number | 操作者（踢人者，主动退群时等于 user_id） |
| `user_id` | number | 离开的成员 |

---

## 好友添加

`notice_type: "friend_add"`

有新好友添加成功时触发。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` | number | 新好友 QQ 号 |

---

## 群管理员变动

`notice_type: "group_admin"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"set"`（设置管理员）/ `"unset"`（取消管理员） |
| `group_id` | number | 群号 |
| `user_id` | number | 被操作的成员 |

```json
{
  "post_type": "notice",
  "notice_type": "group_admin",
  "sub_type": "set",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "user_id": "<friend_id>"
}
```

---

## 群禁言

`notice_type: "group_ban"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"ban"`（禁言）/ `"lift_ban"`（解除禁言） |
| `group_id` | number | 群号 |
| `operator_id` | number | 操作者（管理员） |
| `user_id` | number | 被禁言的成员 |
| `duration` | number | 禁言时长（秒），解除时为 `0` |

```json
{
  "post_type": "notice",
  "notice_type": "group_ban",
  "sub_type": "ban",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "operator_id": "<friend_id>",
  "user_id": "<friend_id>",
  "duration": 600
}
```

---

## 群文件上传

`notice_type: "group_upload"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 上传者 |
| `file` | object | 文件信息（`id` / `name` / `size` / `busid`） |

---

## 戳一戳

`notice_type: "notify"`, `sub_type: "poke"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号（群内戳一戳时存在） |
| `user_id` | number | 戳人的人 |
| `target_id` | number | 被戳的人 |

```json
{
  "post_type": "notice",
  "notice_type": "notify",
  "sub_type": "poke",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "target_id": "<your-uin>"
}
```

---

## 运气王

`notice_type: "notify"`, `sub_type: "lucky_king"`

红包运气王产生时触发。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 发红包的人 |
| `target_id` | number | 运气王 |

---

## 群荣誉变更

`notice_type: "notify"`, `sub_type: "honor"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 获得荣誉的成员 |
| `honor_type` | string | 荣誉类型 |

---

## 群打卡

`notice_type: "notify"`, `sub_type: "group_sign"`

::: info NapCat 扩展
此事件为 NapCat 扩展，非 OneBot 11 标准。
:::

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 打卡的成员 |
| `nick` | string | 昵称 |
| `sign_text` | string | 打卡文本 |

---

## 群名片变更

`notice_type: "group_card"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 被修改的成员 |
| `card_new` | string | 新群名片 |
| `card_old` | string | 旧群名片 |

---

## 群转让

`notice_type: "group_transfer"`

::: info NapCat 扩展
此事件为 NapCat 扩展，非 OneBot 11 标准。
:::

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `operator_id` | number | 旧群主 |
| `user_id` | number | 新群主 |

---

## 表情回应

`notice_type: "group_msg_emoji_like"`

::: info NapCat 扩展
此事件为 NapCat 扩展，非 OneBot 11 标准。
:::

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"add"` / `"remove"` |
| `group_id` | number | 群号 |
| `user_id` | number | 操作者 |
| `message_id` | string | 被回应的消息 |
| `likes` | array | 表情列表 `[{ emoji_id, count }]` |

```json
{
  "post_type": "notice",
  "notice_type": "group_msg_emoji_like",
  "sub_type": "add",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "message_id": "<message_id>",
  "likes": [
    { "emoji_id": "128077", "count": 1 }
  ]
}
```

---

## 机器人掉线 (bot_offline)

`notice_type: "bot_offline"`

::: info NapCat 扩展
此事件为 NapCat 扩展（`BotOfflineEvent`），非 OneBot 11 标准。
:::

机器人被服务器**踢下线**（账号在别处登录、`KickNT` / 强制下线）时触发。这类掉线不会自动重登，因此除了标准的 `meta_event` 生命周期 `disable`（见[元事件](./meta.md)）外，额外推送此通知，方便仅监听 `notice` 的客户端感知掉线。

掉线后 [`get_status`](../../api/meta.md#获取运行状态) 的 `online` 字段会变为 `false`。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` | number | 机器人自身 QQ 号（同 `self_id`） |
| `tag` | string | 掉线原因标签，目前为 `"kickoff"` |
| `message` | string | 人类可读的掉线原因（服务器返回的踢下线文本） |

```json
{
  "post_type": "notice",
  "notice_type": "bot_offline",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "user_id": "<your-uin>",
  "tag": "kickoff",
  "message": "[xxx]您的账号在其他设备登录"
}
```

---

## 频道消息撤回

`notice_type: "guild_channel_recall"`

::: warning
频道事件的所有 ID 字段均为**字符串**。
:::

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `guild_id` | string | 频道 ID |
| `channel_id` | string | 子频道 ID |
| `user_id` | string | 消息发送者 |
| `operator_id` | string | 操作者 |
| `message_id` | string | 被撤回的消息 ID |
