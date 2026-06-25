# Web API

本页介绍精华消息、群公告、匿名禁言、链接安全检查和图片 OCR 等需要 Web 端点认证的接口。ID 字段同时接受数字与数字字符串。

## 快速索引

| API | 描述 |
| --- | --- |
| `get_essence_msg_list` | 获取精华消息列表 |
| `get_group_notice` | 获取群公告 |
| `del_group_notice` | 删除群公告 |
| `set_group_anonymous_ban` | 群匿名用户禁言 |
| `check_url_safely` | 检查链接安全性 |
| `ocr_image` | 图片 OCR |

## 获取精华消息列表

- API: `get_essence_msg_list`
- 描述: 获取群精华消息列表。

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
| (数组) | `object[]` | 精华消息列表。 | `data` 直接为数组。 |
| `[].sender_id` | `number` | 发送者 QQ 号。 | - |
| `[].sender_nick` | `string` | 发送者昵称。 | - |
| `[].sender_time` | `number` | 发送时间戳。 | - |
| `[].operator_id` | `number` | 设精操作者 QQ 号。 | - |
| `[].operator_nick` | `string` | 设精操作者昵称。 | - |
| `[].operator_time` | `number` | 设精时间戳。 | - |
| `[].message_id` | `number` | 消息序号。 | - |

::: code-group

```json [JSON]
[
  {
    "sender_id": 0,
    "sender_nick": "",
    "sender_time": 0,
    "operator_id": 0,
    "operator_nick": "",
    "operator_time": 0,
    "message_id": 0
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_essence_msg_list' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_essence_msg_list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.data)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_essence_msg_list",
    json={"group_id": "<group_id>"},
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
| `1400` | 参数错误。 |
| `1500` | 请求失败或认证失败。 |

## 获取群公告

- API: `get_group_notice`（别名 `_get_group_notice`）
- 描述: 获取群公告列表。

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
| (数组) | `object[]` | 群公告列表。 | `data` 直接为数组。 |
| `[].notice_id` | `string` | 公告 ID。 | - |
| `[].sender_id` | `number` | 发布者 QQ 号。 | - |
| `[].publish_time` | `number` | 发布时间戳。 | - |
| `[].message` | `object` | 公告内容。 | - |
| `[].message.text` | `string` | 公告正文。 | - |
| `[].message.images` | `object[]` | 公告图片列表。 | 可为空数组。 |
| `[].message.images[].height` | `string` | 图片高度。 | - |
| `[].message.images[].width` | `string` | 图片宽度。 | - |
| `[].message.images[].id` | `string` | 图片 ID。 | - |

::: code-group

```json [JSON]
[
  {
    "notice_id": "<notice_id>",
    "sender_id": 0,
    "publish_time": 0,
    "message": {
      "text": "",
      "images": [
        { "height": "100", "width": "200", "id": "<image_id>" }
      ]
    }
  }
]
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_notice' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_notice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.data)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_group_notice",
    json={"group_id": "<group_id>"},
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
| `1400` | 参数错误。 |
| `1500` | 请求失败或认证失败。 |

## 删除群公告

- API: `del_group_notice`（别名 `_del_group_notice`）
- 描述: 按公告 ID（`notice_id`）删除一条群公告。底层为对 `web.qun.qq.com/cgi-bin/announce/del_feed` 的认证 POST 请求（携带机器人 cookie 与 `bkn`）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `notice_id` | `string` | 是 | - | 公告 ID（`fid`，即 `get_group_notice` 返回的 `notice_id`），不能为空。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "notice_id": "<notice_id>"
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/del_group_notice' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","notice_id":"<notice_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/del_group_notice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    notice_id: '<notice_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/del_group_notice",
    json={"group_id": "<group_id>", "notice_id": "<notice_id>"},
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `notice_id` 为空。 |
| `1500` | 删除失败、网络错误或认证失败。 |

### 注意事项

- `notice_id` 取自 `get_group_notice` 返回项的 `notice_id`（即公告 `fid`）。
- 该 `del_feed` 端点与请求体移植自 go-cqhttp / MiraiGo，尚未在本分支真机核对。

### 版本变化

| 版本 | 说明 |
| --- | --- |
| v0.6.0 | 新增 `del_group_notice` 接口（别名 `_del_group_notice`）。 |

## 群匿名用户禁言

- API: `set_group_anonymous_ban`
- 描述: 对群匿名用户进行禁言。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `anonymous` | `object` | 否 | - | 来自消息事件的匿名成员对象，从中取 `flag` 字段。 |
| `anonymous_flag` | `string` | 否 | - | 匿名标识串，优先于 `anonymous.flag`。 |
| `duration` | `number` | 否 | `1800` | 禁言时长（秒）。 |

> `anonymous_flag` 与 `anonymous.flag` 至少需提供其一，否则返回 `1400`。

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "anonymous_flag": "<flag>",
  "duration": 1800
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
  -d '{"group_id":"<group_id>","anonymous_flag":"<flag>","duration":1800}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_group_anonymous_ban', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    anonymous_flag: '<flag>',
    duration: 1800
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
        "duration": 1800,
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
| `1500` | 请求失败或服务端返回错误。 |

### 注意事项

- 本接口同时出现在 [群管理 API](/rust/api/group-admin) 中。

## 检查链接安全性

- API: `check_url_safely`
- 描述: 检查指定链接的安全等级。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `url` | `string` | 是 | - | 待检查的链接。 |

::: code-group

```json [JSON]
{
  "url": "<url>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `level` | `number` | 安全等级。 | `1` = 安全，`2` = 未知，`3` = 危险。 |

::: code-group

```json [JSON]
{
  "level": 1
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/check_url_safely' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/check_url_safely', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com'
  })
})

const body = await res.json()
console.log(body.data.level)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/check_url_safely",
    json={"url": "https://example.com"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["level"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误。 |
| `1500` | 解码失败或请求失败。 |

## 图片 OCR

- API: `ocr_image`（别名 `ocr`）
- 描述: 对图片进行文字识别（OCR）。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `image` | `string` | 否* | - | 图片源。 |
| `file` | `string` | 否* | - | 图片源（别名）。 |

> *`image` 与 `file` 至少需提供其一非空，否则返回 `1400`。

::: code-group

```json [JSON]
{
  "image": "<file_path>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `texts` | `object[]` | 识别结果列表。 | - |
| `texts[].text` | `string` | 识别到的文字。 | - |
| `texts[].confidence` | `number` | 置信度。 | - |
| `texts[].coordinates` | `object[]` | 坐标点列表。 | - |
| `texts[].coordinates[].x` | `number` | X 坐标。 | - |
| `texts[].coordinates[].y` | `number` | Y 坐标。 | - |
| `language` | `string` | 识别语言。 | - |

::: code-group

```json [JSON]
{
  "texts": [
    {
      "text": "",
      "confidence": 95,
      "coordinates": [{ "x": 0, "y": 0 }]
    }
  ],
  "language": "zh"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/ocr_image' \
  -H 'Content-Type: application/json' \
  -d '{"image":"<file_path>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/ocr_image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: '<file_path>'
  })
})

const body = await res.json()
console.log(body.data.texts)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/ocr_image",
    json={"image": "<file_path>"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["texts"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 缺少 `image` 或 `file`。 |
| `1500` | 图片上传失败或识别失败。 |

### 注意事项

- `image` / `file` 字段接受本地路径、`file://`、`base64://`、`http(s)://`。
- 已收图的裸 md5 token（无实际字节）无法用于 OCR，会返回错误。
