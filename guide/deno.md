# 在 Deno 运行

得益于 Deno 2.0+ 的 Node.js 兼容层，icqq 可以**几乎无需改动**在 Deno 中运行。本页给出最小上手；完整指南见仓库的 `DENO_GUIDE.md`。

## 环境

- Deno ≥ 2.5（推荐最新稳定版）。

```bash
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh
# Windows
irm https://deno.land/install.ps1 | iex

deno --version
```

## 最小示例

把库当作 npm 包通过 `npm:` 说明符引入即可：

```ts
import { createClient } from "npm:@icqqjs/icqq"

const client = createClient({
  platform: 2,                            // 2 = aPad
  sign_api_addr: "http://127.0.0.1:8080/"
})

client.on("system.online", () => console.log("已上线"))
client.on("message", (e) => e.reply("hello from Deno", true))
client.on("system.login.qrcode", () => {
  // 扫码后回车
  Deno.stdin.read(new Uint8Array(1)).then(() => client.login())
})

client.login()
```

## 运行权限

icqq 需要文件、网络等权限，开发期可放开：

```bash
deno run -A my_bot.ts
```

生产环境建议按需收紧（`--allow-net`、`--allow-read`、`--allow-write` 指定到 `data_dir`）。

> 更详细的配置、PM2 / systemd / Docker 部署、排错，见仓库 `DENO_GUIDE.md`。
