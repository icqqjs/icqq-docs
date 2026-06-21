# 介绍

**icqq-rust-onebot** 是一个`非官方QQ`的机器人后端——你运行它，它帮你的程序连上 QQ，收发消息。

它对外提供 [OneBot 11](https://github.com/botuniverse/onebot-11) 接口，你的代码通过 HTTP 或 WebSocket 跟它通信。不管你用 Python、Node.js、Go 还是任何语言，只要能发 HTTP 请求或连 WebSocket，就能对接。

::: danger 免责声明
- 本项目仅供**学习交流与技术研究**使用，不得用于任何违反法律法规的用途。
- 本项目**永远不会**提供任何金融相关功能（支付、红包、转账等），**永远不会**实现任何可被用于骚扰、欺诈、批量营销等滥用场景的接口。
- 使用者应当遵守所在地区的法律法规，因使用本项目产生的一切后果由使用者自行承担，与开发者无关。
- 如本项目侵犯了您的合法权益，请通过 [GitHub Issue](https://github.com/icqqjs/icqq-rust-onebot-releases/issues) 联系我们，我们将及时处理。
:::

## 它能做什么

- 收发私聊 / 群聊消息（文字、图片、语音、视频、表情、合并转发……）
- 群管理（踢人、禁言、设管理、改头衔、群公告……）
- 处理好友 / 入群请求
- 接收各类通知事件（撤回、戳一戳、群成员变动……）
- 完整的 API 列表见 [API 参考](/rust/api/)

## 你需要准备什么

1. **一个 QQ 账号**（QQ 号 + 密码，或者扫码登录）
2. **一个 sign server**（签名服务器）—— 现代 QQ 协议要求每个请求包都带签名，需要外部签名服务。本项目不内置签名服务，需自行部署或获取

准备好后，跟着[快速开始](./quickstart)走就行。

## 兼容性说明

::: warning 与其他 OneBot 实现的差异
以下几点与 go-cqhttp 等常见实现**不同**，对接时请注意：

1. **不支持 CQ 码** —— 消息只接受数组格式（`[{"type":"text","data":{"text":"hello"}}]`）。如果你传字符串，会被当作**纯文本**，不会解析 `[CQ:...]`
2. **`message_id` 是字符串** —— 不是标准 OneBot 11 要求的 int32 整数，而是一个 base64url 编码的自描述字符串。直接拿来传给撤回/回复 API 就行，不要尝试转数字
3. **`raw_message` 是纯文本** —— 只是把消息里的文本段拼在一起，不含 CQ 码
:::

## 技术特点

- **纯 Rust 实现**，不依赖 Node.js/Python 运行时，内存占用极低（< 15 MB RSS）
- 单二进制文件部署，内置 SQLite 存储
- 协议层移植自 TypeScript 版 [icqq](https://github.com/icqqjs/icqq)，行为保持一致
- 支持 HTTP、正向 WebSocket、反向 WebSocket 三种通信方式

## 下一步

- [快速开始](./quickstart) —— 部署 sign server、填配置、启动
- [基本概念](./basics) —— 什么是 action、event、echo？看这里
- [对接示例](./examples) —— Python / Node.js / curl 实战代码
- [配置说明](./config) —— 配置文件每个字段的含义
- [API 参考](/rust/api/) —— 全部 API 列表
