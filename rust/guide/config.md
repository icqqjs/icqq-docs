# 配置说明

应用从工作目录下的 `config.yaml` 加载配置，随后用 `ICQQ_*` 环境变量覆盖其中的敏感/常用
字段。把 `config.example.yaml` 复制为 `config.yaml` 再填值即可。

```sh
cp config.example.yaml config.yaml
cargo run -p icqq-app
```

## 顶层运行参数

| 字段 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `data_dir` | `"./data"` | 数据**根目录**。0.2 起按账号分目录，每个 uin 的数据落在 `data_dir/<uin>/` 下（见[数据目录布局与迁移](#数据目录布局与迁移)）。 |
| `heartbeat_interval` | `15000` | `meta_event` 心跳周期（**毫秒**，对应 go-cqhttp 的 `heartbeat.interval`）。据此推算心跳超时。设为 `0`（或任意 `<= 0`）则完全关闭心跳（不启动心跳任务）。 |
| `cache_group_member` | `true` | 是否缓存群成员列表。开启后收到某群首条消息会在后台拉取该群成员名册，之后 `@某人`（仅带 QQ 的 @ 段）可解析出群名片/昵称而非裸号。 |
| `report_self_message` | `true` | 是否上报「自身消息」。登录号自己发出（含其他设备同步来）的消息以 `post_type: "message_sent"` 上报；设为 `false` 则丢弃这些事件、不下发（对齐 go-cqhttp 的 `report-self-message`，避免 bot 自发消息触发回环）。 |
| `captcha_port` | `0` | 过滑块「本地 webui」的监听端口。`0` = 由操作系统随机分配（每次登录都可能变化）；设为固定值则始终绑定该端口，便于反向代理 / 端口转发 / 收藏固定地址。也可用环境变量 `ICQQ_CAPTCHA_PORT` 覆盖。 |

## 数据目录布局与迁移

**0.2 起**，每个账号的全部本地数据独占一个以 uin 命名的子目录，互不干扰：

```
data/
└── <uin>/
    ├── device.json   # 设备信息（权威、可读、可备份/迁移）
    ├── icqq.db       # SQLite：token / 会话 / 名册 / 文件缓存
    └── logs/         # 日志（见 log.dir，留空时默认在此）
```

按 uin 分目录后，多个账号 / 多份 `config.yaml` 各写各的目录，不再争抢同一份 `device.json` / `icqq.db`。

### 自动迁移

首次以 0.2 启动某账号时，若 `data/<uin>/` 还不存在、而 `data_dir` 根目录里发现旧数据，会**自动迁移**进 `data/<uin>/`，并把根目录的原文件改名为 `*.migrated` 作为备份（非破坏、可回滚）。识别两类来源：

| 来源 | 触发条件 | 处理 |
| ---- | ---- | ---- |
| **0.1 版 icqq-rs**（扁平布局） | `data_dir/icqq.db` 存在 | 复制 `icqq.db`（含 `-wal`/`-shm`）+ `device.json` 进子目录；格式不变，**免重新登录**。 |
| **上游 TypeScript icqq** | 无 `data_dir/icqq.db`，但有 `device.json` 或 `<uin>_*_token` | `device.json` 由 ShortDevice 展开为全量设备；token 文件与本项目字节同构，原样导入新库，**免重新登录**。 |

::: tip 怎么从上游 icqq 迁过来
把上游 icqq 的 `data` 目录下的 `device.json` 和 `<uin>_*_token` 放进本项目的 `data/`（根目录），用同一个 `uin` 启动一次即可。迁移是幂等的：`data/<uin>/` 一旦建立，后续启动不再重复导入。
:::

::: warning 0.1 → 0.2 变更
- 旧版写出的 `login_challenge.json` 在 0.2 已移除（过滑块/验证码仍用终端粘贴或 `./ticket.txt` 回填，行为不变）。
- 扫码登录的 `qrcode.png` 现保存在 `data/<uin>/` 下。
:::

## account —— 凭据 + sign server（必填）

| 字段 | 必填 | 默认/示例 | 说明 |
| ---- | ---- | ---- | ---- |
| `uin` | 是 | `<your-uin>` | QQ 号（整数）。 |
| `password` | 否 | `<your-password>` | 明文，或 32 位小写 MD5 十六进制。留空/注释掉则改用扫码登录。 |
| `sign_api_url` | 是* | `<sign-server-url>` | sign-server API 基址（qsign / unidbg-fetch-qsign / 兼容 T544）。留空 => 无签名器 => 无法 LIVE 登录（仅离线启动）。 |
| `platform` | 是 | `1` | 平台代码（整数），见下方平台代码表。 |
| `apk_ver` | 否 | `"9.2.0"` | 使用哪个 apk 档案 / QQ 版本。从该平台的 apk 列表里选版本匹配的；**必须与 sign server 白盒支持的版本一致**。省略则用平台默认 apk。 |
| `login_method` | 否 | `"qr"` / `"password"` | 登录方式。省略时由 bridge 推断：有密码 => 密码；有 sign server 但无密码 => 扫码；否则离线。 |

\* 仅离线启动可省略 `sign_api_url`；真实登录必填。

### 平台代码表

| 代码 | 平台 | 说明 |
| :--: | ---- | ---- |
| `1` | **Android**（安卓手机） | 最常用，大多数 sign server 支持此平台 |
| `2` | **aPad**（安卓平板） | 常用平台之一 |
| `3` | **Watch**（手表） | QQ 轻量版 |
| `4` | **iMac**（macOS 桌面） | 桌面客户端 |
| `5` | **iPad** | iPad 原生客户端 |
| `6` | **Tim** | TIM 轻聊版 |

::: tip
不同平台对应不同的 apk 档案和协议特征。**`apk_ver` 必须与所选平台的 sign server 白盒支持版本一致**，否则登录会被拒绝。常用组合为 `platform: 1`（Android）或 `platform: 2`（aPad）配合 `apk_ver: "9.2.0"`。
:::

## 通信端：多实例

四种通信端 —— `http` / `http_post` / `ws` / `ws_reverse` —— **每一种都支持多实例**：写成一个 YAML
列表（`- ...`），即可同时启动多个服务端 / 客户端（如同时监听多个端口、同时上报多个上游）。列表
里每一项都有独立的 `enable`，可单独开关某一项。

::: tip 兼容旧格式
每一种也仍可写成**单个对象**（旧格式），等价于只有一项的列表。所以你已有的单对象 `config.yaml`
无需改动即可继续工作。
:::

::: warning 默认全部关闭
生成的 `config.yaml` 里**所有通信端默认 `enable: false`**。请按需把要用的那一项改成
`enable: true`，否则 bot 启动后不对外暴露任何接口（仅离线处理 action + 心跳）。
:::

### http —— OneBot 11 HTTP API 服务端

客户端 POST 一个 action，取回信封。可配置多个监听地址。

| 字段 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `enable` | `false` | 是否启用该 HTTP 服务端。 |
| `host` | `"127.0.0.1"` | 监听地址。 |
| `port` | `0` | 监听端口（示例用 `5700`）。 |
| `access_token` | `""` | Bearer token；非空时请求需带 `Authorization: Bearer <token>`。 |

### http_post —— OneBot 11 HTTP 事件上报（HTTP-POST）

已从 `http` 中**拆分独立**。把每条事件 JSON POST 到 `url`；若设了 `secret`，则用标准 OneBot 11
算法 `X-Signature: sha1=<HMAC-SHA1(secret, body)>` 对请求体签名。可配置多个上报目标，事件会**同时**
投递给每一个。

| 字段 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `enable` | `false` | 是否启用该上报目标。 |
| `url` | `""` | 事件 POST 目标地址。旧键 `post_url` 作为别名仍被接受。 |
| `secret` | 无 | 可选：HMAC-SHA1 签名密钥（标准鉴权算法）。留空则不签名。 |

::: tip 旧格式自动迁移
旧版把 `post_url`/`secret` 写在 `http` 块里的配置仍可工作：加载时会自动迁移成一个 `http_post`
条目（跟随该 `http` 块的 `enable`）。建议改用独立的 `http_post` 段。
:::

### ws —— 正向 WebSocket 服务端

客户端连到 bot。可配置多个监听地址。

| 字段 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `enable` | `false` | 是否启用该正向 WS 服务端。 |
| `host` | `"127.0.0.1"` | 监听地址。 |
| `port` | `0` | 监听端口（示例用 `6700`）。 |
| `access_token` | `""` | 鉴权 token。 |

### ws_reverse —— 反向 WebSocket 客户端

bot 主动连出到上游。可配置多个上游。

| 字段 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `enable` | `false` | 是否启用该反向 WS 客户端。 |
| `url` | `""` | 要连接的上游地址（如 `ws://127.0.0.1:8080/onebot`）。 |
| `access_token` | `""` | 鉴权 token。 |
| `reconnect_interval` | `3000` | 重连退避（毫秒）。 |

## notify —— 掉线/登录带外通知（可选）

当 Bot **被踢下线**、**自动重登彻底失败**、**重新上线**、或**需要登录交互**（扫码 / 滑块 /
短信 / 设备锁 / 风控）时，主动把消息推送到下列渠道，方便人不在 OneBot 客户端旁也能第一
时间知道。所有渠道默认关闭，整套系统受 `notify.enable` 主开关约束。

| 字段 | 默认值 | 说明 |
| ---- | ---- | ---- |
| `enable` | `false` | 通知系统主开关。 |
| `proxy` | `""` | 外网渠道（如 Telegram）使用的代理；留空直连。支持 `http(s)://` 与 `socks5://`。 |
| `events` | `[]` | 仅在这些时机通知：`offline` / `relogin` / `online` / `login`。空 = 全部。 |

**每个渠道都支持「多个」**：写成 YAML 列表即可（单个对象也兼容），各渠道项都有独立的
`enable`（默认 `true`）。各渠道字段：

| 渠道 | 关键字段 |
| ---- | ---- |
| `email`（SMTP） | `smtp_host` / `smtp_port`(默认 465) / `tls`(465 隐式 TLS；`false` 走 STARTTLS) / `username` / `password` / `from` / `to`(列表) |
| `webhook` | `url`（POST JSON `{event,self_id,time,title,body}`）/ `use_proxy` / `headers`（`["K: V"]`） |
| `serverchan` | `key`（SendKey） |
| `dingtalk` | `webhook` / `secret`（可选，开启「加签」时填，HMAC-SHA256） |
| `feishu` | `webhook` / `secret`（可选，开启「签名校验」时填） |
| `wecom` | `webhook`（群机器人地址） |
| `bark` | `server`(默认 `https://api.day.app`) / `key` |
| `telegram` | `bot_token` / `chat_id` / `use_proxy`(默认 `true`) |

::: tip 自测
配好后运行 `./icqq-app notify-selftest`，会给所有启用渠道发一条测试消息并打印
逐渠道成功/失败，便于在等到真实掉线前先验证配置。
:::

::: info 体积
邮件渠道经 `lettre`（SMTP），位于默认开启的 cargo feature `notify-email` 之后；用
`--no-default-features` 构建可裁掉它，二进制不链接 lettre（其余 7 个 HTTP 渠道复用现有
`reqwest`，零额外依赖）。
:::

## 完整配置示例

下面是一份覆盖全部字段的 `config.yaml`（通信端均演示了多实例的列表写法，且默认全部关闭）：

```yaml
# 顶层运行参数
data_dir: "./data"
heartbeat_interval: 15000          # meta_event 心跳周期（毫秒）；<= 0 关闭心跳

# 日志
log:
  level: "info"                    # trace / debug / info / warn / error
  # dir 三态：注释掉 => 默认 data/<uin>/logs；"" => 仅控制台；"/某/路径" => 指定目录
  # dir: "./logs"
  retention_days: 7                # 0 = 不自动清理

# 凭据 + sign server
account:
  uin: 10001
  password: "your-password-or-md5-hex"
  sign_api_url: "http://127.0.0.1:8080"
  platform: 1                      # 1=Android 2=aPad 3=Watch 4=iMac 5=iPad 6=Tim
  apk_ver: "9.2.0"                 # 必须与 sign server 白盒版本一致
  login_method: "password"         # "qr" | "password"，省略则自动推断

# HTTP API 服务端（可多个）
http:
  - enable: false
    host: "127.0.0.1"
    port: 5700
    access_token: "change-me-secret-token"
  # 再加一个监听：
  # - enable: false
  #   host: "0.0.0.0"
  #   port: 5800
  #   access_token: "another-token"

# HTTP 事件上报（可多个，事件同时投递给每一个）
http_post:
  - enable: false
    url: "http://127.0.0.1:5701/onebot/event"
    secret: "change-me-hmac-secret"   # 留空则不签名
  # - enable: false
  #   url: "http://127.0.0.1:5702/onebot/event"
  #   secret: ""

# 正向 WebSocket 服务端（可多个）
ws:
  - enable: false
    host: "127.0.0.1"
    port: 6700
    access_token: "change-me-secret-token"

# 反向 WebSocket 客户端（可多个）
ws_reverse:
  - enable: false
    url: "ws://127.0.0.1:8080/onebot"
    access_token: "change-me-secret-token"
    reconnect_interval: 3000

# 掉线/登录带外通知（各渠道均可多个；默认全部关闭）
notify:
  enable: false
  proxy: ""                          # 如 socks5://127.0.0.1:7890；留空直连
  events: []                         # 空=全部；可选 offline/relogin/online/login
  email:
    - enable: false
      smtp_host: "smtp.example.com"
      smtp_port: 465                 # 465 隐式 TLS；587 等配 tls:false 走 STARTTLS
      tls: true
      username: "you@example.com"
      password: "your-mail-token"
      from: "you@example.com"
      to: ["dest@example.com"]
  webhook:
    - enable: false
      url: "https://example.com/hook"
      use_proxy: false
      headers: []                    # 如 ["Authorization: Bearer xxx"]
  serverchan:
    - enable: false
      key: "SCT-your-sendkey"
  dingtalk:
    - enable: false
      webhook: "https://oapi.dingtalk.com/robot/send?access_token=xxx"
      secret: ""                     # 开启「加签」时填
  feishu:
    - enable: false
      webhook: "https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
      secret: ""
  wecom:
    - enable: false
      webhook: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx"
  bark:
    - enable: false
      server: "https://api.day.app"
      key: "your-device-key"
  telegram:
    - enable: false
      bot_token: "123456:ABC-DEF"
      chat_id: "123456789"
      use_proxy: true
```

## ICQQ_* 环境变量覆盖

以下环境变量存在即覆盖 `config.yaml` 中的对应值（**env 优先**），便于把密码 /
sign server 等敏感值从配置文件移到环境，避免明文落盘。实现见 `crates/icqq-app/src/config.rs` 的
`apply_env_overrides`。

| 环境变量 | 覆盖的配置字段 | 解析 |
| ---- | ---- | ---- |
| `ICQQ_UIN` | `account.uin` | 解析为整数；解析失败则忽略，保留原值。 |
| `ICQQ_PASSWORD` | `account.password` | 原样字符串。 |
| `ICQQ_SIGN_API_URL` | `account.sign_api_url` | 原样字符串。 |
| `ICQQ_PLATFORM` | `account.platform` | 解析为整数；解析失败则忽略。 |
| `ICQQ_APK_VER` | `account.apk_ver` | 原样字符串。 |
| `ICQQ_LOGIN_METHOD` | `account.login_method` | 原样字符串（`"qr"` / `"password"`）。 |
| `ICQQ_DATA_DIR` | `data_dir` | 原样字符串。 |
| `ICQQ_HTTP_ACCESS_TOKEN` | `http[*].access_token` | 原样字符串；应用到**全部** HTTP API 服务端。 |
| `ICQQ_LOGIN_PROTOCOL` | `account.login_protocol` | 原样字符串（`"nt"` / `"wt"`）。 |
| `ICQQ_CAPTCHA_PORT` | `captcha_port` | 解析为端口整数；解析失败则忽略。 |

> 未设置的变量保留 `config.yaml` 的原值；设置了才覆盖。
