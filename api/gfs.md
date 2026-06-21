# 群文件系统 Gfs

`Gfs` 是「群文件」的封装，用来在一个群里浏览、上传、下载、整理文件。

它从群对象的 `fs` 属性取得，不需要自己 `new`：

::: code-group

```js [JavaScript]
// 假设 client 已登录
const fs = client.pickGroup(<group_id>).fs
const stat = await fs.df()
console.log(stat) // { total, used, free, file_count, max_file_count }
```

```ts [TypeScript]
import { Gfs } from "@icqqjs/icqq"

const fs: Gfs = client.pickGroup(<group_id>).fs
```

:::

几条贯穿全程的约定：

- `fid` 是一个文件或目录的 id；`pid` 是它所在目录的 id。
- 根目录的 id 是 `"/"`，目录 id 都以 `/` 开头，文件 id 不以 `/` 开头。
- 只能在根目录下创建目录；删除一个目录会连同里面的所有文件一起删除。
- 所有 id 都是字符串，不要按数字解析。

---

## 获取使用空间和文件数

- 方法: `fs.df()`
- 签名: `df(): Promise<{ total: number; used: number; free: number; file_count: number; max_file_count: number }>`
- 描述: 查询该群文件的总容量、已用容量与文件数量。

### 参数

无。

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `total` | `number` | 总空间（字节）。 |
| `used` | `number` | 已使用空间（字节）。 |
| `free` | `number` | 剩余空间（字节）。 |
| `file_count` | `number` | 当前文件数。 |
| `max_file_count` | `number` | 文件数量上限。 |

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
const info = await fs.df()
console.log(`已用 ${(info.used / 1024 / 1024).toFixed(1)} MB，共 ${info.file_count} 个文件`)
```

---

## 获取文件或目录属性

- 方法: `fs.stat(fid)`
- 签名: `stat(fid: string): Promise<GfsFileStat | GfsDirStat>`
- 描述: 根据 id 获取一个文件或目录的详细属性。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string` | 是 | - | 目标文件或目录的 id。 |

### 返回值

`Promise<GfsFileStat | GfsDirStat>` —— 字段见下方[属性字段表](#属性字段表)。

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
const stat = await fs.stat("some_fid")
console.log(stat.name, stat.is_dir)
```

---

## 列出目录内容

- 方法: `fs.dir(pid?, start?, limit?)` ，别名 `fs.ls(...)`
- 签名: `dir(pid?: string, start?: number, limit?: number): Promise<(GfsFileStat | GfsDirStat)[]>`
- 描述: 列出某个目录下的所有文件和子目录。`ls` 是 `dir` 的别名，参数与行为完全一致。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `pid` | `string` | 否 | `"/"` | 目标目录 id，默认根目录。 |
| `start` | `number` | 否 | `0` | 起始偏移，用于分页。 |
| `limit` | `number` | 否 | `100` | 本次返回的最大条数。 |

### 返回值

`Promise<(GfsFileStat | GfsDirStat)[]>` —— 文件与目录混合的数组，用每个元素的 `is_dir` 区分类型。

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
const list = await fs.dir("/")
for (const item of list) {
  console.log(item.is_dir ? "[目录] " : "[文件] ", item.name, item.fid)
}
```

---

## 创建目录

- 方法: `fs.mkdir(name)`
- 签名: `mkdir(name: string): Promise<GfsDirStat>`
- 描述: 在根目录下新建一个目录（只能建在根目录）。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | `string` | 是 | - | 目录名。 |

### 返回值

`Promise<GfsDirStat>` —— 新建目录的属性。

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
const dir = await fs.mkdir("作业")
console.log("新目录 id：", dir.fid)
```

---

## 删除文件或目录

- 方法: `fs.rm(fid)`
- 签名: `rm(fid: string): Promise<void>`
- 描述: 删除一个文件或目录。传文件 id 删文件；传目录 id（以 `/` 开头）删目录，并连同目录里的全部文件一起删除。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string` | 是 | - | 文件 id 或目录 id。 |

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
await fs.rm("some_fid") // 删一个文件
```

---

## 重命名文件或目录

- 方法: `fs.rename(fid, name)`
- 签名: `rename(fid: string, name: string): Promise<void>`
- 描述: 给文件或目录改名。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string` | 是 | - | 文件 id 或目录 id。 |
| `name` | `string` | 是 | - | 新名称。 |

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
await fs.rename("some_fid", "新名字.zip")
```

---

## 移动文件

- 方法: `fs.mv(fid, pid)`
- 签名: `mv(fid: string, pid: string): Promise<void>`
- 描述: 把一个文件移动到另一个目录。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string` | 是 | - | 要移动的文件 id。 |
| `pid` | `string` | 是 | - | 目标目录 id。 |

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
await fs.mv("some_fid", "/target_dir_fid")
```

---

## 上传文件

- 方法: `fs.upload(file, pid?, name?, callback?, send?)`
- 签名: `upload(file: string | Buffer, pid?: string, name?: string, callback?: (percentage: string) => void, send?: boolean): Promise<GfsFileStat>`
- 描述: 上传一个文件到群文件。`file` 传本地路径就从该路径读取，传 `Buffer` 就直接上传这段内容。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string \| Buffer` | 是 | - | 本地文件路径，或要上传的内容 `Buffer`。 |
| `pid` | `string` | 否 | `"/"` | 上传到的目标目录 id，默认根目录。 |
| `name` | `string` | 否 | - | 上传后的文件名；`file` 为 `Buffer` 且留空时自动以 md5 命名。 |
| `callback` | `(percentage: string) => void` | 否 | - | 进度回调，参数是百分比字符串。 |
| `send` | `boolean` | 否 | `true` | 是否在群内发出「上传了文件」的消息。 |

### 返回值

`Promise<GfsFileStat>` —— 上传完成后文件的属性。

### 失败

被风控、空间不足或安全校验未通过时，Promise 抛出 `ApiRejection`（含 `code` 与 `message`），用 `try/catch` 捕获。

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
const stat = await fs.upload("/tmp/note.pdf", "/", "笔记.pdf", (p) => {
  console.log("进度：" + p)
})
console.log("上传完成，fid：", stat.fid)
```

---

## 转发群文件到本群

- 方法: `fs.forward(stat, pid?, name?, send?)`
- 签名: `forward(stat: GfsFileStat, pid?: string, name?: string, send?: boolean): Promise<GfsFileStat>`
- 描述: 把另一个群里的文件（用它的 `GfsFileStat`）转存到当前群，无需重新上传内容。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `stat` | `GfsFileStat` | 是 | - | 另一个群里那个文件的属性（用 `stat`/`dir` 取得）。 |
| `pid` | `string` | 否 | `"/"` | 转发到的目标目录 id。 |
| `name` | `string` | 否 | - | 转发后的文件名，默认不变。 |
| `send` | `boolean` | 否 | `true` | 是否在群内发出文件消息。 |

### 返回值

`Promise<GfsFileStat>` —— 文件在当前群的属性。

---

## 转发离线（私聊）文件到本群

- 方法: `fs.forwardOfflineFile(fid, name?, send?)`
- 签名: `forwardOfflineFile(fid: string | object, name?: string, send?: boolean): Promise<GfsFileStat>`
- 描述: 把一份私聊（离线）文件转存到当前群。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string \| object` | 是 | - | 私聊文件的 fid，或它的 fileInfo 对象。 |
| `name` | `string` | 否 | - | 转发后的文件名，默认不变。 |
| `send` | `boolean` | 否 | `true` | 是否在群内发出文件消息。 |

### 返回值

`Promise<GfsFileStat>` —— 文件在当前群的属性。

---

## 获取文件下载地址

- 方法: `fs.download(fid)`
- 签名: `download(fid: string): Promise<{ name: string; url: string; size: number; md5: string; duration: number; fid: string }>`
- 描述: 获取某个群文件的下载直链。注意：本方法返回下载地址，并不会替你把文件下载到本地，需要你自己用 `url` 去下载。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `fid` | `string` | 是 | - | 文件 id。 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 文件名。 |
| `url` | `string` | 可下载的直链地址。 |
| `size` | `number` | 文件大小（字节）。 |
| `md5` | `string` | 文件 md5（十六进制）。 |
| `duration` | `number` | 文件存在时间。 |
| `fid` | `string` | 文件 id。 |

### 示例

```js
const fs = client.pickGroup(<group_id>).fs
const dl = await fs.download("some_fid")
console.log(dl.name, dl.url)
```

---

## 属性字段表

### `GfsFileStat`（文件）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fid` | `string` | 文件 id。 |
| `pid` | `string` | 所在目录 id。 |
| `name` | `string` | 文件名。 |
| `user_id` | `number` | 上传者账号。 |
| `create_time` | `number` | 创建时间（秒）。 |
| `modify_time` | `number` | 最近修改时间（秒）。 |
| `is_dir` | `boolean` | 恒为 `false`。 |
| `size` | `number` | 文件大小（字节）。 |
| `busid` | `number` | 内部 busid。 |
| `md5` | `string` | 文件 md5（十六进制）。 |
| `sha1` | `string` | 文件 sha1（十六进制）。 |
| `duration` | `number` | 文件存在时间。 |
| `download_times` | `number` | 下载次数。 |

### `GfsDirStat`（目录）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fid` | `string` | 目录 id（以 `/` 开头）。 |
| `pid` | `string` | 父目录 id。 |
| `name` | `string` | 目录名。 |
| `user_id` | `number` | 创建者账号。 |
| `create_time` | `number` | 创建时间（秒）。 |
| `modify_time` | `number` | 最近修改时间（秒）。 |
| `is_dir` | `boolean` | 恒为 `true`。 |
| `file_count` | `number` | 目录内文件数。 |

### 相关

[群相关 API](/api/group) · [核心类型](/api/types)
