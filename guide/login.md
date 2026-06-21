# 登录

登录由 `client.login()` 发起，过程中可能需要你配合完成扫码、滑块、设备锁等验证。这些验证都通过**事件**通知你，你处理完后再调用相应方法继续。本页讲清各种登录方式与验证流程。

::: danger 前提：sign server 与版本匹配
登录必须配置 `sign_api_addr`（外部 sign server），且 `platform` 与 `ver` 要和该 sign server 白盒支持的 QQ 版本一致，否则会被服务端拒绝，触发 `system.login.error`。这是和协议实现绑定的硬前提。配置见[配置](/guide/config)。
:::

## login 方法

- 签名：`login(password?: string | Buffer): Promise<void>`
- 签名：`login(uin?: number, password?: string | Buffer): Promise<void>`

`login` 有两种调用方式：

| 调用形式 | 行为 |
| --- | --- |
| `client.login()` | 优先用本地缓存的 token 登录；无 token 时走扫码登录。 |
| `client.login(<uin>)` | 指定账号，优先用 token；无 token 走扫码。 |
| `client.login(<uin>, "<password>")` | 指定账号 + 密码，优先用 token；token 失效则用密码登录。 |

> `password` 可以是密码原文，也可以是 32 位的密码 MD5（十六进制字符串）。掉线重连时框架也会自动调用 `login`，走相同逻辑。

下面分别介绍各登录方式。所有示例都假设你已经 `createClient` 得到了 `client`。

## 扫码登录

需要扫码时触发 `system.login.qrcode`，`event.image` 是二维码的 **PNG Buffer**。把它保存成图片或展示给用户，用手机 QQ 扫码确认后，再次调用 `client.login()` 即可上线。

::: warning 仅 Watch 协议支持扫码
扫码登录只能在 **Watch 协议**（`platform: 3`）下进行，其它协议无法扫码登录。
:::

::: code-group

```js [JavaScript]
const fs = require("fs")

client.on("system.login.qrcode", (e) => {
  fs.writeFileSync("qrcode.png", e.image) // e.image 是 PNG Buffer
  console.log("请用手机 QQ 扫描 qrcode.png，扫码确认后按回车")
  process.stdin.once("data", () => client.login())
})

client.login()
```

```ts [TypeScript]
import { writeFileSync } from "fs"

client.on("system.login.qrcode", (e) => {
  writeFileSync("qrcode.png", e.image)
  console.log("请用手机 QQ 扫描 qrcode.png，扫码确认后按回车")
  process.stdin.once("data", () => client.login())
})

client.login()
```

:::

## 密码登录

把账号和密码传给 `login`。密码可以是明文，也可以是 32 位的密码 MD5。密码登录通常只需验证一次设备，之后长期有效。

::: code-group

```js [JavaScript]
// 明文密码
client.login(<uin>, "<password>")

// 或者用 32 位密码 MD5
client.login(<uin>, "<password_md5>")
```

```ts [TypeScript]
client.login(<uin>, "<password>")
```

:::

> Watch 协议不支持密码登录，传了密码也会自动回退到扫码登录。要用密码登录请选 `platform: 1`（安卓）等协议。

## 滑块验证

登录中若需要滑块验证，触发 `system.login.slider`，`event.url` 是滑块验证页面地址。引导用户在该页面完成滑动、取得 **ticket** 后，调用 `client.submitSlider(ticket)` 提交。

- 签名：`submitSlider(ticket: string): Promise<void>`

::: code-group

```js [JavaScript]
client.on("system.login.slider", (e) => {
  console.log("请打开此链接完成滑块验证：", e.url)
  console.log("完成后把取得的 ticket 粘贴进来，按回车")
  process.stdin.once("data", (buf) => {
    client.submitSlider(buf.toString().trim())
  })
})
```

```ts [TypeScript]
client.on("system.login.slider", (e) => {
  console.log("请打开此链接完成滑块验证：", e.url)
  process.stdin.once("data", (buf) => {
    client.submitSlider(buf.toString().trim())
  })
})
```

:::

## 设备锁 / 短信验证

新设备登录可能触发设备锁，事件为 `system.login.device`，带 `url` 与 `phone`（接收短信的手机号尾号）。处理方式有两种：

1. 打开 `event.url` 在网页上完成验证；
2. 走短信验证：调用 `client.sendSmsCode()` 发送短信，收到验证码后用 `client.submitSmsCode(code)` 提交。

- 签名：`sendSmsCode(): Promise<void>`
- 签名：`submitSmsCode(code: string): Promise<void>`

::: code-group

```js [JavaScript]
client.on("system.login.device", (e) => {
  console.log("需要验证设备，手机号：", e.phone)
  console.log("也可打开此链接验证：", e.url)

  // 走短信：先发送验证码
  client.sendSmsCode()
  console.log("已发送短信验证码，请输入收到的验证码后按回车")
  process.stdin.once("data", (buf) => {
    client.submitSmsCode(buf.toString().trim())
  })
})
```

```ts [TypeScript]
client.on("system.login.device", (e) => {
  console.log("需要验证设备，手机号：", e.phone)
  client.sendSmsCode()
  process.stdin.once("data", (buf) => {
    client.submitSmsCode(buf.toString().trim())
  })
})
```

:::

## 登录错误

登录失败时触发 `system.login.error`，带 `code` 与 `message`。常见原因：sign server 未配置或版本不匹配、密码错误、账号被冻结等。

```js
client.on("system.login.error", (e) => {
  console.error(`登录失败 [${e.code}]：${e.message}`)
})
```

## token 缓存：二次启动免验证

登录成功后，框架会把登录态（token）保存在数据目录里，文件名形如 `${uin}_${protocol}_token`，其中 `${data_dir}` 默认是 `./data`（见[配置](/guide/config)）。

下次启动时直接 `client.login()`（或 `client.login(<uin>)`），框架会**优先用这个 token 登录**，通常不必再扫码或验证。只有 token 失效时，才会回退到密码登录或扫码登录。

> 想强制重新登录，删掉数据目录下对应的 `*_token` 文件即可。

## 平台与版本要匹配

`platform` 决定用哪种协议登录，`ver` 决定 QQ 客户端版本，二者都必须落在 sign server 白盒支持的范围内，否则登录会被拒。各平台取值见 [Platform 枚举](/api/enums)，配置方法见[配置](/guide/config)。

记住两条限制：

- **扫码登录只支持 Watch 协议**（`platform: 3`）。
- **密码登录不能用 Watch 协议**，请用安卓等协议。

## 相关

- [配置](/guide/config) —— `platform` / `ver` / `sign_api_addr` / `data_dir` 等。
- [事件系统](/guide/events) —— 登录相关事件的完整列表。
- [Platform 枚举](/api/enums)
