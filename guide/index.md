# 介绍

**icqq** 是一个用 TypeScript 写的 **QQ 协议 Node.js 库**。你在自己的 Node 程序里引入它，就能登录 QQ、收发消息、管理群、操作好友。

它是 [OICQ](https://github.com/takayama-lily/oicq) 的活跃延续分支，许可证 **MPL-2.0**。

## 它能做什么

- **登录 QQ**：扫码 / 密码登录，自动处理滑块、设备锁、短信验证。
- **收发消息**：私聊、群聊、讨论组、QQ 频道；文本、图片、语音、视频、@、表情、引用回复、合并转发。
- **群管理**：踢人、禁言、全员禁言、设管理员、改名片、群头衔、群公告等。
- **联系人操作**：`pickFriend` / `pickGroup` / `pickMember` 拿到对象后链式调用。

## 用之前你需要准备

| 前提 | 说明 | 必须 |
| --- | --- | --- |
| **Node.js ≥ 14** | 运行环境。建议用 LTS 版本。 | ✅ 必须 |
| **一个 sign server（签名服务）** | 现代 QQ 每个包都要签名，没有它无法登录。需自行部署/获取，本库不提供。 | ✅ 必须 |
| **一个 QQ 账号** | 用来登录的账号（uin + 密码，或扫码）。 | ✅ 必须 |
| **ffmpeg / ffprobe** | 只有发**语音 / 短视频**才需要。只发文字图片可不装。 | ⬜ 可选 |

> ⚠️ **sign server 是硬前提**。它是一个独立的外部服务，你要先有它的地址，才能在 icqq 里配置 `sign_api_addr` 并登录。详见[快速开始](/guide/quickstart)与[登录](/guide/login)。

## 它和 icqq-rs（Rust 版）有什么区别

两者协议能力相同，但**使用方式完全不同**：

- **icqq（本库）**：Node **原生库**。你写 Node 代码，`import` 后**直接调方法、监听事件**。本文档讲的就是它。
- **[icqq-rs](/rust/)**：独立进程，对外是 **OneBot 11 的 HTTP / WebSocket 接口**。适合用别的语言 / 框架跨进程对接。

一句话：**想用 JS/TS 写机器人 → 用本库；想要 HTTP/OneBot 接口 → 用 icqq-rs。**

## 下一步

1. [安装](/guide/install) —— 准备环境、装好 `@icqqjs/icqq`。
2. [快速开始](/guide/quickstart) —— 跑起第一个能上线收发消息的 bot。
3. [登录](/guide/login) —— 扫码 / 密码 / 验证码等各种登录场景。

写功能时再看：[事件系统](/guide/events) · [消息与消息段](/guide/message) · [联系人对象](/guide/contacts) · [API 参考](/api/)。
