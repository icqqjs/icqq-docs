# 消息 API

本页介绍私聊、群聊消息发送，合并转发，撤回，获取消息，群消息历史，标记已读，表情回应以及快速操作等接口。

`message_id` 是 base64url 编码的自描述字符串（非整数），由收到的消息事件携带。`get_forward_msg` 使用的 `id` 是合并转发资源的 resid（不透明字符串），不是消息的 message_id。

## 快速索引

| API | 描述 |
| --- | --- |
| `send_private_msg` | 发送私聊消息 |
| `send_group_msg` | 发送群消息 |
| `send_msg` | 发送消息（自动判定类型） |
| `send_group_forward_msg` | 发送群合并转发 |
| `send_private_forward_msg` | 发送私聊合并转发 |
| `send_forward_msg` | 发送合并转发（自动判定类型） |
| `delete_msg` | 撤回消息 |
| `get_msg` | 获取单条消息 |
| `get_forward_msg` | 获取合并转发内容 |
| `get_group_msg_history` | 获取群消息历史 |
| `mark_msg_as_read` | 标记消息已读 |
| `set_msg_emoji_like` | 消息表情回应 |
| `handle_quick_operation` | 快速操作 |

## 发送私聊消息

- API: `send_private_msg`
- 描述: 发送好友消息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number \| string` | 是 | - | 好友 QQ 号。推荐传字符串，避免大整数精度问题。 |
| `group_id` | `number \| string` | 否 | - | 群临时会话来源群号。 |
| `message` | `string \| MessageSegment[]` | 是 | - | 消息内容。可为纯文本字符串（按字面处理）或消息段数组；不支持 CQ 码。 |
| `auto_escape` | `boolean` | 否 | `false` | 为 `true` 时，`message` 按纯文本处理。 |

::: code-group

```json [JSON]
{
  "user_id": "<friend_id>",
  "message": "hello"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 发送成功后的消息 ID。 | 不要按数字解析。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_private_msg' \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"<friend_id>","message":"hello"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_private_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '<friend_id>',
    message: 'hello'
  })
})

const body = await res.json()
console.log(body.data.message_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_private_msg",
    json={
        "user_id": "<friend_id>",
        "message": "hello",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["message_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `user_id` 或 `message` 为空。 |
| `1500` | 发送失败，例如账号未在线、被风控、媒体文件不可用。 |

### 注意事项

- `message_id` 是字符串，请不要按数字解析。
- 发送短视频需要 `ffmpeg` / `ffprobe` 在 `PATH` 中可用。

## 发送群消息

- API: `send_group_msg`
- 描述: 发送群消息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。推荐传字符串，避免大整数精度问题。 |
| `message` | `string \| MessageSegment[]` | 是 | - | 消息内容。可为纯文本字符串（按字面处理）或消息段数组；不支持 CQ 码。 |
| `auto_escape` | `boolean` | 否 | `false` | 为 `true` 时，`message` 按纯文本处理。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "message": [{"type": "text", "data": {"text": "hi"}}]
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 发送成功后的消息 ID。 | 不要按数字解析。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_group_msg' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","message":"hi"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_group_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    message: 'hi'
  })
})

const body = await res.json()
console.log(body.data.message_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_group_msg",
    json={
        "group_id": "<group_id>",
        "message": "hi",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["message_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id` 或 `message` 为空。 |
| `1500` | 发送失败，例如账号未在线、被风控。 |

### 注意事项

- 发送短视频需要 `ffmpeg` / `ffprobe` 在 `PATH` 中可用。

## 发送消息

- API: `send_msg`
- 描述: 发送消息，自动判定私聊或群聊。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_type` | `string` | 否 | - | `private` \| `group`；指定时按此类型发送。 |
| `user_id` | `number \| string` | 否 | - | 私聊目标 QQ 号。 |
| `group_id` | `number \| string` | 否 | - | 群目标群号。 |
| `message` | `string \| MessageSegment[]` | 是 | - | 消息内容。可为纯文本字符串（按字面处理）或消息段数组；不支持 CQ 码。 |
| `auto_escape` | `boolean` | 否 | `false` | 为 `true` 时，`message` 按纯文本处理。 |

::: code-group

```json [JSON]
{
  "message_type": "group",
  "group_id": "<group_id>",
  "message": "hi"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 发送成功后的消息 ID。 | 不要按数字解析。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_msg' \
  -H 'Content-Type: application/json' \
  -d '{"message_type":"group","group_id":"<group_id>","message":"hi"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message_type: 'group',
    group_id: '<group_id>',
    message: 'hi'
  })
})

const body = await res.json()
console.log(body.data.message_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_msg",
    json={
        "message_type": "group",
        "group_id": "<group_id>",
        "message": "hi",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["message_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id` 和 `user_id`，或 `message` 为空。 |
| `1500` | 发送失败。 |

### 注意事项

- 未指定 `message_type` 时，按存在的 ID 推断：`group_id` 优先，其次 `user_id`。
- 发送短视频需要 `ffmpeg` / `ffprobe` 在 `PATH` 中可用。

## 发送群合并转发

- API: `send_group_forward_msg`
- 描述: 发送群合并转发消息。

### 版本变化

| 版本 | 变化 |
| --- | --- |
| `v0.1.12` | 新增 NapCat 兼容扩展字段 `source`、`news`、`summary`、`prompt`；响应新增 `forward_id`、`res_id`。节点未提供 `time` 或传入 `0` 时改为使用当前时间。 |

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `messages` | `MessageSegment[]` | 是 | - | 转发节点列表，每个元素必须是 `node` 类型的消息段。 |
| `source` | `string` | 否 | `转发的聊天记录` | 卡片来源标题。NapCat 兼容扩展。 |
| `news` | `{text: string}[]` | 否 | 根据节点生成 | 卡片预览行。NapCat 兼容扩展。 |
| `summary` | `string` | 否 | `查看N条转发消息` | 卡片摘要。NapCat 兼容扩展。 |
| `prompt` | `string` | 否 | `[聊天记录]` | 会话中的提示文本，同时写入卡片 `desc`。NapCat 兼容扩展。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "source": "项目讨论记录",
  "news": [{ "text": "A: 第一条重要消息" }],
  "summary": "共 3 条重要消息",
  "prompt": "[项目讨论记录]",
  "messages": [
    {
      "type": "node",
      "data": {
        "user_id": "<friend_id>",
        "nickname": "A",
        "content": "hi"
      }
    }
  ]
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 发送成功后的消息 ID。 | - |
| `forward_id` | `string` | 合并转发资源 resid。 | go-cqhttp 兼容字段。 |
| `res_id` | `string` | 合并转发资源 resid。 | NapCat 兼容字段。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>",
  "forward_id": "<resid>",
  "res_id": "<resid>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_group_forward_msg' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","messages":[{"type":"node","data":{"user_id":"<friend_id>","nickname":"A","content":"hi"}}]}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_group_forward_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    messages: [
      {
        type: 'node',
        data: { user_id: '<friend_id>', nickname: 'A', content: 'hi' }
      }
    ]
  })
})

const body = await res.json()
console.log(body.data.message_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_group_forward_msg",
    json={
        "group_id": "<group_id>",
        "messages": [
            {
                "type": "node",
                "data": {
                    "user_id": "<friend_id>",
                    "nickname": "A",
                    "content": "hi",
                },
            }
        ],
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["message_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如非 `node` 段或无节点。 |
| `1500` | 上传或发送失败。 |

## 发送私聊合并转发

- API: `send_private_forward_msg`
- 描述: 发送私聊合并转发消息。

### 版本变化

| 版本 | 变化 |
| --- | --- |
| `v0.1.12` | 新增 NapCat 兼容扩展字段 `source`、`news`、`summary`、`prompt`；响应新增 `forward_id`、`res_id`。节点未提供 `time` 或传入 `0` 时改为使用当前时间。 |

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number \| string` | 是 | - | 好友 QQ 号。 |
| `messages` | `MessageSegment[]` | 是 | - | 转发节点列表，每个元素必须是 `node` 类型的消息段。 |
| `source` | `string` | 否 | `转发的聊天记录` | 卡片来源标题。NapCat 兼容扩展。 |
| `news` | `{text: string}[]` | 否 | 根据节点生成 | 卡片预览行。NapCat 兼容扩展。 |
| `summary` | `string` | 否 | `查看N条转发消息` | 卡片摘要。NapCat 兼容扩展。 |
| `prompt` | `string` | 否 | `[聊天记录]` | 会话中的提示文本，同时写入卡片 `desc`。NapCat 兼容扩展。 |

::: code-group

```json [JSON]
{
  "user_id": "<friend_id>",
  "messages": [
    {
      "type": "node",
      "data": {
        "user_id": "<friend_id>",
        "nickname": "A",
        "content": "hi"
      }
    }
  ]
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 发送成功后的消息 ID。 | - |
| `forward_id` | `string` | 合并转发资源 resid。 | go-cqhttp 兼容字段。 |
| `res_id` | `string` | 合并转发资源 resid。 | NapCat 兼容字段。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>",
  "forward_id": "<resid>",
  "res_id": "<resid>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_private_forward_msg' \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"<friend_id>","messages":[{"type":"node","data":{"user_id":"<friend_id>","nickname":"A","content":"hi"}}]}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_private_forward_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '<friend_id>',
    messages: [
      {
        type: 'node',
        data: { user_id: '<friend_id>', nickname: 'A', content: 'hi' }
      }
    ]
  })
})

const body = await res.json()
console.log(body.data.message_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_private_forward_msg",
    json={
        "user_id": "<friend_id>",
        "messages": [
            {
                "type": "node",
                "data": {
                    "user_id": "<friend_id>",
                    "nickname": "A",
                    "content": "hi",
                },
            }
        ],
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["message_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如非 `node` 段或无节点。 |
| `1500` | 上传或发送失败。 |

## 发送合并转发

- API: `send_forward_msg`
- 描述: NapCat 兼容的统一合并转发接口。显式传入 `message_type` 时按其选择目标；否则优先使用 `group_id`，其次使用 `user_id`。

### 版本变化

| 版本 | 变化 |
| --- | --- |
| `v0.1.12` | 新增该统一接口，并支持 NapCat 兼容扩展字段 `source`、`news`、`summary`、`prompt`；响应包含 `forward_id`、`res_id`。 |

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_type` | `"group" \| "private"` | 否 | 自动判定 | 消息类型。 |
| `group_id` | `number \| string` | 条件必填 | - | 群目标。 |
| `user_id` | `number \| string` | 条件必填 | - | 私聊目标。 |
| `messages` | `MessageSegment[]` | 是 | - | `node` 类型的转发节点列表。 |
| `source` | `string` | 否 | `转发的聊天记录` | 卡片来源标题。NapCat 兼容扩展。 |
| `news` | `{text: string}[]` | 否 | 根据节点生成 | 卡片预览行。NapCat 兼容扩展。 |
| `summary` | `string` | 否 | `查看N条转发消息` | 卡片摘要。NapCat 兼容扩展。 |
| `prompt` | `string` | 否 | `[聊天记录]` | 会话中的提示文本。NapCat 兼容扩展。 |

```json
{
  "message_type": "group",
  "group_id": "<group_id>",
  "source": "项目讨论记录",
  "news": [
    { "text": "Alice: 第一条" },
    { "text": "Bob: 第二条" }
  ],
  "summary": "共 3 条重要消息",
  "prompt": "[项目讨论记录]",
  "messages": [
    {
      "type": "node",
      "data": {
        "user_id": "<friend_id>",
        "nickname": "Alice",
        "content": "第一条"
      }
    }
  ]
}
```

响应字段及错误码与 `send_group_forward_msg`、`send_private_forward_msg` 相同。

## 撤回消息

- API: `delete_msg`
- 描述: 撤回一条消息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 消息 ID。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/delete_msg' \
  -H 'Content-Type: application/json' \
  -d '{"message_id":"<message_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message_id: '<message_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/delete_msg",
    json={"message_id": "<message_id>"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["status"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | `message_id` 非法。 |
| `1500` | 撤回失败，例如超时或服务器拒绝。 |

## 获取单条消息

- API: `get_msg`
- 描述: 获取一条消息的详细信息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 消息 ID。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 消息 ID。 | - |
| `real_id` | `number` | 消息序号。 | - |
| `message_seq` | `number` | 消息序号。 | - |
| `message_type` | `string` | `private` \| `group`。 | - |
| `group` | `boolean` | 是否群消息。 | - |
| `group_id` | `number` | 群号。 | 仅群消息存在。 |
| `sender` | `object` | 发送者信息，含 `user_id` 和 `nickname`。 | - |
| `time` | `number` | 发送时间戳（秒）。 | - |
| `message` | `MessageSegment[]` | 消息段数组。 | - |
| `raw_message` | `string` | 纯文本原始消息（仅文本段拼接；不含 CQ 码）。 | - |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>",
  "real_id": 12345,
  "message_seq": 12345,
  "message_type": "group",
  "group": true,
  "group_id": 0,
  "sender": { "user_id": 0, "nickname": "" },
  "time": 1700000000,
  "message": [{ "type": "text", "data": { "text": "hi" } }],
  "raw_message": "hi"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_msg' \
  -H 'Content-Type: application/json' \
  -d '{"message_id":"<message_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message_id: '<message_id>'
  })
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | `message_id` 非法。 |
| `1500` | 拉取失败或解码失败。 |

### 注意事项

- `group_id` 仅群消息存在，私聊不包含此字段。

## 获取合并转发内容

- API: `get_forward_msg`
- 描述: 获取合并转发消息的内容。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `string` | 否* | - | 合并转发资源 resid。 |
| `message_id` | `string` | 否* | - | resid 别名。 |

> *`id` 与 `message_id` 至少提供一个非空。

::: code-group

```json [JSON]
{
  "id": "<resid>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `messages` | `object[]` | 转发消息列表，每项含 `sender`、`time`、`content`。 | - |

::: code-group

```json [JSON]
{
  "messages": [
    {
      "sender": { "user_id": 0, "nickname": "A" },
      "time": 1700000000,
      "content": [{ "type": "text", "data": { "text": "hi" } }]
    }
  ]
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_forward_msg' \
  -H 'Content-Type: application/json' \
  -d '{"id":"<resid>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_forward_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '<resid>'
  })
})

const body = await res.json()
console.log(body.data.messages)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 缺少 `id`（resid）。 |
| `1500` | 下载或解码失败。 |

### 注意事项

- `id` 是合并转发资源的不透明 resid，**不是** HEADER message_id。

## 获取群消息历史

- API: `get_group_msg_history`
- 描述: 获取群历史消息记录。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `message_seq` | `number \| string` | 否 | `0`（最新） | 起始消息序号，优先于 `message_id`。 |
| `message_id` | `string` | 否 | - | 起始消息 ID，用于推导序号。 |
| `count` | `number \| string` | 否 | `20` | 拉取条数。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "count": 20
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `messages` | `object[]` | 消息列表。 | 每项包含 `group_id`、`user_id`、`time`、`message_seq`、`message_id`、`message`。 |

::: code-group

```json [JSON]
{
  "messages": [
    {
      "group_id": 0,
      "user_id": 0,
      "time": 1700000000,
      "message_seq": 12345,
      "message_id": "<message_id>",
      "message": [{ "type": "text", "data": { "text": "hi" } }]
    }
  ]
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_msg_history' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","count":20}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_msg_history', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    count: 20
  })
})

const body = await res.json()
console.log(body.data.messages)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | `message_id` 非群消息 ID 或非法。 |
| `1500` | 拉取或解码失败。 |

### 注意事项

- `message_seq` 优先于 `message_id`。

## 标记消息已读

- API: `mark_msg_as_read`
- 描述: 将指定消息标记为已读。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 消息 ID。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>"
}
```
:::

### 响应参数

成功时 `data` 为空对象 `{}`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/mark_msg_as_read' \
  -H 'Content-Type: application/json' \
  -d '{"message_id":"<message_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/mark_msg_as_read', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message_id: '<message_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/mark_msg_as_read",
    json={"message_id": "<message_id>"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["status"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | `message_id` 非法。 |
| `1500` | 标记失败。 |

## 消息表情回应

- API: `set_msg_emoji_like`
- 描述: 对群消息添加或取消表情回应（表态）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 群消息 ID。仅群消息可用。 |
| `emoji_id` | `string \| number` | 是 | - | 表情 ID。 |
| `set` | `boolean` | 否 | `true` | `true` 添加表态，`false` 取消表态。 |
| `emoji_type` | `number \| string` | 否 | 自动推断 | 省略时自动推断：可解析为整数且 ≤9999 → `1`（QQ 小表情），否则 → `2`（unicode 表情）。 |

::: code-group

```json [JSON]
{
  "message_id": "<message_id>",
  "emoji_id": "76",
  "set": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_msg_emoji_like' \
  -H 'Content-Type: application/json' \
  -d '{"message_id":"<message_id>","emoji_id":"76","set":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_msg_emoji_like', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message_id: '<message_id>',
    emoji_id: '76',
    set: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_msg_emoji_like",
    json={
        "message_id": "<message_id>",
        "emoji_id": "76",
        "set": True,
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["status"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | `message_id` 非群消息或非法。 |
| `1500` | 表态失败。 |

### 注意事项

- 仅群消息可用，私聊消息返回 `1400`。

## 快速操作

- API: `handle_quick_operation`
- 描述: 对收到的事件执行快速操作。同时接受别名 `.handle_quick_operation`。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `context` | `object` | 是 | - | 原始事件对象，含 `post_type`、`message_type` 等字段。 |
| `operation` | `object` | 是 | - | 操作指令。 |

::: code-group

```json [JSON]
{
  "context": {
    "post_type": "message",
    "message_type": "group",
    "group_id": "<group_id>",
    "user_id": "<friend_id>",
    "message_id": "<message_id>"
  },
  "operation": {
    "reply": "收到"
  }
}
```
:::

### 响应参数

成功时 `data` 为 `null`。当操作再分派到具体动作（如 `send_msg`）时，返回该动作的 `data`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/.handle_quick_operation' \
  -H 'Content-Type: application/json' \
  -d '{"context":{"post_type":"message","message_type":"group","group_id":"<group_id>","user_id":"<friend_id>","message_id":"<message_id>"},"operation":{"reply":"收到"}}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/.handle_quick_operation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    context: {
      post_type: 'message',
      message_type: 'group',
      group_id: '<group_id>',
      user_id: '<friend_id>',
      message_id: '<message_id>'
    },
    operation: { reply: '收到' }
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/.handle_quick_operation",
    json={
        "context": {
            "post_type": "message",
            "message_type": "group",
            "group_id": "<group_id>",
            "user_id": "<friend_id>",
            "message_id": "<message_id>",
        },
        "operation": {"reply": "收到"},
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["status"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 不支持的 `post_type` 或 `request_type`，或缺少必要字段。 |
| `1500` | 再分派的动作执行失败。 |

### 注意事项

- `context.post_type` 为 `message` 或 `message_sent` 时：`reply` 向同一会话回复消息；`delete` 撤回原消息；群内可使用 `kick` 踢人、`ban` 禁言（可选 `ban_duration`，默认 1800 秒）。
- `context.post_type` 为 `request` 时：`approve` 同意或拒绝请求；好友请求可带 `remark`，群请求可带 `reason`。
- 无可识别指令时返回成功但不执行任何操作。
