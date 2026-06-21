# 配置

配置项通过 `createClient(config)` 传入。所有字段都是可选的，不传则用下面表格里的默认值。

```js
const { createClient } = require("@icqqjs/icqq")
const client = createClient({ /* 这里就是 Config */ })
```

## Config 字段

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `log_level` | `string` | `"info"` | 日志等级（`trace`/`debug`/`info`/`warn`/`error`/`fatal`/`mark`/`off`）。打印日志会降低性能，消息量大时可调高（如 `warn`）。 |
| `platform` | `Platform` | `1`（Android） | 登录协议平台。取值见下方 [Platform 枚举](#platform-枚举)。扫码登录只支持 `3`（Watch）。 |
| `ver` | `string` | 不填用最新 | QQ 客户端版本号。仅当该 `platform` 有多个版本时有效。需与 sign server 白盒版本匹配。 |
| `data_dir` | `string` | `./data` | 数据存储文件夹（设备文件、token、图片缓存等），需可写权限。默认是运行目录下的 `data`。 |
| `sign_api_addr` | `string` | 无 | **签名服务器地址。未配置会导致登录失败、无法收发消息。** |
| `ignore_self` | `boolean` | `true` | 群聊和频道中是否过滤掉自己发的消息。 |
| `cache_group_member` | `boolean` | `true` | 是否缓存群员列表。群多时（500~1000）会多占约 100MB+ 内存；关闭后进程内存可低于 20MB。 |
| `reconn_interval` | `number` | `5` | 触发 `system.offline.network` 后的重连间隔（秒）。设为 `0` 则不自动重连，可自行监听处理。不建议设太低。 |
| `auto_server` | `boolean` | `true` | 是否自动选择最优服务器。关闭后固定连接 `msfwifi.3g.qq.com:8080`。 |
| `resend` | `boolean` | `false` | 被风控时是否尝试用分片方式发送。 |
| `ffmpeg_path` | `string` | 无 | `ffmpeg` 可执行文件路径。发送语音、视频时需要。 |
| `ffprobe_path` | `string` | 无 | `ffprobe` 可执行文件路径。处理音视频时需要。 |
| `QQNT` | `boolean` | `true` | 是否使用 QQNT 协议。 |
| `NTLogin` | `boolean` | `true` | 是否使用 NT 登录流程。 |

> ID 类字段（QQ 号、群号）都是数字，请用 `number`。

## Platform 枚举

`platform` 取下列整数值之一：

| 值 | 名称 | 含义 |
| --- | --- | --- |
| `1` | `Android` | 安卓手机（默认） |
| `2` | `aPad` | 安卓平板 |
| `3` | `Watch` | 安卓手表（**扫码登录只支持此项**） |
| `4` | `iMac` | macOS |
| `5` | `iPad` | iPad |
| `6` | `Tim` | Tim |
| `7` | `Custom` | 自定义 |

完整枚举见 [枚举参考](/api/enums)。

## 完整示例

::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")

const client = createClient({
  platform: 2,                       // aPad
  ver: "9.2.20",                     // 需与 sign server 白盒版本一致
  sign_api_addr: "<sign-server-url>",// 必填
  data_dir: "./data",                // 数据目录
  log_level: "info",
  ignore_self: true,
  cache_group_member: true,
  reconn_interval: 5,
  auto_server: true,
  // 发语音/视频时再配下面两项
  ffmpeg_path: "/usr/bin/ffmpeg",
  ffprobe_path: "/usr/bin/ffprobe"
})
```

```ts [TypeScript]
import { createClient, Config } from "@icqqjs/icqq"

const config: Config = {
  platform: 2,
  ver: "9.2.20",
  sign_api_addr: "<sign-server-url>",
  data_dir: "./data",
  log_level: "info",
  ignore_self: true,
  cache_group_member: true,
  reconn_interval: 5,
  auto_server: true
}

const client = createClient(config)
```

:::

## 相关

- [枚举参考](/api/enums) —— `Platform` 等枚举的完整取值。
- [登录](/guide/login) —— `platform` / `ver` / `sign_api_addr` / token 缓存如何影响登录。
