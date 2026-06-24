# 群文件 API

本页覆盖群文件系统（GFS）相关接口，包括文件/目录的查询、创建、删除、下载地址获取，以及群文件和私聊文件的上传。

## 快速索引

| API | 描述 |
| --- | --- |
| `get_group_file_system_info` | 获取群文件系统信息 |
| `get_group_root_files` | 获取群根目录文件列表 |
| `get_group_files_by_folder` | 获取群子目录文件列表 |
| `get_group_file_url` | 获取群文件下载地址 |
| `delete_group_file` | 删除群文件 |
| `create_group_file_folder` | 创建群文件目录 |
| `delete_group_folder` | 删除群文件目录 |
| `upload_group_file` | 上传群文件 |
| `upload_private_file` | 上传私聊文件 |

## 获取群文件系统信息

- API: `get_group_file_system_info`
- 描述: 获取群文件系统的容量与文件计数信息。

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
| `file_count` | `number` | 当前文件数量。 | - |
| `limit_count` | `number` | 文件数量上限。 | - |
| `used_space` | `number` | 已用空间（字节）。 | - |
| `total_space` | `number` | 总空间（字节）。 | - |

::: code-group

```json [JSON]
{
  "file_count": 0,
  "limit_count": 0,
  "used_space": 0,
  "total_space": 0
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_file_system_info' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_file_system_info', {
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
    "http://127.0.0.1:5700/get_group_file_system_info",
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
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 查询失败。 |

## 获取群根目录文件列表

- API: `get_group_root_files`
- 描述: 获取群文件根目录下的文件和文件夹列表。

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
| `files` | `object[]` | 文件列表。 | 见下方文件对象字段表。 |
| `folders` | `object[]` | 文件夹列表。 | 见下方文件夹对象字段表。 |

**文件对象字段：**

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `group_id` | `number` | 群号。 | GFS 条目中恒为 `0`。 |
| `file_id` | `string` | 文件 ID。 | - |
| `file_name` | `string` | 文件名。 | - |
| `busid` | `number` | 文件业务 ID。 | - |
| `file_size` | `number` | 文件大小（字节）。 | - |
| `upload_time` | `number` | 上传时间戳（秒）。 | - |
| `dead_time` | `number` | 过期时间戳（秒）。 | - |
| `modify_time` | `number` | 修改时间戳（秒）。 | - |
| `download_times` | `number` | 下载次数。 | - |
| `uploader` | `number` | 上传者 QQ 号。 | - |
| `uploader_name` | `string` | 上传者昵称。 | 可能为空字符串。 |
| `sha1` | `string` | 文件 SHA1。 | - |
| `md5` | `string` | 文件 MD5。 | - |

**文件夹对象字段：**

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `group_id` | `number` | 群号。 | GFS 条目中恒为 `0`。 |
| `folder_id` | `string` | 文件夹 ID。 | - |
| `folder_name` | `string` | 文件夹名称。 | - |
| `create_time` | `number` | 创建时间戳（秒）。 | - |
| `creator` | `number` | 创建者 QQ 号。 | - |
| `creator_name` | `string` | 创建者昵称。 | 可能为空字符串。 |
| `total_file_count` | `number` | 文件夹内文件数量。 | - |

::: code-group

```json [JSON]
{
  "files": [
    {
      "group_id": 0,
      "file_id": "<file_id>",
      "file_name": "example.zip",
      "busid": 0,
      "file_size": 0,
      "upload_time": 0,
      "dead_time": 0,
      "modify_time": 0,
      "download_times": 0,
      "uploader": 0,
      "uploader_name": "",
      "sha1": "",
      "md5": ""
    }
  ],
  "folders": [
    {
      "group_id": 0,
      "folder_id": "<folder_id>",
      "folder_name": "",
      "create_time": 0,
      "creator": 0,
      "creator_name": "",
      "total_file_count": 0
    }
  ]
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_root_files' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_root_files', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>'
  })
})

const body = await res.json()
console.log(body.data.files)
console.log(body.data.folders)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_group_root_files",
    json={"group_id": "<group_id>"},
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["files"])
print(body["data"]["folders"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id`。 |
| `1500` | 查询失败。 |

### 注意事项

- 文件项中的 `group_id` 字段在 GFS 列表里恒为 `0`。

## 获取群子目录文件列表

- API: `get_group_files_by_folder`
- 描述: 获取群文件指定目录下的文件和文件夹列表。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `folder_id` | `string` | 是 | - | 目录 ID。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "folder_id": "<folder_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `files` | `object[]` | 文件列表。 | 结构同 `get_group_root_files` 的文件对象。 |
| `folders` | `object[]` | 文件夹列表。 | 结构同 `get_group_root_files` 的文件夹对象。 |

::: code-group

```json [JSON]
{
  "files": [
    {
      "group_id": 0,
      "file_id": "<file_id>",
      "file_name": "example.zip",
      "busid": 0,
      "file_size": 0,
      "upload_time": 0,
      "dead_time": 0,
      "modify_time": 0,
      "download_times": 0,
      "uploader": 0,
      "uploader_name": "",
      "sha1": "",
      "md5": ""
    }
  ],
  "folders": []
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_files_by_folder' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","folder_id":"<folder_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_files_by_folder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    folder_id: '<folder_id>'
  })
})

const body = await res.json()
console.log(body.data.files)
console.log(body.data.folders)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_group_files_by_folder",
    json={
        "group_id": "<group_id>",
        "folder_id": "<folder_id>",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["files"])
print(body["data"]["folders"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id` 或 `folder_id`。 |
| `1500` | 查询失败。 |

### 注意事项

- 文件项中的 `group_id` 字段在 GFS 列表里恒为 `0`。

## 获取群文件下载地址

- API: `get_group_file_url`
- 描述: 获取群文件的下载 URL。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `file_id` | `string` | 是 | - | 文件 ID。 |
| `busid` | `number \| string` | 否 | - | 文件业务 ID；缺省时自动推导。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "file_id": "<file_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `url` | `string` | 文件下载 URL。 | - |

::: code-group

```json [JSON]
{
  "url": "https://example.com/download?file=<file_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/get_group_file_url' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","file_id":"<file_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/get_group_file_url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    file_id: '<file_id>'
  })
})

const body = await res.json()
console.log(body.data.url)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/get_group_file_url",
    json={
        "group_id": "<group_id>",
        "file_id": "<file_id>",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["url"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id` 或 `file_id`。 |
| `1500` | 获取下载地址失败。 |

## 删除群文件

- API: `delete_group_file`
- 描述: 删除群文件系统中的一个文件。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `file_id` | `string` | 是 | - | 文件 ID。 |
| `busid` | `number \| string` | 否 | - | 文件业务 ID；缺省时自动推导。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "file_id": "<file_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file_id` | `string` | 上传后文件的 ID。 | 可用于后续撤回文件 / 转发引用。 |

::: code-group

```json [JSON]
{
  "file_id": "<file_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/delete_group_file' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","file_id":"<file_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_group_file', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    file_id: '<file_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/delete_group_file",
    json={
        "group_id": "<group_id>",
        "file_id": "<file_id>",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `file_id`。 |
| `1500` | 删除失败。 |

## 创建群文件目录

- API: `create_group_file_folder`
- 描述: 在群文件根目录下创建一个新文件夹。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `name` | `string` | 是 | - | 文件夹名称。 |
| `parent_id` | `string` | 否 | - | 父目录 ID；接受但不生效，始终在根目录下创建。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "name": "new-folder"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `group_id` | `number` | 群号。 | - |
| `folder_id` | `string` | 新文件夹 ID。 | - |
| `folder_name` | `string` | 文件夹名称。 | - |
| `create_time` | `number` | 创建时间戳（秒）。 | - |
| `creator` | `number` | 创建者 QQ 号。 | - |
| `total_file_count` | `number` | 文件夹内文件数量。 | 新建时为 `0`。 |

::: code-group

```json [JSON]
{
  "group_id": 0,
  "folder_id": "<folder_id>",
  "folder_name": "new-folder",
  "create_time": 0,
  "creator": 0,
  "total_file_count": 0
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/create_group_file_folder' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","name":"new-folder"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/create_group_file_folder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    name: 'new-folder'
  })
})

const body = await res.json()
console.log(body.data.folder_id)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/create_group_file_folder",
    json={
        "group_id": "<group_id>",
        "name": "new-folder",
    },
    timeout=10,
)
resp.raise_for_status()
body = resp.json()
print(body["data"]["folder_id"])
```

:::

### 错误码

| retcode | 说明 |
| --- | --- |
| `1400` | 参数错误，例如缺少 `group_id` 或 `name`。 |
| `1500` | 创建失败。 |

### 注意事项

- `parent_id` 参数接受但不生效，文件夹始终创建在根目录下。

## 删除群文件目录

- API: `delete_group_folder`
- 描述: 删除群文件系统中的一个文件夹。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `folder_id` | `string` | 是 | - | 文件夹 ID。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "folder_id": "<folder_id>"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file_id` | `string` | 上传后文件的 ID。 | 可用于后续撤回文件 / 转发引用。 |

::: code-group

```json [JSON]
{
  "file_id": "<file_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/delete_group_folder' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","folder_id":"<folder_id>"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/delete_group_folder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    folder_id: '<folder_id>'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/delete_group_folder",
    json={
        "group_id": "<group_id>",
        "folder_id": "<folder_id>",
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
| `1400` | 参数错误，例如缺少 `group_id` 或 `folder_id`。 |
| `1500` | 删除失败。 |

## 上传群文件

- API: `upload_group_file`
- 描述: 上传一个文件到群文件系统。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | `number \| string` | 是 | - | 群号。 |
| `file` | `string` | 是 | - | 文件路径。支持本地路径、`file://` 和 `http(s)://`。 |
| `name` | `string` | 否 | - | 在群文件中的展示名称。 |
| `folder` | `string` | 否 | `"/"` | 目标文件夹 ID。 |

::: code-group

```json [JSON]
{
  "group_id": "<group_id>",
  "file": "/path/to/file.zip",
  "name": "file.zip"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file_id` | `string` | 上传后文件的 ID。 | 可用于后续撤回文件 / 转发引用。 |

::: code-group

```json [JSON]
{
  "file_id": "<file_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/upload_group_file' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","file":"/path/to/file.zip","name":"file.zip"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/upload_group_file', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_id: '<group_id>',
    file: '/path/to/file.zip',
    name: 'file.zip'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/upload_group_file",
    json={
        "group_id": "<group_id>",
        "file": "/path/to/file.zip",
        "name": "file.zip",
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
| `1500` | 上传失败。 |

### 注意事项

- `file` 支持本地文件路径、`file://` URI 和 `http(s)://` URL（远程文件会先下载再上传）。
- 本地文件路径按 icqq-rust-onebot 进程所在机器解析。

## 上传私聊文件

- API: `upload_private_file`
- 描述: 向好友发送离线文件。

### 请求参数

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number \| string` | 是 | - | 接收方 QQ 号。 |
| `file` | `string` | 是 | - | 文件路径。支持本地路径、`file://` 和 `http(s)://`。 |
| `name` | `string` | 否 | - | 文件展示名称。 |

::: code-group

```json [JSON]
{
  "user_id": "<friend_id>",
  "file": "/path/to/file.zip",
  "name": "file.zip"
}
```
:::

### 响应参数

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | --- | --- |
| `file_id` | `string` | 上传后文件的 ID。 | 可用于后续撤回文件 / 转发引用。 |

::: code-group

```json [JSON]
{
  "file_id": "<file_id>"
}
```
:::

### 示例

::: code-group

```bash [curl]
curl -X POST 'http://127.0.0.1:5700/upload_private_file' \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"<friend_id>","file":"/path/to/file.zip","name":"file.zip"}'
```
```js [JavaScript]
const res = await fetch('http://127.0.0.1:5700/upload_private_file', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '<friend_id>',
    file: '/path/to/file.zip',
    name: 'file.zip'
  })
})

const body = await res.json()
console.log(body.status)
```
```py [Python]
import requests

resp = requests.post(
    "http://127.0.0.1:5700/upload_private_file",
    json={
        "user_id": "<friend_id>",
        "file": "/path/to/file.zip",
        "name": "file.zip",
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
| `1400` | 参数错误，例如缺少 `user_id` 或 `file`。 |
| `1500` | 上传失败。 |

### 注意事项

- `file` 支持本地文件路径、`file://` URI 和 `http(s)://` URL（远程文件会先下载再上传）。
- 本地文件路径按 icqq-rust-onebot 进程所在机器解析。
