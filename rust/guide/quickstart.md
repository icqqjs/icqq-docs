# 快速开始

本页带你从**下载预编译程序**开始，到登录上线、收发消息。无需 Rust 工具链、无需自己编译。

真正登录并收发消息需要同时具备两样东西：

1. 一个真实 QQ 账号（uin + 密码，或扫码登录）；
2. 一个外部 **sign server**（qsign / unidbg-fetch-qsign / 兼容 T544），地址填到 `account.sign_api_url`。

::: danger 关于 sign server
**请自行寻找合适的 sign server（签名服务），本项目不提供、不内置、不推荐任何 sign server。** 现代 QQ 协议要求每个请求包都带签名，没有 sign server 无法登录。
:::

## 步骤

### 1. 部署 / 获取一个 sign server

记下它的基址（例如 `<sign-server-url>`），稍后填到配置的 `account.sign_api_url`。
注意：`apk_ver` 必须匹配该 sign server 白盒支持的 QQ 版本，否则会被服务端拒绝。

### 2. 下载预编译程序

前往 Releases 页面下载对应你系统的压缩包：

**👉 <https://github.com/icqqjs/icqq-rust-onebot-releases/releases>**

在最新版本的 **Assets** 里，选择与你的**操作系统 + CPU 架构**匹配的那一个：

| 平台 | 文件名 |
| ---- | ---- |
| Linux x64 | `icqq-rs-linux.tar.gz` |
| Linux arm64 | `icqq-rs-linux-arm64.tar.gz` |
| Windows x64 | `icqq-rs-windows.tar.gz` |
| Windows arm64 | `icqq-rs-windows-arm64.tar.gz` |
| macOS arm64 | `icqq-rs-macos.tar.gz` |
| macOS x64 | `icqq-rs-macos-x64.tar.gz` |

::: tip
不确定架构时：Linux/macOS 执行 `uname -m`（`x86_64` 即 64 位 Intel/AMD，`aarch64`/`arm64` 即 ARM64）；Windows 桌面机一般选 x64，近年的骁龙笔记本选 arm64。
:::

### 3. 解压

所有压缩包都是 `.tar.gz` 格式（Windows 也是）。解压后里面是**单个可执行文件**，名字与压缩包同名
（去掉 `.tar.gz`），例如 `icqq-rs-linux`、`icqq-rs-windows.exe`。直接用这个文件运行即可。

把它解压到一个你专用的工作目录（程序会在该目录下生成 `config.yaml`、`data/`、`logs/`）。

::: code-group

```sh [Linux / macOS]
# 新建工作目录并进入
mkdir -p ~/icqq-bot && cd ~/icqq-bot

# 解压（文件名换成你实际下载的那个；macOS arm64 用 icqq-rs-macos.tar.gz）
tar -xzf ~/Downloads/icqq-rs-linux.tar.gz
```

```powershell [Windows (PowerShell)]
# 新建工作目录并进入
mkdir $HOME\icqq-bot; cd $HOME\icqq-bot

# 解压（Windows 10/11 自带 tar；文件名换成你实际下载的那个）
tar -xzf "$HOME\Downloads\icqq-rs-windows.tar.gz"
```

:::

::: tip 关于下文命令里的可执行文件名
下面的命令以 **Linux x64 的 `icqq-rs-linux`** 为例。其它平台请把命令里的可执行文件名换成你解压出的那个
（= 压缩包名去掉 `.tar.gz`），例如 Windows x64 为 `icqq-rs-windows.exe`、macOS arm64 为 `icqq-rs-macos`。
:::

### 4. 赋予执行权限（仅 Linux / macOS）

下载下来的二进制默认没有可执行位，需要手动授权，否则会报 `Permission denied`：

```sh
chmod +x ./icqq-rs-linux
```

> Windows 无需此步。

### 5. 首次运行：自动生成配置

直接运行程序。**首次运行时若当前目录没有 `config.yaml`，程序会自动生成一份默认配置并退出**，提示你去填写：

::: code-group

```sh [Linux / macOS]
./icqq-rs-linux
```

```powershell [Windows]
.\icqq-rs-windows.exe
```

:::

你会看到类似输出：

```text
icqq-rust-onebot v0.1.1

未检测到配置文件，已为你生成默认配置: config.yaml
请编辑该文件，填入你的 QQ 号、密码、sign server 地址等信息，
然后重新运行本程序。

按回车键退出…
```

此时当前目录下已生成 `config.yaml`。程序在退出前会停在「按回车键退出…」，等你按下回车再关闭——这样在 Windows 上**双击**运行时窗口不会一闪而过，你有时间读完提示。（在管道 / 服务等非交互环境下不会停顿，直接退出。）

### 6. 编辑配置

用任意文本编辑器打开生成的 `config.yaml`，填好关键字段：

- `account.uin` —— 你的 QQ 号；
- `account.password` —— 明文或 32 位小写 MD5（留空则走扫码登录）；
- `account.sign_api_url` —— 第 1 步记下的 sign server 基址；
- `account.platform` —— 平台代码（1 = 安卓手机）；
- `account.apk_ver` —— 与 sign server 白盒一致的 QQ 版本；
- **至少启用一种通信端**：把 `http` / `http_post` / `ws` / `ws_reverse` 中你要用的那一项改成 `enable: true`。

::: warning 默认全部关闭
生成的 `config.yaml` 里所有通信端（`http` / `http_post` / `ws` / `ws_reverse`）**默认 `enable: false`**。不打开任何一个的话，程序虽然能登录上线，但不对外暴露接口，你的应用连不进来。各字段含义与多实例写法见[配置说明](./config)。
:::

> 敏感值（uin / 密码 / sign server / token 等）也可用 `ICQQ_*` 环境变量注入（env 优先于
> `config.yaml`），避免明文落盘 —— 见下文「环境变量注入」。

### 7. 再次运行

配置填好后，**再运行一次**就会真正连接 sign server 并登录 QQ：

::: code-group

```sh [Linux / macOS]
./icqq-rs-linux
```

```powershell [Windows]
.\icqq-rs-windows.exe
```

:::

### 8. 观察启动

登录成功后，你启用的 HTTP / WebSocket 接口就可以接收请求了。

- 首次新设备需要在手机 QQ 里确认一次设备验证；
- 可能遇到选图验证码；
- 运行日志默认写到 `data/<uin>/logs/` 目录，排查问题时可查看。

## 环境变量注入

以下环境变量可覆盖 `config.yaml` 中的对应值（环境变量优先），方便把密码等敏感信息从配置文件移到环境变量。

| 环境变量 | 覆盖的配置字段 |
| ---- | ---- |
| `ICQQ_UIN` | `account.uin` |
| `ICQQ_PASSWORD` | `account.password` |
| `ICQQ_SIGN_API_URL` | `account.sign_api_url` |
| `ICQQ_PLATFORM` | `account.platform` |
| `ICQQ_APK_VER` | `account.apk_ver` |
| `ICQQ_LOGIN_METHOD` | `account.login_method` |
| `ICQQ_DATA_DIR` | `data_dir` |
| `ICQQ_HTTP_ACCESS_TOKEN` | `http[*].access_token`（应用到全部 HTTP 服务端） |

例如（仅用环境变量注入敏感值，配置文件里留占位/空）：

::: code-group

```sh [Linux / macOS]
export ICQQ_UIN=<your-uin>
export ICQQ_PASSWORD=<your-password>
export ICQQ_SIGN_API_URL=<sign-server-url>
export ICQQ_PLATFORM=1
export ICQQ_APK_VER=9.2.0
./icqq-rs-linux
```

```powershell [Windows]
$env:ICQQ_UIN="<your-uin>"
$env:ICQQ_PASSWORD="<your-password>"
$env:ICQQ_SIGN_API_URL="<sign-server-url>"
$env:ICQQ_PLATFORM="1"
$env:ICQQ_APK_VER="9.2.0"
.\icqq-rs-windows.exe
```

:::

## 验证 HTTP 接口

若启用了 HTTP 服务端（示例为 `host: 127.0.0.1`、`port: 5700`），可以发一个 action 试试：

```sh
curl -X POST http://127.0.0.1:5700/send_private_msg \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": <friend_id>, "message": "hello"}'
```

> 没配 `access_token` 时可省略 `Authorization` 头。

完整 action 列表见 [API 参考](/rust/api/)。
