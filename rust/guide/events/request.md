# 请求事件

`post_type: "request"`——有人申请加好友或加群。

收到请求后，可以调用 `set_friend_add_request` 或 `set_group_add_request` API 来同意或拒绝。

---

## 好友申请

`request_type: "friend"`

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"add"` / `"single"` |
| `user_id` | number | 申请人 QQ 号 |
| `comment` | string | 验证信息 |
| `flag` | string | 请求标识（处理请求时需要传回） |

### 扩展字段

以下字段为 icqq 额外提供，非 OneBot 11 标准：

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `nickname` | string | 申请人昵称 |
| `source` | string | 来源（如「通过手机号」「通过群聊」） |
| `sex` | string | 性别 |
| `age` | number | 年龄 |

### 示例

```json
{
  "post_type": "request",
  "request_type": "friend",
  "sub_type": "add",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "user_id": "<friend_id>",
  "comment": "加个好友",
  "flag": "~000027662a",
  "nickname": "Alice",
  "source": "通过手机号"
}
```

### 处理请求

::: code-group

```javascript [Node.js]
// 同意好友申请
await fetch("http://127.0.0.1:5700/set_friend_add_request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    flag: event.flag,
    approve: true
  })
});
```

```python [Python]
# 同意好友申请
requests.post("http://127.0.0.1:5700/set_friend_add_request", json={
    "flag": event["flag"],
    "approve": True
})
```

:::

---

## 入群申请

`request_type: "group"`, `sub_type: "add"`

有人申请加入群聊（需要管理员审批）。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 申请人 QQ 号 |
| `comment` | string | 验证信息（答题内容等） |
| `flag` | string | 请求标识 |

### 扩展字段

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_name` | string | 群名 |
| `nickname` | string | 申请人昵称 |
| `inviter_id` | number | 邀请者 |
| `tips` | string | 提示文本 |

### 示例

```json
{
  "post_type": "request",
  "request_type": "group",
  "sub_type": "add",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "comment": "我是张三的朋友",
  "flag": "~000028abc1"
}
```

---

## 群邀请

`request_type: "group"`, `sub_type: "invite"`

有人邀请 Bot 加入群聊。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `group_id` | number | 群号 |
| `user_id` | number | 邀请人 QQ 号 |
| `flag` | string | 请求标识 |

### 处理请求

::: code-group

```javascript [Node.js]
// 同意入群申请
await fetch("http://127.0.0.1:5700/set_group_add_request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    flag: event.flag,
    sub_type: event.sub_type,
    approve: true
  })
});
```

```python [Python]
# 同意入群申请
requests.post("http://127.0.0.1:5700/set_group_add_request", json={
    "flag": event["flag"],
    "sub_type": event["sub_type"],
    "approve": True
})
```

:::
