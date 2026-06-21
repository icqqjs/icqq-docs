# 信息查询 API

本页介绍登录信息、好友与群列表、用户与成员信息、群荣誉、凭证（cookies / csrf）、能力探测、在线设备与群系统消息等查询接口。所有 ID 字段同时接受数字与数字字符串。

## 快速索引

| API | 描述 |
| --- | --- |
| `get_login_info` | 获取登录号信息 |
| `get_stranger_info` | 获取陌生人信息 |
| `get_friend_list` | 获取好友列表 |
| `get_group_info` | 获取群信息 |
| `get_group_list` | 获取群列表 |
| `get_group_member_info` | 获取群成员信息 |
| `get_group_member_list` | 获取群成员列表 |
| `get_group_honor_info` | 获取群荣誉信息 |
| `get_cookies` | 获取 Cookies |
| `get_csrf_token` | 获取 CSRF Token |
| `get_credentials` | 获取凭证（cookies + token） |
| `can_send_image` | 检查能否发送图片 |
| `can_send_record` | 检查能否发送语音 |
| `get_online_clients` | 获取在线设备 |
| `get_group_system_msg` | 获取群系统消息 |

## 获取登录号信息

- API: `get_login_info`
- 描述: 获取当前登录账号的 QQ 号与昵称。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `user_id` | `number` | 登录账号 QQ 号。 | - |
| `nickname` | `string` | 登录账号昵称。 | - |

::: code-group

```json [JSON]
{
  "user_id": 0,
  "nickname": ""
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_login_info' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_login_info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.user_id, body.data.nickname)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

## 获取陌生人信息

- API: `get_stranger_info`
- 描述: 获取任意用户的基本资料。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number \| string` | 是 | - | 目标 QQ 号。 |
| `no_cache` | `boolean` | 否 | - | 是否不使用缓存。 |

::: code-group

```json [JSON]
{
  "user_id": "<friend_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `user_id` | `number` | QQ 号。 | - |
| `nickname` | `string` | 昵称。 | - |
| `sex` | `string` | 性别。 | `male` / `female` / `unknown` |
| `age` | `number` | 年龄。 | - |
| `level` | `number` | 等级。 | - |
| `login_days` | `number` | 连续登录天数。 | - |
| `qid` | `string` | QID。 | 可能为空字符串。 |
| `area` | `string` | 地区。 | 可能为空字符串。 |

::: code-group

```json [JSON]
{
  "user_id": 0,
  "nickname": "",
  "sex": "unknown",
  "age": 0,
  "level": 0,
  "login_days": 0,
  "qid": "",
  "area": ""
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_stranger_info' \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"<friend_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_stranger_info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '<friend_id>'
  })
})

const body = await res.json()
console.log(body.data)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_stranger_info",
    json={"user_id": "<friend_id>"},
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
| `0` | 成功。 |
| `1400` | 参数错误。 |

### 注意事项

- `sex` 取值为 `male` / `female` / `unknown`。
- `qid` 和 `area` 可能返回空字符串。

## 获取好友列表

- API: `get_friend_list`
- 描述: 获取当前账号的好友列表。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `user_id` | `number` | 好友 QQ 号。 | - |
| `nickname` | `string` | 昵称。 | - |
| `remark` | `string` | 备注。 | - |

::: code-group

```json [JSON]
[
  {
    "user_id": 0,
    "nickname": "",
    "remark": ""
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_friend_list' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_friend_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。缓存为空时返回空数组。 |

## 获取群信息

- API: `get_group_info`
- 描述: 获取指定群的基本信息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `no_cache` | `boolean` | 否 | - | 是否不使用缓存。 |

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
| `group_id` | `number` | 群号。 | - |
| `group_name` | `string` | 群名称。 | - |
| `member_count` | `number` | 成员数。 | - |
| `max_member_count` | `number` | 最大成员数。 | - |
| `group_create_time` | `number` | 群创建时间戳（秒）。 | - |
| `group_level` | `number` | 群等级。 | - |
| `group_memo` | `string` | 群公告/备忘录。 | 可能为空字符串。 |

::: code-group

```json [JSON]
{
  "group_id": 0,
  "group_name": "",
  "member_count": 0,
  "max_member_count": 0,
  "group_create_time": 0,
  "group_level": 0,
  "group_memo": ""
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_info' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |
| `1400` | 参数错误。 |
| `1404` | 群不存在。 |

## 获取群列表

- API: `get_group_list`
- 描述: 获取当前账号已加入的群列表。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `group_id` | `number` | 群号。 | - |
| `group_name` | `string` | 群名称。 | - |
| `member_count` | `number` | 成员数。 | - |
| `max_member_count` | `number` | 最大成员数。 | - |
| `group_create_time` | `number` | 群创建时间戳（秒）。 | - |
| `group_level` | `number` | 群等级。 | - |
| `group_memo` | `string` | 群公告/备忘录。 | 可能为空字符串。 |

::: code-group

```json [JSON]
[
  {
    "group_id": 0,
    "group_name": "",
    "member_count": 0,
    "max_member_count": 0,
    "group_create_time": 0,
    "group_level": 0,
    "group_memo": ""
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_list' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。缓存为空时返回空数组。 |

## 获取群成员信息

- API: `get_group_member_info`
- 描述: 获取指定群成员的详细信息。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `user_id` | `number \| string` | 是 | - | 成员 QQ 号。 |
| `no_cache` | `boolean` | 否 | - | 是否不使用缓存。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "user_id": "<friend_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `group_id` | `number` | 群号。 | - |
| `user_id` | `number` | 成员 QQ 号。 | - |
| `nickname` | `string` | 昵称。 | - |
| `card` | `string` | 群名片。 | - |
| `sex` | `string` | 性别。 | `male` / `female` / `unknown` |
| `age` | `number` | 年龄。 | - |
| `area` | `string` | 地区。 | - |
| `join_time` | `number` | 入群时间戳（秒）。 | - |
| `last_sent_time` | `number` | 最后发言时间戳（秒）。 | - |
| `level` | `number` | 等级。 | - |
| `role` | `string` | 角色。 | `owner` / `admin` / `member` |
| `unfriendly` | `boolean` | 是否不良记录成员。 | - |
| `title` | `string` | 专属头衔。 | - |
| `title_expire_time` | `number` | 头衔过期时间戳（秒）。 | - |
| `card_changeable` | `boolean` | 是否允许修改群名片。 | - |
| `shut_up_timestamp` | `number` | 禁言到期时间戳（秒）。 | 0 表示未被禁言。 |

::: code-group

```json [JSON]
{
  "group_id": 0,
  "user_id": 0,
  "nickname": "",
  "card": "",
  "sex": "unknown",
  "age": 0,
  "area": "",
  "join_time": 0,
  "last_sent_time": 0,
  "level": 0,
  "role": "member",
  "unfriendly": false,
  "title": "",
  "title_expire_time": 0,
  "card_changeable": false,
  "shut_up_timestamp": 0
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_member_info' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","user_id":"<friend_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_member_info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    user_id: '<friend_id>'
  })
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |
| `1400` | 参数错误。 |
| `1404` | 成员不存在。 |

### 注意事项

- `sex` 取值为 `male` / `female` / `unknown`。
- `role` 取值为 `owner` / `admin` / `member`。
- `shut_up_timestamp` 为 0 表示未被禁言。

## 获取群成员列表

- API: `get_group_member_list`
- 描述: 获取指定群的所有成员列表。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |

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
| `group_id` | `number` | 群号。 | - |
| `user_id` | `number` | 成员 QQ 号。 | - |
| `nickname` | `string` | 昵称。 | - |
| `card` | `string` | 群名片。 | - |
| `role` | `string` | 角色。 | `owner` / `admin` / `member` |

::: code-group

```json [JSON]
[
  {
    "group_id": 0,
    "user_id": 0,
    "nickname": "",
    "card": "",
    "role": "member"
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_member_list' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_member_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.data)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。未加载的群返回空数组。 |
| `1400` | 参数错误。 |

### 注意事项

- 每项字段与 `get_group_member_info` 相同。
- 未加载的群返回空数组而非报错。

## 获取群荣誉信息

- API: `get_group_honor_info`
- 描述: 获取群荣誉信息（龙王、群聊之火等）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `type` | `string` | 是 | - | 荣誉类型。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "type": "all"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `group_id` | `number` | 群号。 | - |
| `current_talkative` | `object` | 当前龙王信息。 | 仅在龙王存在时出现。 |
| `talkative_list` | `object[]` | 历史龙王列表。 | - |
| `performer_list` | `object[]` | 群聊之火列表。 | - |
| `legend_list` | `object[]` | 群聊炽焰列表。 | - |
| `strong_newbie_list` | `object[]` | 冒尖小春笋列表。 | - |
| `emotion_list` | `object[]` | 快乐之源列表。 | - |

::: code-group

```json [JSON]
{
  "group_id": 0,
  "current_talkative": {
    "user_id": 0,
    "nickname": "",
    "avatar": "",
    "day_count": 0
  },
  "talkative_list": [
    {
      "user_id": 0,
      "nickname": "",
      "avatar": "",
      "description": ""
    }
  ],
  "performer_list": [],
  "legend_list": [],
  "strong_newbie_list": [],
  "emotion_list": []
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_honor_info' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","type":"all"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_honor_info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    type: 'all'
  })
})

const body = await res.json()
console.log(body.data)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_group_honor_info",
    json={
        "group_id": "<group_id>",
        "type": "all",
    },
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
| `0` | 成功。仅包含所请求类别对应的字段。 |
| `1400` | 参数错误或未知 `type`。 |
| `1500` | 拉取失败。 |

### 注意事项

- `type` 取值为 `talkative` / `performer` / `legend` / `strong_newbie` / `emotion` / `all`。
- `type=all` 时拉取全部类别。
- `current_talkative` 仅在当前存在龙王时出现。

## 获取 Cookies

- API: `get_cookies`
- 描述: 获取指定域名的 Cookies。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `domain` | `string` | 否 | `""` | 目标域名。缺省时只含基础形态。 |

::: code-group

```json [JSON]
{
  "domain": "qun.qq.com"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `cookies` | `string` | Cookie 字符串。 | - |

::: code-group

```json [JSON]
{
  "cookies": ""
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_cookies' \
  -H 'Content-Type: application/json' \
  -d '{"domain":"qun.qq.com"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_cookies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: 'qun.qq.com'
  })
})

const body = await res.json()
console.log(body.data.cookies)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

## 获取 CSRF Token

- API: `get_csrf_token`
- 描述: 获取 CSRF Token（bkn）。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `token` | `number` | CSRF Token（bkn）。 | - |

::: code-group

```json [JSON]
{
  "token": 0
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_csrf_token' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_csrf_token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.token)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

## 获取凭证

- API: `get_credentials`
- 描述: 一次性获取 Cookies 和 CSRF Token。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `domain` | `string` | 否 | `""` | 目标域名。 |

::: code-group

```json [JSON]
{
  "domain": "qun.qq.com"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `cookies` | `string` | Cookie 字符串。 | - |
| `token` | `number` | CSRF Token（bkn）。 | - |

::: code-group

```json [JSON]
{
  "cookies": "",
  "token": 0
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_credentials' \
  -H 'Content-Type: application/json' \
  -d '{"domain":"qun.qq.com"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: 'qun.qq.com'
  })
})

const body = await res.json()
console.log(body.data.cookies, body.data.token)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

## 检查能否发送图片

- API: `can_send_image`
- 描述: 检查当前实例是否支持发送图片。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `yes` | `boolean` | 是否支持发送图片。 | - |

::: code-group

```json [JSON]
{
  "yes": true
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/can_send_image' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/can_send_image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.yes)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

## 检查能否发送语音

- API: `can_send_record`
- 描述: 检查当前实例是否支持发送语音。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `yes` | `boolean` | 是否支持发送语音。 | - |

::: code-group

```json [JSON]
{
  "yes": true
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/can_send_record' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/can_send_record', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.yes)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

## 获取在线设备

- API: `get_online_clients`
- 描述: 获取当前账号的其他在线设备列表。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `no_cache` | `boolean` | 否 | - | 是否不使用缓存。 |

::: code-group

```json [JSON]
{}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `clients` | `object[]` | 在线设备列表。 | 无其他在线设备时为空数组。 |

::: code-group

```json [JSON]
{
  "clients": [
    {
      "app_id": 0,
      "device_name": "",
      "device_kind": ""
    }
  ]
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_online_clients' \
  -H 'Content-Type: application/json' \
  -d '{}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_online_clients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.clients)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_online_clients",
    json={},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["clients"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。无其他在线设备时 `clients` 为空数组。 |
| `1500` | 拉取失败。 |

## 获取群系统消息

- API: `get_group_system_msg`
- 描述: 获取群系统消息（加群请求、邀请等）。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `invited_requests` | `object[]` | 邀请入群请求列表。 | 无请求时为空数组。 |
| `join_requests` | `object[]` | 加群请求列表。 | 无请求时为空数组。 |

::: code-group

```json [JSON]
{
  "invited_requests": [],
  "join_requests": []
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_system_msg' \
  -H 'Content-Type: application/json' \
  -d '{}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_system_msg', {
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
    "http://127.0.0.1:5700/get_group_system_msg",
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
| `0` | 成功。 |
| `1500` | 拉取失败。 |
