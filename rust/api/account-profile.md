# 账号资料 API

本页覆盖与机器人自身账号、个人资料、好友管理及好友分组相关的接口。所有 ID 字段同时接受 JSON 数字与数字字符串。响应信封统一为 `{ status, retcode, data, echo }`，下文「响应参数」只给出 `data` 部分。

## 快速索引

| API | 描述 |
| --- | --- |
| `send_like` | 点赞（名片赞） |
| `set_qq_profile` | 设置自身资料 |
| `set_qq_avatar` | 设置自身头像 |
| `set_group_portrait` | 设置群头像 |
| `set_self_longnick` | 设置个性签名 |
| `set_online_status` | 设置在线状态 |
| `get_roaming_stamp` | 获取漫游表情 |
| `delete_stamp` | 删除漫游表情 |
| `add_friend_category` | 新增好友分组 |
| `delete_friend_category` | 删除好友分组 |
| `rename_friend_category` | 重命名好友分组 |
| `delete_friend` | 删除好友 |
| `get_unidirectional_friend_list` | 获取单向好友列表 |
| `delete_unidirectional_friend` | 删除单向好友（不支持，返回 1404） |

## 点赞

- API: `send_like`
- 描述: 给指定用户点赞（名片赞）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number \| string` | 是 | - | 目标 QQ 号。 |
| `times` | `number` | 否 | `1` | 点赞次数，最多 20 次。 |

::: code-group

```json [JSON]
{
  "user_id": "<friend_id>",
  "times": 10
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/send_like' \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"<friend_id>","times":10}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/send_like', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '<friend_id>',
    times: 10
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/send_like",
    json={
        "user_id": "<friend_id>",
        "times": 10,
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
| `1400` | 参数格式错误，例如缺少 `user_id`。 |
| `1500` | 服务器拒绝或传输失败。 |

## 设置自身资料

- API: `set_qq_profile`
- 描述: 设置机器人自身的个人资料。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `nickname` | `string` | 否 | - | 昵称。 |
| `personal_note` | `string` | 否 | - | 个人说明。 |
| `company` | `string` | 否 | - | 公司。接受但不生效。 |
| `email` | `string` | 否 | - | 邮箱。接受但不生效。 |
| `college` | `string` | 否 | - | 学校。接受但不生效。 |

::: code-group

```json [JSON]
{
  "nickname": "新昵称",
  "personal_note": "新说明"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_qq_profile' \
  -H 'Content-Type: application/json' \
  -d '{"nickname":"新昵称","personal_note":"新说明"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_qq_profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nickname: '新昵称',
    personal_note: '新说明'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_qq_profile",
    json={
        "nickname": "新昵称",
        "personal_note": "新说明",
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
| `1400` | 参数错误，`nickname` 与 `personal_note` 至少需提供其一。 |
| `1500` | 服务器拒绝或传输失败。 |

### 注意事项

- `company`、`email`、`college` 字段接受但不生效。

## 设置自身头像

- API: `set_qq_avatar`
- 描述: 设置机器人自身的头像。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string` | 是 | - | 图片来源。 |

::: code-group

```json [JSON]
{
  "file": "/path/to/avatar.png"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_qq_avatar' \
  -H 'Content-Type: application/json' \
  -d '{"file":"/path/to/avatar.png"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_qq_avatar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file: '/path/to/avatar.png'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_qq_avatar",
    json={"file": "/path/to/avatar.png"},
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
| `1400` | 参数错误，例如缺少 `file`。 |
| `1500` | 图片解析失败或上传失败。 |

### 注意事项

- `file` 字段接受：本地文件路径、`file://`、`base64://`、`http(s)://`。
- 本地文件路径按 icqq-rust-onebot 进程所在机器解析。

## 设置群头像

- API: `set_group_portrait`
- 描述: 设置指定群的群头像。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `file` | `string` | 是 | - | 图片来源。 |
| `cache` | `number` | 否 | - | 接受但当前不使用。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "file": "/path/to/portrait.png"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_group_portrait' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","file":"/path/to/portrait.png"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_portrait', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    file: '/path/to/portrait.png'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_group_portrait",
    json={
        "group_id": "<group_id>",
        "file": "/path/to/portrait.png",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `file`。 |
| `1500` | 图片解析失败或上传失败。 |

### 注意事项

- `file` 字段接受：本地文件路径、`file://`、`base64://`、`http(s)://`。
- 本地文件路径按 icqq-rust-onebot 进程所在机器解析。

## 设置个性签名

- API: `set_self_longnick`
- 描述: 设置机器人的个性签名。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `long_nick` | `string` | 是 | - | 个性签名内容。也接受字段名 `longNick`。 |

::: code-group

```json [JSON]
{
  "long_nick": "这是我的个性签名"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_self_longnick' \
  -H 'Content-Type: application/json' \
  -d '{"long_nick":"这是我的个性签名"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_self_longnick', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    long_nick: '这是我的个性签名'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_self_longnick",
    json={"long_nick": "这是我的个性签名"},
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
| `1400` | 缺少 `long_nick`（或 `longNick`）。 |
| `1500` | 服务器拒绝或传输失败。 |

## 设置在线状态

- API: `set_online_status`
- 描述: 设置机器人的在线状态。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `status` | `number \| string` | 是 | - | 在线状态码。 |
| `ext_status` | `number` | 否 | - | 扩展状态，接受但不生效。 |
| `battery_status` | `number` | 否 | - | 电量状态，接受但不生效。 |

::: code-group

```json [JSON]
{
  "status": 11
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_online_status' \
  -H 'Content-Type: application/json' \
  -d '{"status":11}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_online_status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 11
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/set_online_status",
    json={"status": 11},
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
| `1400` | 参数错误。 |
| `1500` | 服务器拒绝或传输失败。 |

### 注意事项

- `status` 枚举值：`11`=在线、`31`=离开、`41`=隐身、`50`=忙碌、`60`=Q我、`70`=请勿打扰。
- `ext_status`、`battery_status` 接受但不生效。

## 获取漫游表情

- API: `get_roaming_stamp`
- 描述: 获取漫游表情列表。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| (数组) | `string[]` | 表情 URL 字符串数组。 | `data` 本身即为数组。 |

::: code-group

```json [JSON]
[
  "<stamp_url>",
  "<stamp_url>"
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_roaming_stamp' \
  -H 'Content-Type: application/json' \
  -d '{}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_roaming_stamp', {
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
    "http://127.0.0.1:5700/get_roaming_stamp",
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
| `1500` | 解码失败或传输失败。 |

## 删除漫游表情

- API: `delete_stamp`
- 描述: 删除指定的漫游表情。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `string \| string[]` | 是 | - | 单个表情 ID 或 ID 数组。 |

::: code-group

```json [JSON]
{
  "id": ["123", "456"]
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/delete_stamp' \
  -H 'Content-Type: application/json' \
  -d '{"id":["123","456"]}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_stamp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: ['123', '456']
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/delete_stamp",
    json={"id": ["123", "456"]},
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
| `1400` | 缺少 `id`。 |
| `1500` | 传输失败。 |

## 新增好友分组

- API: `add_friend_category`
- 描述: 新增一个好友分组。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | `string` | 是 | - | 新分组名称。 |

::: code-group

```json [JSON]
{
  "name": "同事"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/add_friend_category' \
  -H 'Content-Type: application/json' \
  -d '{"name":"同事"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/add_friend_category', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '同事'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/add_friend_category",
    json={"name": "同事"},
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
| `1400` | 参数错误，例如缺少 `name`。 |
| `1500` | 传输失败。 |

## 删除好友分组

- API: `delete_friend_category`
- 描述: 删除一个好友分组。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 是 | - | 分组 ID。 |

::: code-group

```json [JSON]
{
  "id": 3
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/delete_friend_category' \
  -H 'Content-Type: application/json' \
  -d '{"id":3}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_friend_category', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 3
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/delete_friend_category",
    json={"id": 3},
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
| `1400` | 参数错误，例如缺少 `id`。 |
| `1500` | 传输失败。 |

## 重命名好友分组

- API: `rename_friend_category`
- 描述: 重命名一个好友分组。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 是 | - | 分组 ID。 |
| `name` | `string` | 是 | - | 新名称。 |

::: code-group

```json [JSON]
{
  "id": 3,
  "name": "老同事"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/rename_friend_category' \
  -H 'Content-Type: application/json' \
  -d '{"id":3,"name":"老同事"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/rename_friend_category', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 3,
    name: '老同事'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/rename_friend_category",
    json={
        "id": 3,
        "name": "老同事",
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
| `1400` | 参数错误，例如缺少 `id` 或 `name`。 |
| `1500` | 传输失败。 |

## 删除好友

- API: `delete_friend`
- 描述: 删除指定好友。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number \| string` | 是 | - | 要删除的好友 QQ 号。 |
| `block` | `boolean` | 否 | `true` | 是否同时拉黑。 |

::: code-group

```json [JSON]
{
  "user_id": "<friend_id>",
  "block": true
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/delete_friend' \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"<friend_id>","block":true}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_friend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '<friend_id>',
    block: true
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/delete_friend",
    json={
        "user_id": "<friend_id>",
        "block": True,
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
| `1400` | 参数错误，例如缺少 `user_id`。 |
| `1500` | 服务器拒绝或传输失败。 |

## 获取单向好友列表

- API: `get_unidirectional_friend_list`
- 描述: 获取单向好友列表。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| (数组) | `object[]` | 单向好友列表。 | `data` 本身即为数组。 |
| `[].user_id` | `number` | 用户 QQ 号。 | - |
| `[].nickname` | `string` | 昵称。 | - |
| `[].source` | `string` | 来源描述。 | - |

::: code-group

```json [JSON]
[
  {
    "user_id": 0,
    "nickname": "某人",
    "source": "来源"
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_unidirectional_friend_list' \
  -H 'Content-Type: application/json' \
  -d '{}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_unidirectional_friend_list', {
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
    "http://127.0.0.1:5700/get_unidirectional_friend_list",
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
| `1500` | 解码失败或传输失败。 |

## 不支持的接口

以下接口调用均返回 `retcode: 1404`，响应 `data` 中包含 `not_supported: true`。

| API | 说明 |
| --- | --- |
| `delete_unidirectional_friend` | 删除单向好友 |
| `set_model_show` / `_set_model_show` | 设置机型展示 |
| `get_model_show` / `_get_model_show` | 获取机型展示 |
| `qidian_get_account_info` | 企点账号信息 |
