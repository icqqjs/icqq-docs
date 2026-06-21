# 快速开始

本页带你从零跑起第一个 bot：**扫码登录、上线、收到消息自动回复**。

## 开始前的清单

确认这几样都齐了，否则跑不起来：

- [x] 已[安装](/guide/install) `@icqqjs/icqq`，`node -v` ≥ 14。
- [x] 有一个 **sign server 地址**（形如 `http://127.0.0.1:8080/`）。没有就先部署/获取一个——现代 QQ 没它无法登录。
- [x] 有一个能登录的 **QQ 账号**（本例用扫码，手机上有这个号即可）。

::: danger sign server 是硬前提
本库**不提供、不内置** sign server。你必须自备，并把它的地址填到 `sign_api_addr`。另外 `platform` / `ver` 要和该 sign server 支持的 QQ 版本匹配，否则会被拒。详见[登录](/guide/login)。
:::

## 第一步：写代码

在项目里新建 `bot.js`，粘贴下面这份完整代码（改掉 `sign_api_addr` 那一行）：

::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")
const fs = require("fs")

// 1) 创建客户端。扫码登录需用 Watch 协议（platform: 3）
const client = createClient({
  platform: 3,                            // 3 = Watch，扫码登录只能用它
  sign_api_addr: "http://127.0.0.1:8080/" // ← 改成你的 sign server 地址
})

// 2) 上线成功
client.on("system.online", () => {
  console.log("✅ 已上线，可以开始收发消息了")
})

// 3) 收到任意消息就回复
client.on("message", (e) => {
  console.log("收到:", e.raw_message)
  e.reply("hello world", true)            // 第二个参数 true = 引用对方消息
})

// 4) 收到登录二维码：存成图片，扫码后按回车继续
client.on("system.login.qrcode", (e) => {
  fs.writeFileSync("qrcode.png", e.image) // e.image 是 PNG 图片的 Buffer
  console.log("📷 二维码已存到 qrcode.png，用手机 QQ 扫码，然后回到终端按回车")
  process.stdin.once("data", () => client.login())
})

// 5) 开始登录
client.login()
```

```ts [TypeScript]
import { createClient } from "@icqqjs/icqq"
import { writeFileSync } from "fs"

const client = createClient({
  platform: 3,
  sign_api_addr: "http://127.0.0.1:8080/" // ← 改成你的 sign server 地址
})

client.on("system.online", () => {
  console.log("✅ 已上线，可以开始收发消息了")
})

client.on("message", (e) => {
  console.log("收到:", e.raw_message)
  e.reply("hello world", true)
})

client.on("system.login.qrcode", (e) => {
  writeFileSync("qrcode.png", e.image)
  console.log("📷 二维码已存到 qrcode.png，用手机 QQ 扫码，然后回到终端按回车")
  process.stdin.once("data", () => client.login())
})

client.login()
```

:::

## 第二步：运行

在 `bot.js` 所在目录执行：

```shell
node bot.js
```

TypeScript 用户可以用 `npx tsx bot.ts`（或先 `tsc` 编译再 `node`）。

## 第三步：扫码上线

运行后会看到：

```text
📷 二维码已存到 qrcode.png，用手机 QQ 扫码，然后回到终端按回车
```

1. 打开项目目录里新生成的 **`qrcode.png`**，用**手机 QQ** 扫码并确认。
2. 回到终端**按回车**。
3. 看到 `✅ 已上线` 就成功了。这时给这个 QQ 发条消息，它会回你 `hello world`。

> 登录态会缓存在本地（默认 `./data` 目录）。下次启动一般不用再扫码。

## 跑不起来？对症排查

| 现象 | 多半原因 | 怎么办 |
| --- | --- | --- |
| 启动就报签名 / 登录失败 | `sign_api_addr` 没配或不可用 | 确认 sign server 在跑、地址正确。 |
| 提示版本不匹配 / 被拒 | `platform` / `ver` 和 sign server 不一致 | 换成与 sign server 匹配的版本，见[登录](/guide/login)。 |
| 扫码后提示需设备验证 | 新设备首次登录 | 在手机 QQ 确认，或走滑块 / 短信，见[登录](/guide/login)。 |
| 收不到消息 | 还没上线 / 监听写错 | 确认先打印了 `✅ 已上线`；事件名见[事件系统](/guide/events)。 |

## 下一步

- [登录](/guide/login) —— 密码登录、滑块、设备锁、短信等所有登录场景。
- [事件系统](/guide/events) —— 能监听哪些事件、事件怎么分层。
- [消息与消息段](/guide/message) —— 怎么发图片、@、表情、引用、合并转发。
