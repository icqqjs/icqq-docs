# 常见问题

## 登录相关

### 一直登录失败 / 提示需要签名

icqq 登录与发包都需要一个**外部 sign server**。请确认：

- `sign_api_addr` 已正确配置且服务可访问。
- `ver`（或 `platform` 对应的版本）与 sign server 白盒支持的 QQ 版本**一致**，否则会被拒。
- 详见[登录指南](/guide/login)。

### 报「禁止登录」/ type-45 之类

通常是**协议版本 / 平台与 sign server 不匹配**，或触发了设备验证。换用与 sign server 匹配的 `apk_ver`，并在手机 QQ 完成一次新设备确认。

### 每次启动都要扫码

登录态会缓存在 `data_dir` 下的 token 文件里。确认 `data_dir` 可写且未被清空；删除该 token 文件会强制重新登录。

## 消息相关

### 发图片 / 语音 / 视频失败

- 图片支持本地路径、`http(s)://`、`base64://`、`Buffer`。
- **语音、短视频需要 `ffmpeg` / `ffprobe` 在 `PATH` 中可用**（或用 `ffmpeg_path` / `ffprobe_path` 指定）。

### `message_id` 能当数字用吗

不能。`message_id` 是**字符串**，用于撤回 / 引用，请勿按数字解析。QQ 号、群号才是数字。

### 收到的消息怎么解析

事件回调里 `e.message` 是 `MessageElem[]`，`e.raw_message` 是文本预览。遍历 `e.message` 按 `type` 取段，详见[消息与消息段](/guide/message)。

## 其他

### 大群占内存高

`cache_group_member` 默认开启，会缓存全部群成员（大群可能上百 MB）。不需要时在 [配置](/guide/config) 里关掉。

### 我需要的是 HTTP / OneBot 接口

icqq 是 Node 原生库（进程内方法调用）。若要语言无关的 OneBot 11 HTTP / WebSocket 接口，请看 [icqq-rs（Rust OneBot 桥）](/rust/)。
