# QQ 频道 API

本页介绍 QQ 频道（guild）相关接口，包括频道资料、频道列表、子频道列表、成员列表与频道消息发送。

`guild_id`、`channel_id`、`tiny_id` 均为字符串（频道 ID 为 64 位无符号整数，无法安全放入 JSON Number）。

## 快速索引

| API | 描述 |
| --- | --- |
| `get_guild_service_profile` | 获取频道系统内 BOT 资料 |
| `get_guild_list` | 获取频道列表 |
| `get_guild_member_list` | 获取频道成员列表 |
| `get_guild_channel_list` | 获取子频道列表 |
| `send_guild_channel_msg` | 发送子频道消息 |

## 获取频道系统内 BOT 资料

- API: `get_guild_service_profile`
- 描述: 获取当前账号在频道系统内的资料。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `nickname` | `string` | BOT 昵称。 | - |
| `tiny_id` | `string` | 频道系统内用户 ID。 | - |
| `avatar_url` | `string` | 头像 URL。 | 暂为空串。 |

::: code-group

```json [JSON]
{
  "nickname": "机器人昵称",
  "tiny_id": "144115199000000000",
  "avatar_url": ""
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_guild_service_profile' \
  -H 'Content-Type: application/json' \
  -d '{}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_guild_service_profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.tiny_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_guild_service_profile",
    json={},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["tiny_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1500` | 加载频道资料失败。 |

### 注意事项

- `avatar_url` 暂为空串。

## 获取频道列表

- API: `get_guild_list`
- 描述: 获取当前账号加入的频道列表。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| (数组) | `object[]` | 频道列表。 | 每项包含以下字段。 |
| `guild_id` | `string` | 频道 ID。 | - |
| `guild_name` | `string` | 频道名称。 | - |
| `guild_display_id` | `string` | 频道展示 ID。 | 暂为空串。 |

::: code-group

```json [JSON]
[
  {
    "guild_id": "<guild_id>",
    "guild_name": "频道名",
    "guild_display_id": ""
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_guild_list' \
  -H 'Content-Type: application/json' \
  -d '{}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_guild_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_guild_list",
    json={},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1500` | 加载频道列表失败。 |

### 注意事项

- 缓存未就绪时可能返回空数组，稍后重试即可。
- `guild_display_id` 暂为空串。

## 获取频道成员列表

- API: `get_guild_member_list`
- 描述: 获取指定频道的成员列表。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道 ID。 |
| `next_token` | `string` | 否 | - | 翻页令牌，目前不生效。 |

::: code-group

```json [JSON]
{
  "guild_id": "<guild_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `members` | `object[]` | 成员列表。 | 每项包含以下字段。 |
| `members[].tiny_id` | `string` | 成员频道 ID。 | - |
| `members[].title` | `string` | 成员头衔。 | - |
| `members[].nickname` | `string` | 成员昵称。 | - |
| `members[].role` | `number` | 角色编号。 | - |
| `members[].role_name` | `string` | 角色名称。 | - |
| `finished` | `boolean` | 是否已拉取完毕。 | 目前恒为 `true`。 |
| `next_token` | `string` | 翻页令牌。 | 目前恒为空串。 |

::: code-group

```json [JSON]
{
  "members": [
    {
      "tiny_id": "144115199000000000",
      "title": "",
      "nickname": "成员",
      "role": 1,
      "role_name": ""
    }
  ],
  "finished": true,
  "next_token": ""
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_guild_member_list' \
  -H 'Content-Type: application/json' \
  -d '{"guild_id":"<guild_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_guild_member_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guild_id: '<guild_id>'
  })
})

const body = await res.json()
console.log(body.data.members)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_guild_member_list",
    json={
        "guild_id": "<guild_id>",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["members"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `guild_id`。 |
| `1500` | 拉取失败。 |

### 注意事项

- `next_token` 目前不生效，恒返回 `finished: true` 与空 `next_token`（暂无分页）。

## 获取子频道列表

- API: `get_guild_channel_list`
- 描述: 获取指定频道的子频道列表。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道 ID。 |
| `no_cache` | `boolean` | 否 | `false` | 接受但忽略（子频道集合仅随服务器推送刷新）。 |

::: code-group

```json [JSON]
{
  "guild_id": "<guild_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| (数组) | `object[]` | 子频道列表。 | 每项包含以下字段。 |
| `owner_guild_id` | `string` | 所属频道 ID。 | - |
| `channel_id` | `string` | 子频道 ID。 | - |
| `channel_type` | `number` | 子频道类型。 | - |
| `channel_name` | `string` | 子频道名称。 | - |
| `create_time` | `number` | 创建时间戳（秒）。 | 占位值，可能为 `0`。 |
| `creator_tiny_id` | `string` | 创建者频道 ID。 | 占位值，可能为空串。 |
| `talk_permission` | `number` | 发言权限。 | - |
| `visible_type` | `number` | 可见性类型。 | - |
| `slow_modes` | `object[]` | 慢速模式列表。 | - |

::: code-group

```json [JSON]
[
  {
    "owner_guild_id": "<guild_id>",
    "channel_id": "<channel_id>",
    "channel_type": 1,
    "channel_name": "子频道名",
    "create_time": 0,
    "creator_tiny_id": "",
    "talk_permission": 1,
    "visible_type": 0,
    "slow_modes": []
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_guild_channel_list' \
  -H 'Content-Type: application/json' \
  -d '{"guild_id":"<guild_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_guild_channel_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guild_id: '<guild_id>'
  })
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `guild_id`。 |

### 注意事项

- 纯缓存读取。未知或尚未推送的频道返回空数组。
- `create_time`、`creator_tiny_id` 等字段为占位值。

## 发送子频道消息

- API: `send_guild_channel_msg`
- 描述: 向指定子频道发送消息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `guild_id` | `string` | 是 | - | 频道 ID。 |
| `channel_id` | `string` | 是 | - | 子频道 ID。 |
| `message` | `string \| MessageSegment[]` | 是 | - | 消息内容。可为纯文本字符串（按字面处理）或消息段数组；不支持 CQ 码。详见 [消息 API](/rust/api/message)。 |

::: code-group

```json [JSON]
{
  "guild_id": "<guild_id>",
  "channel_id": "<channel_id>",
  "message": "你好频道"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `message_id` | `string` | 发送成功后的消息 ID。 | - |

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
curl -X POST 'http://127.0.0.1:5700/send_guild_channel_msg' \
  -H 'Content-Type: application/json' \
  -d '{"guild_id":"<guild_id>","channel_id":"<channel_id>","message":"你好频道"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_guild_channel_msg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guild_id: '<guild_id>',
    channel_id: '<channel_id>',
    message: '你好频道'
  })
})

const body = await res.json()
console.log(body.data.message_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_guild_channel_msg",
    json={
        "guild_id": "<guild_id>",
        "channel_id": "<channel_id>",
        "message": "你好频道",
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
| `1400` | 参数错误，例如缺少 `guild_id`、`channel_id` 或 `message` 为空。 |
| `1500` | 发送失败，例如账号未在线或服务器拒绝。 |

### 注意事项

- 频道消息目前仅支持文本、AT、表情。
- `message_id` 为 seq 字符串，与接收侧频道消息 ID 方案一致。

## 不受支持的频道接口

以下接口在本项目中不受支持，调用返回 `1404`。

| API | 描述 |
| --- | --- |
| `get_guild_meta_by_guest` | 通过游客身份获取频道元数据 |
| `get_guild_member_profile` | 获取频道成员资料 |
| `get_guild_msg` | 获取频道消息 |
| `get_topic_channel_feeds` | 获取话题频道帖子 |
| `get_guild_roles` | 获取频道身份组列表 |
| `create_guild_role` | 创建频道身份组 |
| `delete_guild_role` | 删除频道身份组 |
| `update_guild_role` | 更新频道身份组 |
| `set_guild_member_role` | 设置频道成员身份组 |

### 错误码

| retcode | 说明 |
| --- | --- |
| `1404` | 不受支持。响应包含 `not_supported: true` 标记。 |
