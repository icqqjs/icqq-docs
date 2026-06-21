# 元信息 API

本页介绍运行状态查询、版本信息获取、生命周期管理（重启、缓存清理、事件过滤器重载）、文件下载和中文分词等接口。

## 快速索引

| API | 描述 |
| --- | --- |
| `get_status` | 获取运行状态 |
| `get_version_info` | 获取版本信息 |
| `set_restart` | 重启（空操作） |
| `clean_cache` | 清理缓存（空操作） |
| `reload_event_filter` | 重载事件过滤器（空操作） |
| `get_word_slices` | 中文分词（不支持） |
| `download_file` | 下载文件到本地缓存 |

## 获取运行状态

- API: `get_status`
- 描述: 获取当前运行状态与统计信息。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `app_initialized` | `boolean` | 应用是否已初始化。 | - |
| `app_enabled` | `boolean` | 应用是否已启用。 | - |
| `app_good` | `boolean` | 应用是否正常。 | 反映真实在线状态：仅当存在活跃的已注册会话时为 `true`；被踢下线或 socket 断开后为 `false`。 |
| `online` | `boolean` | 是否在线。 | 反映真实在线状态：仅当存在活跃的已注册会话时为 `true`；被踢下线或 socket 断开后为 `false`，重连/重登成功后恢复 `true`。 |
| `good` | `boolean` | 整体状态是否正常。 | 反映真实在线状态：仅当存在活跃的已注册会话时为 `true`；被踢下线或 socket 断开后为 `false`。 |
| `stat` | `object` | 统计信息对象。 | 见下方字段说明。 |
| `stat.PacketReceived` | `number` | 收到的包数量。 | - |
| `stat.PacketSent` | `number` | 发送的包数量。 | - |
| `stat.PacketLost` | `number` | 丢失的包数量。 | - |
| `stat.MessageReceived` | `number` | 收到的消息数量。 | - |
| `stat.MessageSent` | `number` | 发送的消息数量。 | - |
| `stat.DisconnectTimes` | `number` | 断线次数。 | 映射重连计数。 |
| `stat.LostTimes` | `number` | 丢包次数。 | 映射丢包计数。 |
| `stat.LastMessageTime` | `number` | 最后消息时间戳。 | 恒为 `0`。 |

::: code-group

```json [JSON]
{
  "app_initialized": true,
  "app_enabled": true,
  "app_good": true,
  "online": true,
  "good": true,
  "stat": {
    "PacketReceived": 0,
    "PacketSent": 0,
    "PacketLost": 0,
    "MessageReceived": 0,
    "MessageSent": 0,
    "DisconnectTimes": 0,
    "LostTimes": 0,
    "LastMessageTime": 0
  }
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_status' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.online)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功（恒成功）。 |

## 获取版本信息

- API: `get_version_info`
- 描述: 获取应用版本与运行环境信息。

### 请求参数

无。

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `app_name` | `string` | 应用名称。 | 固定为 `"go-cqhttp"`。 |
| `app_version` | `string` | 应用版本。 | 固定为 `"v1.2.0"`。 |
| `app_full_name` | `string` | 完整应用名称。 | 包含真实版本号。 |
| `protocol_version` | `string` | 协议版本。 | 固定为 `"v11"`。 |
| `coolq_edition` | `string` | CoolQ 版本标识。 | 固定为 `"pro"`。 |
| `coolq_directory` | `string` | CoolQ 目录。 | 固定为空字符串。 |
| `go-cqhttp` | `boolean` | go-cqhttp 兼容标志。 | 固定为 `true`。 |
| `plugin_version` | `string` | 插件版本。 | - |
| `plugin_build_number` | `number` | 构建编号。 | - |
| `plugin_build_configuration` | `string` | 构建配置。 | - |
| `runtime_version` | `string` | 运行时版本。 | - |
| `runtime_os` | `string` | 运行时操作系统。 | 当前系统名称。 |
| `version` | `string` | 版本号。 | - |
| `protocol_name` | `number` | 协议平台编号。 | `1` 对应 Android 手机。 |

::: code-group

```json [JSON]
{
  "app_name": "go-cqhttp",
  "app_version": "v1.2.0",
  "app_full_name": "icqq-rust-onebot <version>",
  "protocol_version": "v11",
  "coolq_edition": "pro",
  "coolq_directory": "",
  "go-cqhttp": true,
  "plugin_version": "4.15.0",
  "plugin_build_number": 99,
  "plugin_build_configuration": "release",
  "runtime_version": "rustc",
  "runtime_os": "windows",
  "version": "<version>",
  "protocol_name": 1
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_version_info' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_version_info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.data.version)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功（恒成功）。 |

## 重启

- API: `set_restart`
- 描述: 请求重启。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `delay` | `number` | 否 | - | 延迟毫秒数。 |

::: code-group

```json [JSON]
{
  "delay": 0
}
```
:::

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/set_restart' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/set_restart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.status)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

### 注意事项

- 本接口为空操作，调用后返回成功但不执行任何动作。

## 清理缓存

- API: `clean_cache`
- 描述: 清理缓存。

### 请求参数

无。

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/clean_cache' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/clean_cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.status)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

### 注意事项

- 本接口为空操作，调用后返回成功但不执行任何动作。

## 重载事件过滤器

- API: `reload_event_filter`
- 描述: 重载事件过滤器配置。

### 请求参数

无。

### 响应参数

成功时 `data` 为 `null`。

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/reload_event_filter' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/reload_event_filter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})

const body = await res.json()
console.log(body.status)
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `0` | 成功。 |

### 注意事项

- 本接口为空操作，调用后返回成功但不执行任何动作。

## 中文分词

- API: `get_word_slices`（别名 `.get_word_slices`）
- 描述: 对文本进行中文分词。本接口不支持，调用后返回 `1404`。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `string` | 是 | - | 待分词文本。 |

::: code-group

```json [JSON]
{
  "content": "<text>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `not_supported` | `boolean` | 是否不支持。 | 恒为 `true`。 |
| `message` | `string` | 说明信息。 | - |

::: code-group

```json [JSON]
{
  "not_supported": true,
  "message": ".get_word_slices: no icqq backing (Tencent NLP word-slice API not implemented in this fork)"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/.get_word_slices' \
  -H 'Content-Type: application/json' \
  -d '{"content":"<text>"}'
```

```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/.get_word_slices', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: '<text>'
  })
})

const body = await res.json()
console.log(body.retcode) // 1404
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1404` | 不支持，返回 `not_supported: true`。 |

## 下载文件

- API: `download_file`
- 描述: 通过 HTTP 下载文件到本地缓存并返回路径。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `url` | `string` | 是 | - | 下载地址，必须为 `http://` 或 `https://`。 |
| `thread_count` | `number` | 否 | - | 线程数（接受但不使用，始终单流下载）。 |
| `headers` | `string \| string[]` | 否 | - | 请求头。字符串格式 `"K: V\r\nK2: V2"`，或数组格式 `["K: V", ...]`。 |

::: code-group

```json [JSON]
{
  "url": "<url>",
  "headers": ["User-Agent: bot"]
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file` | `string` | 下载后的本地缓存文件路径。 | - |

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
curl -X POST 'http://127.0.0.1:5700/download_file' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/a.png","headers":["User-Agent: bot"]}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/download_file', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com/a.png',
    headers: ['User-Agent: bot']
  })
})

const body = await res.json()
console.log(body.data.file)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/download_file",
    json={
        "url": "https://example.com/a.png",
        "headers": ["User-Agent: bot"],
    },
    timeout=30,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["file"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | `url` 非 `http(s)://`、请求失败、非 2xx 状态码，或写入失败。 |

### 注意事项

- `url` 字段必须以 `http://` 或 `https://` 开头。
- 失败统一使用 `1400`（非 `1500`）。
