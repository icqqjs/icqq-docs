# 安装

本页带你把 `@icqqjs/icqq` 装进一个 Node 项目。跟着五步走即可。

## 一、确认环境

| 要求 | 怎么检查 | 说明 |
| --- | --- | --- |
| **Node.js ≥ 14** | `node -v` | 建议用 LTS。低于 14 无法运行。 |
| **npm**（或 yarn / pnpm） | `npm -v` | 装包用，随 Node 一起安装。 |
| **ffmpeg / ffprobe**（可选） | `ffmpeg -version` | 仅发**语音 / 短视频**时需要；只发文字图片可跳过。装好后可在配置里用 `ffmpeg_path` / `ffprobe_path` 指定路径，见[配置](/guide/config)。 |

> 还需要一个**外部 sign server** 和一个 **QQ 账号**才能真正登录——那是运行时的前提，不是安装的前提。见[快速开始](/guide/quickstart)。

## 二、建一个项目

如果还没有项目，先建一个空目录并初始化：

```shell
mkdir my-bot && cd my-bot
npm init -y
```

## 三、配置 .npmrc

`@icqqjs/icqq` 发布在 **GitHub Packages**（不是默认 npm 源），所以要先告诉 npm：`@icqqjs` 这个 scope 去 GitHub Packages 拉。在项目根目录建文件 `.npmrc`，写入一行：

```ini
@icqqjs:registry=https://npm.pkg.github.com
```

## 四、登录 GitHub Packages

GitHub Packages 需要登录才能拉包。执行：

```shell
npm login --scope=@icqqjs --auth-type=legacy --registry=https://npm.pkg.github.com
```

按提示输入：

- **Username**：你的 GitHub 用户名。
- **Password**：**不是** GitHub 密码，而是一个 **Personal Access Token (PAT)**。到 <https://github.com/settings/tokens/new> 生成，勾选 `read:packages` 即可，把生成的 token 粘进来。
- **Email**：你的邮箱。

## 五、安装

```shell
npm i @icqqjs/icqq
```

> 习惯用旧包名 `icqq`、想保留 `require("icqq")` 写法？可以用别名安装：
> ```shell
> npm i icqq@npm:@icqqjs/icqq
> ```

## 验证安装成功

新建 `test.js`，运行后能打印 `function` 就说明装好了：

::: code-group

```js [JavaScript]
const { createClient } = require("@icqqjs/icqq")
console.log(typeof createClient) // 期望输出: function
```

```ts [TypeScript]
import { createClient } from "@icqqjs/icqq"
console.log(typeof createClient) // 期望输出: function
```

:::

```shell
node test.js
# function
```

## 下一步

- [快速开始](/guide/quickstart) —— 写出第一个能上线收发消息的 bot，并教你**怎么运行**它。
- [配置](/guide/config) —— `createClient` 的全部配置项。
