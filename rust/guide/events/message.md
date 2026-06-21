# 消息事件

`post_type: "message"`——有人给 Bot 发了消息。

## 公共字段

所有消息事件都包含以下字段：

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `post_type` | string | 固定 `"message"` |
| `message_type` | string | `"private"` / `"group"` / `"discuss"` / `"guild"` |
| `sub_type` | string | 子类型（见下方各节） |
| `message_id` | string | 消息 ID（字符串，用于回复/撤回） |
| `message` | array | 消息内容（段数组） |
| `raw_message` | string | 纯文本（仅文本段拼接） |
| `user_id` | number | 发送者 QQ 号 |
| `font` | number | 字体（通常为 `0`） |
| `sender` | object | 发送者信息 |

---

## 私聊消息

`message_type: "private"`

| sub_type | 场景 |
| ---- | ---- |
| `friend` | 好友私聊 |
| `group` | 群临时会话 |

### sender 字段

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` | number | 发送者 QQ 号 |
| `nickname` | string | 昵称 |
| `group_id` | number | 临时会话时，来源群号 |

### 示例

```json
{
  "post_type": "message",
  "message_type": "private",
  "sub_type": "friend",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "user_id": "<friend_id>",
  "message_id": "<message_id>",
  "message": [
    { "type": "text", "data": { "text": "你好呀" } }
  ],
  "raw_message": "你好呀",
  "font": 0,
  "sender": {
    "user_id": "<friend_id>",
    "nickname": "Alice"
  }
}
```

---

## 群消息

`message_type: "group"`

| sub_type | 场景 |
| ---- | ---- |
| `normal` | 普通群消息 |
| `anonymous` | 匿名消息 |

### sender 字段

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` | number | 发送者 QQ 号 |
| `nickname` | string | 昵称 |
| `card` | string | 群名片 |
| `role` | string | 角色：`"owner"` / `"admin"` / `"member"` |
| `level` | string | 群等级 |
| `title` | string | 专属头衔 |
| `sex` | string | `"male"` / `"female"` / `"unknown"` |
| `age` | number | 年龄 |
| `area` | string | 地区 |

### 匿名字段

匿名消息时额外带 `anonymous` 对象：

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `id` | number | 匿名用户 ID |
| `name` | string | 匿名名称 |
| `flag` | string | 匿名 flag（用于禁言） |

### 示例

```json
{
  "post_type": "message",
  "message_type": "group",
  "sub_type": "normal",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "message_id": "<message_id>",
  "message": [
    { "type": "text", "data": { "text": "hello " } },
    { "type": "at", "data": { "qq": "999" } }
  ],
  "raw_message": "hello ",
  "font": 0,
  "sender": {
    "user_id": "<friend_id>",
    "nickname": "nick",
    "card": "群名片",
    "role": "admin",
    "level": "3",
    "title": "头衔",
    "sex": "unknown",
    "age": 0,
    "area": ""
  }
}
```

---

## 讨论组消息

`message_type: "discuss"`

::: info
OneBot 11 标准没有讨论组类型，这里按 `discuss` 透传以保留字段。
:::

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `discuss_id` | number | 讨论组 ID |

---

## 频道消息

`message_type: "guild"`, `sub_type: "channel"`

频道消息的 ID 字段**全部为字符串**。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `guild_id` | string | 频道 ID |
| `channel_id` | string | 子频道 ID |
| `user_id` | string | 发送者 tiny_id（字符串） |

### sender 字段

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` | string | tiny_id |
| `tiny_id` | string | 同 user_id |
| `nickname` | string | 昵称 |

### 示例

```json
{
  "post_type": "message",
  "message_type": "guild",
  "sub_type": "channel",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "guild_id": "12345678",
  "channel_id": "9876",
  "user_id": "666888",
  "message_id": "<message_id>",
  "message": [
    { "type": "text", "data": { "text": "频道消息" } }
  ],
  "raw_message": "频道消息",
  "font": 0,
  "sender": {
    "user_id": "666888",
    "tiny_id": "666888",
    "nickname": "频道用户"
  }
}
```
