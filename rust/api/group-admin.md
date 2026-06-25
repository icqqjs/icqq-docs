# 群管理 API

本页列出群与好友管理类动作：踢人、禁言、设置管理员、群名片、群名、头衔、退群、精华消息、@全体剩余次数、群打卡、群公告、群消息免打扰、加好友请求处理、加群请求处理等。

## 快速索引

| API | 描述 |
| --- | --- |
| `set_group_kick` | 群踢人 |
| `set_group_kick_members` | 批量群踢人 |
| `set_group_ban` | 群禁言 |
| `set_group_whole_ban` | 群全员禁言 |
| `set_group_anonymous_ban` | 匿名用户禁言 |
| `set_group_admin` | 设置 / 取消群管理员 |
| `set_group_anonymous` | 群匿名开关 |
| `set_group_card` | 设置群名片 |
| `set_group_name` | 设置群名 |
| `set_group_leave` | 退群 / 解散群 |
| `set_group_special_title` | 设置群专属头衔 |
| `set_essence_msg` | 设置精华消息 |
| `delete_essence_msg` | 移除精华消息 |
| `get_group_at_all_remain` | 获取群 @全体 剩余次数 |
| `send_group_sign` | 群打卡 |
| `send_group_notice` | 发送群公告 |
| `set_group_msg_mask` | 群消息免打扰开关 |
| `set_group_remark` | 设置群备注 |
| `get_group_shut_list` | 获取群禁言列表 |
| `set_friend_add_request` | 处理加好友请求 |
| `set_group_add_request` | 处理加群请求 / 邀请 |

## 群踢人

- API: `set_group_kick`
- 描述: 将指定成员移出群聊。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `user_id` | `number \| string` | 是 | - | 被踢成员 QQ 号 |
| `reject_add_request` | `boolean` | 否 | `false` | 是否拒绝其后续加群请求 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_id": "<friend_id>"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_kick' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_id":"<friend_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_kick', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_id: '<friend_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_kick",
    json={
        "group_id": "<group_id>",
        "user_id": "<friend_id>",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `user_id`。 |
| `1500` | 踢人失败，例如权限不足或服务器拒绝。 |

## 批量群踢人

- API: `set_group_kick_members`
- 描述: 一次性将多个成员移出群聊。内部复用单人踢人（`set_group_kick`）的协议链路，对 `user_ids` 中的每个成员逐个发送踢人请求。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `user_ids` | `(number \| string)[]` | 是 | - | 被踢成员 QQ 号数组，不能为空 |
| `reject_add_request` | `boolean` | 否 | `false` | 是否拒绝这些成员其后续加群请求 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_ids": ["<friend_id>", "<friend_id>"]
}
```
:::

### 响应参数

全部成员均踢出成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_kick_members' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_ids":["<friend_id>","<friend_id>"]}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_kick_members', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_ids: ['<friend_id>', '<friend_id>']
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_kick_members",
    json={
        "group_id": "<group_id>",
        "user_ids": ["<friend_id>", "<friend_id>"],
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
| `1400` | 参数错误，例如缺少 `group_id`、`user_ids` 为空。 |
| `1500` | 至少一个成员踢出失败（如权限不足或服务器拒绝），错误信息中会列出失败的成员 QQ 号。 |

### 注意事项

- 每个成员都会被尝试踢出；只要有任意一个失败，整个动作返回 `1500`，并在错误信息中汇总失败的成员列表 —— 不会在部分失败时谎报成功。
- `reject_add_request` 对本次所有被踢成员统一生效。

### 版本变化

| 版本 | 说明 |
| --- | --- |
| v0.6.0 | 新增 `set_group_kick_members` 接口。 |

## 群禁言

- API: `set_group_ban`
- 描述: 禁言或解除禁言指定群成员。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `user_id` | `number \| string` | 是 | - | 成员 QQ 号 |
| `duration` | `number \| string` | 否 | `1800` | 禁言秒数；`0` 解除禁言 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "duration": 600
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_ban' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_id":"<friend_id>","duration":600}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_ban', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_id: '<friend_id>',
    duration: 600
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_ban",
    json={
        "group_id": "<group_id>",
        "user_id": "<friend_id>",
        "duration": 600,
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `user_id`。 |
| `1500` | 禁言失败，例如权限不足或服务器拒绝。 |

### 注意事项

- `duration` 为 `0` 时解除禁言。

## 群全员禁言

- API: `set_group_whole_ban`
- 描述: 开启或关闭群全员禁言。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `enable` | `boolean` | 否 | `true` | 是否开启全员禁言 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "enable": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_whole_ban' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","enable":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_whole_ban', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    enable: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_whole_ban",
    json={
        "group_id": "<group_id>",
        "enable": True,
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
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 操作失败，例如权限不足。 |

## 匿名用户禁言

- API: `set_group_anonymous_ban`
- 描述: 禁言群内匿名用户。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `anonymous` | `object` | 否 | - | 消息事件中的匿名成员对象（取其 `flag`） |
| `anonymous_flag` | `string` | 否 | - | 匿名 flag 字符串（优先于 `anonymous.flag`） |
| `duration` | `number \| string` | 否 | `1800` | 禁言秒数 |

> `anonymous_flag` 与 `anonymous.flag` 至少提供一个。

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "anonymous_flag": "<flag>",
  "duration": 600
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_anonymous_ban' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","anonymous_flag":"<flag>","duration":600}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_anonymous_ban', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    anonymous_flag: '<flag>',
    duration: 600
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_anonymous_ban",
    json={
        "group_id": "<group_id>",
        "anonymous_flag": "<flag>",
        "duration": 600,
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
| `1400` | 缺少 `anonymous_flag` 或 `anonymous.flag`。 |
| `1500` | 禁言失败。 |

## 设置 / 取消群管理员

- API: `set_group_admin`
- 描述: 设置或取消指定成员的群管理员身份。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `user_id` | `number \| string` | 是 | - | 成员 QQ 号 |
| `enable` | `boolean` | 否 | `true` | `true` 设为管理员，`false` 取消管理员 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "enable": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_admin' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_id":"<friend_id>","enable":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_id: '<friend_id>',
    enable: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_admin",
    json={
        "group_id": "<group_id>",
        "user_id": "<friend_id>",
        "enable": True,
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `user_id`。 |
| `1500` | 操作失败，例如非群主无权设置管理员。 |

## 群匿名开关

- API: `set_group_anonymous`
- 描述: 开启或关闭群匿名聊天。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `enable` | `boolean` | 否 | `true` | 是否允许群内匿名 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "enable": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_anonymous' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","enable":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_anonymous', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    enable: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_anonymous",
    json={
        "group_id": "<group_id>",
        "enable": True,
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
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 操作失败。 |

## 设置群名片

- API: `set_group_card`
- 描述: 设置指定成员的群名片（群备注）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `user_id` | `number \| string` | 是 | - | 成员 QQ 号 |
| `card` | `string` | 否 | `""` | 新名片 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "card": "新名片"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_card' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_id":"<friend_id>","card":"新名片"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_card', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_id: '<friend_id>',
    card: '新名片'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_card",
    json={
        "group_id": "<group_id>",
        "user_id": "<friend_id>",
        "card": "新名片",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `user_id`。 |
| `1500` | 操作失败。 |

### 注意事项

- `card` 留空或省略时清除名片。

## 设置群名

- API: `set_group_name`
- 描述: 修改群名称。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `group_name` | `string` | 是 | - | 新群名 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "group_name": "新群名"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_name' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","group_name":"新群名"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_name', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    group_name: '新群名'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_name",
    json={
        "group_id": "<group_id>",
        "group_name": "新群名",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `group_name`。 |
| `1500` | 操作失败。 |

## 退群 / 解散群

- API: `set_group_leave`
- 描述: 退出群聊或解散群聊（需群主权限）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `is_dismiss` | `boolean` | 否 | `false` | `true` 解散群（需群主），`false` 退群 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_leave' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_leave', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_leave",
    json={"group_id": "<group_id>"},
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
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 操作失败。 |

## 设置群专属头衔

- API: `set_group_special_title`
- 描述: 设置指定成员的群专属头衔（需群主权限）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `user_id` | `number \| string` | 是 | - | 成员 QQ 号 |
| `special_title` | `string` | 否 | `""` | 头衔内容 |
| `duration` | `number \| string` | 否 | `-1` | 有效期秒数，`-1` 为永久 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_id": "<friend_id>",
  "special_title": "头衔"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_special_title' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_id":"<friend_id>","special_title":"头衔"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_special_title', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_id: '<friend_id>',
    special_title: '头衔'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_special_title",
    json={
        "group_id": "<group_id>",
        "user_id": "<friend_id>",
        "special_title": "头衔",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `user_id`。 |
| `1500` | 操作失败。 |

### 注意事项

- `special_title` 留空或省略时清除头衔。

## 设置精华消息

- API: `set_essence_msg`
- 描述: 将一条群消息设为精华消息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 群消息 ID |

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
curl -X POST 'http://127.0.0.1:5700/set_essence_msg' \
  -H 'Content-Type: application/json' \
  -d '{"message_id":"<message_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_essence_msg', {
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
    "http://127.0.0.1:5700/set_essence_msg",
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
| `1400` | `message_id` 非群消息或非法。 |
| `1500` | 服务器拒绝。 |

### 注意事项

- 仅群消息可设为精华。

## 移除精华消息

- API: `delete_essence_msg`
- 描述: 移除一条群精华消息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `message_id` | `string` | 是 | - | 群消息 ID |

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
curl -X POST 'http://127.0.0.1:5700/delete_essence_msg' \
  -H 'Content-Type: application/json' \
  -d '{"message_id":"<message_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_essence_msg', {
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
    "http://127.0.0.1:5700/delete_essence_msg",
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
| `1400` | `message_id` 非群消息或非法。 |
| `1500` | 服务器拒绝。 |

## 获取群 @全体 剩余次数

- API: `get_group_at_all_remain`
- 描述: 查询群内 @全体成员 的剩余可用次数。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `can_at_all` | `boolean` | 当前是否可以 @全体 | - |
| `remain_at_all_count_for_group` | `number` | 群内 @全体 剩余次数 | - |
| `remain_at_all_count_for_uin` | `number` | 当前账号 @全体 剩余次数 | - |

::: code-group

```json [JSON]
{
  "can_at_all": true,
  "remain_at_all_count_for_group": 10,
  "remain_at_all_count_for_uin": 5
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_at_all_remain' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_at_all_remain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.data.remain_at_all_count_for_uin)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 查询失败。 |

## 群打卡

- API: `send_group_sign`
- 描述: 在指定群执行打卡（签到）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_group_sign' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_group_sign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_group_sign",
    json={"group_id": "<group_id>"},
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
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 打卡失败，例如服务器拒绝。 |

## 发送群公告

- API: `send_group_notice`
- 描述: 发送群公告。同时接受别名 `_send_group_notice`。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `content` | `string` | 是 | - | 公告内容 |
| `image` | `string` | 否 | - | 图片（当前仅支持文字公告，图片参数保留但不生效） |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "content": "公告内容"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_group_notice' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","content":"公告内容"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_group_notice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    content: '公告内容'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_group_notice",
    json={
        "group_id": "<group_id>",
        "content": "公告内容",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `content`。 |
| `1500` | 发送失败，例如服务器拒绝。 |

### 注意事项

- 当前仅支持纯文字公告，`image` 参数被接收但不生效。

## 处理加好友请求

- API: `set_friend_add_request`
- 描述: 同意或拒绝一条加好友请求。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `flag` | `string` | 是 | - | 请求事件携带的 flag |
| `approve` | `boolean` | 否 | `true` | 是否同意 |
| `remark` | `string` | 否 | `""` | 同意后的好友备注 |

::: code-group

```json [JSON]
{
  "flag": "<flag>",
  "approve": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_friend_add_request' \
  -H 'Content-Type: application/json' \
  -d '{"flag":"<flag>","approve":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_friend_add_request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    flag: '<flag>',
    approve: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_friend_add_request",
    json={
        "flag": "<flag>",
        "approve": True,
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
| `1400` | `flag` 非法。 |
| `1500` | 操作失败，例如服务器拒绝。 |

## 处理加群请求 / 邀请

- API: `set_group_add_request`
- 描述: 同意或拒绝一条加群请求或入群邀请。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `flag` | `string` | 是 | - | 请求事件携带的 flag |
| `sub_type` | `string` | 是 | - | `add`（申请加群）或 `invite`（邀请入群） |
| `approve` | `boolean` | 否 | `true` | 是否同意 |
| `reason` | `string` | 否 | `""` | 拒绝理由 |

::: code-group

```json [JSON]
{
  "flag": "<flag>",
  "sub_type": "add",
  "approve": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_add_request' \
  -H 'Content-Type: application/json' \
  -d '{"flag":"<flag>","sub_type":"add","approve":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_add_request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    flag: '<flag>',
    sub_type: 'add',
    approve: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_add_request",
    json={
        "flag": "<flag>",
        "sub_type": "add",
        "approve": True,
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
| `1400` | `flag` 非法。 |
| `1500` | 操作失败，例如服务器拒绝。 |

## 群消息免打扰 / 提醒方式

- API: `set_group_msg_mask`
- 描述: 设置机器人账号自己在指定群的「消息提醒方式」，等价于手机 QQ 群设置里的四档（接收并提醒 / 群助手 / 屏蔽群消息 / 接收但不提醒）。用 `state` 指定档位。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。推荐传字符串，避免大整数精度问题。 |
| `state` | `number` | 否 | `4` | 提醒档位（QQ `GroupMsgMask` 枚举值）：`1`=接收并提醒（正常）、`2`=群助手（收进群助手且不提醒）、`3`=屏蔽群消息、`4`=免打扰（接收但不提醒）。省略时默认 `4`。 |

> 取值范围 `1..=4`，越界返回 `1500`。其中 `3`（屏蔽）与 `4`（免打扰）已由真机抓包逐字节核对；`1`/`2` 实测可用。

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "state": 3
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
# state=3 屏蔽群消息（其余档位改 state 值即可）
curl -X POST 'http://127.0.0.1:5700/set_group_msg_mask' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","state":3}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_msg_mask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    state: 3 // 1=接收并提醒 2=群助手 3=屏蔽 4=免打扰
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_msg_mask",
    json={
        "group_id": "<group_id>",
        "state": 3,  # 1=接收并提醒 2=群助手 3=屏蔽 4=免打扰
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
| `1400` | `group_id` 非法。 |
| `1500` | 设置失败；或当前非 NT 登录会话（缺少自身 uid）。 |

### 注意事项

- 设置的是**机器人账号自身**在该群的接收设置，对群内其他成员无影响，不需要管理员权限。
- 仅 NT 登录会话可用（请求以自身 uid 为目标）；非 NT 会话返回 `1500`。
- 该动作对应逆向自 NTQQ 的 `OidbSvcTrpcTcp.0xa80_1` 命令，无上游 OneBot 标准等价物。

## 设置群备注

- API: `set_group_remark`
- 描述: 设置机器人账号对该群的**私有备注**（群备注 / 群注释），仅自己可见，对群名无影响、不需要管理员权限。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |
| `remark` | `string` | 否 | `""` | 群备注内容；留空或省略时清除备注 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "remark": "群备注"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_remark' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","remark":"群备注"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_remark', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    remark: '群备注'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_remark",
    json={
        "group_id": "<group_id>",
        "remark": "群备注",
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
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 设置失败，例如服务器拒绝。 |

### 注意事项

- 备注仅机器人账号自己可见，与「设置群名」(`set_group_name`)、「设置群名片」(`set_group_card`) 均不同。
- `remark` 留空或省略时清除备注。

### 版本变化

| 版本 | 说明 |
| --- | --- |
| v0.6.0 | 新增 `set_group_remark` 接口。 |

## 获取群禁言列表

- API: `get_group_shut_list`
- 描述: 获取群内当前**被禁言**的成员列表，以及各自的禁言到期时间。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>"
}
```
:::

### 响应参数

`data` 为数组，每个元素表示一名被禁言成员：

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `user_id` | `number` | 被禁言成员 QQ 号 | - |
| `shut_up_timestamp` | `number` | 禁言到期的 Unix 时间戳（秒） | - |

::: code-group

```json [JSON]
[
  {
    "user_id": "<friend_id>",
    "shut_up_timestamp": 1700000000
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_shut_list' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_shut_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
for (const m of body.data) {
  console.log(m.user_id, m.shut_up_timestamp)
}
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_group_shut_list",
    json={"group_id": "<group_id>"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
for m in body["data"]:
    print(m["user_id"], m["shut_up_timestamp"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 查询失败，例如服务器拒绝或解码失败。 |

### 注意事项

- 群内没有被禁言成员时返回空数组 `[]`。
- `shut_up_timestamp` 为禁言**到期**的 Unix 时间戳（秒）。

### 版本变化

| 版本 | 说明 |
| --- | --- |
| v0.6.0 | 新增 `get_group_shut_list` 接口。 |
