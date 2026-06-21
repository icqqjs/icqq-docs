# 媒体 API

本页介绍图片获取、语音获取以及媒体能力查询等接口。媒体发送作为消息段随 `send_msg` / `send_group_msg` / `send_private_msg` 一同发送，详见 [消息 API](/rust/api/message) 与 [消息段](/rust/guide/segments)。群文件与私聊文件上传见 [群文件系统 API](/rust/api/gfs)；头像设置见 [账号资料 API](/rust/api/account-profile)。

## 快速索引

| API | 描述 |
| --- | --- |
| `get_image` | 获取图片 |
| `get_record` | 获取语音 |
| `can_send_image` | 检查是否可以发送图片（见[信息查询](/rust/api/info#检查能否发送图片)） |
| `can_send_record` | 检查是否可以发送语音（见[信息查询](/rust/api/info#检查能否发送语音)） |

## 获取图片

- API: `get_image`
- 描述: 获取图片文件信息或下载地址。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string` | 是 | - | 本地路径或已收图的 token。 |

::: code-group

```json [JSON]
{
  "file": "<file_path>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file` | `string` | 本地路径或原始 token。 | - |
| `filename` | `string` | 文件名或原始 token。 | 仅远程 token 返回。 |
| `url` | `string` | 图片下载地址。 | 仅远程 token 返回。 |

::: code-group

```json [JSON]
{
  "file": "<file_path>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_image' \
  -H 'Content-Type: application/json' \
  -d '{"file":"<file_path>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file: '<file_path>'
  })
})

const body = await res.json()
console.log(body.data.file)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_image",
    json={"file": "<file_path>"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["file"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误。 |
| `1500` | token 解析失败。 |

### 注意事项

- `file` 接受本地路径（裸路径或 `file://` 前缀）、`base64://`、`http(s)://`。
- 本地路径直接返回该路径；远程 token 解析后返回下载 URL。

## 获取语音

- API: `get_record`
- 描述: 获取语音文件，可指定目标格式。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string` | 是 | - | 本地路径或已收语音 token。 |
| `out_format` | `string` | 是 | - | 目标音频格式，如 `mp3`、`amr`、`silk` 等。 |

::: code-group

```json [JSON]
{
  "file": "<file_path>",
  "out_format": "mp3"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file` | `string` | 本地文件路径。 | - |

::: code-group

```json [JSON]
{
  "file": "<file_path>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_record' \
  -H 'Content-Type: application/json' \
  -d '{"file":"<file_path>","out_format":"mp3"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_record', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file: '<file_path>',
    out_format: 'mp3'
  })
})

const body = await res.json()
console.log(body.data.file)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_record",
    json={
        "file": "<file_path>",
        "out_format": "mp3",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["file"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误。 |
| `1500` | 本地文件需要转码但缺少 `ffmpeg`，或远程 token 无法解析。 |

### 注意事项

- 仅当 `file` 为已存在的本地路径且其扩展名（不区分大小写）已等于 `out_format` 时直接返回。
- 本地文件存在但格式不匹配时需要 `ffmpeg` / `ffprobe` 在 `PATH` 中可用进行转码。
- 已收语音 token 目前无法解析，返回 `1500`。

## 能力查询

`can_send_image` 和 `can_send_record` 的完整文档见[信息查询 API](/rust/api/info)。两者恒返回 `{ "yes": true }`。
