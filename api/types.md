# 核心类型

本页讲解你在收发消息时最常打交道的那些类型：**「我要传给方法的对象」** 长什么样，**「我收到的对象」** 又长什么样。所有类型都可从 `@icqqjs/icqq` 引入（`import type`）。

---

## Sendable

发送方法（`sendMsg` 等）接收的内容类型：

```ts
type Sendable = string | MessageElem | (string | MessageElem)[]
```

- 字符串：当作纯文本。
- 单个消息段：用 [`segment.xxx(...)`](/api/segment) 构造。
- 数组：把字符串和消息段拼成一条图文消息。

```js
await client.pickFriend(<friend_id>).sendMsg([
  "你好 ",
  segment.at(<friend_id>),
  segment.image("/tmp/1.jpg")
])
```

---

## MessageElem

收到的消息里，`e.message` 是 `MessageElem[]`，每个元素是下面这些接口之一，靠 `type` 字段区分。发送时你也可以直接传这些对象（一般用 `segment` 构造更方便）。

下面按类型逐个列出字段（标「接收时有效」的字段是对方发来时才会带上）。

### TextElem 文本

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"text"` | 固定值。 |
| `text` | `string` | 文字内容。 |

### AtElem @提及

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"at"` | 固定值。 |
| `qq` | `number \| "all"` | 被 @ 的账号；`"all"` 为全体；频道消息中为 `0`。 |
| `id` | `string \| "all"` | 频道中的 `tiny_id`。 |
| `text` | `string` | @ 后跟随的文字（接收时有效）。 |
| `dummy` | `boolean` | 是否为假 @。 |

### FaceElem 表情

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"face" \| "sface"` | 经典表情 / 小表情。 |
| `id` | `number` | 表情 id（face 约 `0~324`）。 |
| `text` | `string` | 表情说明（接收时有效）。 |
| `big` | `boolean` | 是否超级表情。 |

### ImageElem 图片

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"image"` | 固定值。 |
| `file` | `string \| Buffer \| Readable` | 发送时：本地路径 / URL / base64 / Buffer / 流。 |
| `cache` | `boolean` | 网络图片是否使用缓存。 |
| `timeout` | `number` | 流超时时间（秒），默认 `60`。 |
| `url` | `string` | 图片地址（接收时有效，用于下载）。 |
| `name` | `string` | 图片名（接收时有效）。 |
| `summary` | `string` | 图片概要。 |
| `asface` | `boolean` | 是否作为表情发送。 |
| `origin` | `boolean` | 是否显示「查看原图」。 |
| `md5` / `sha1` | `string` | 校验值（接收时有效）。 |
| `width` / `height` | `number` | 宽高（接收时有效）。 |
| `size` | `number` | 大小（接收时有效）。 |

> `FlashElem`（闪照）字段与 `ImageElem` 相同，仅 `type` 为 `"flash"`。

### PttElem 语音

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"record"` | 固定值。 |
| `file` | `string \| Buffer` | 发送时：本地路径 / Buffer（支持 silk / amr）。 |
| `url` | `string` | 语音地址（接收时有效）。 |
| `seconds` | `number` | 时长（秒）。 |
| `size` | `number` | 大小（接收时有效）。 |
| `transcode` | `boolean` | 是否转码，默认 `true`。 |
| `temp` | `boolean` | 发送后是否删除源文件。 |
| `md5` / `sha1` | `string` | 校验值。 |

### VideoElem 视频

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"video"` | 固定值。 |
| `file` | `string \| Buffer` | 发送时：本地路径 / Buffer。 |
| `name` | `string` | 视频名（接收时有效）。 |
| `fid` | `string` | 作为文件的 id（接收时有效）。 |
| `seconds` | `number` | 时长（秒，接收时有效）。 |
| `width` / `height` | `number` | 宽高。 |
| `size` | `number` | 大小（接收时有效）。 |
| `temp` | `boolean` | 发送后是否删除源文件。 |

### ShareElem 互联分享

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"share"` | 固定值。 |
| `url` | `string` | 跳转地址（必填）。 |
| `title` | `string` | 标题。 |
| `summary` | `string` | 描述。 |
| `content` | `string` | 消息列表中显示的文字。 |
| `image` | `string` | 预览图地址。 |
| `audio` | `string` | 音频地址。 |
| `config` | `ShareConfig` | 分享 app 配置。 |

### LocationElem 位置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"location"` | 固定值。 |
| `address` | `string` | 地址描述。 |
| `lat` | `number` | 纬度。 |
| `lng` | `number` | 经度。 |
| `name` | `string` | 名称。 |
| `id` | `string` | 位置 id。 |

### JsonElem / XmlElem 卡片

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"json"` | JSON 卡片。 |
| `data` | `any` | 卡片数据。 |

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"xml"` | XML 卡片。 |
| `data` | `string` | XML 字符串。 |
| `id` | `number` | 服务类型 id。 |

### PokeElem 戳一戳

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"poke"` | 固定值。 |
| `id` | `number` | 类型 `0~6`。 |
| `text` | `string` | 动作描述。 |

### MiraiElem 特殊消息

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"mirai"` | 固定值。 |
| `data` | `string` | 自定义携带数据（官方客户端无法解析）。 |

### FileElem 文件

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"file"` | 固定值。 |
| `file` | `string \| Buffer` | 发送时：本地路径 / Buffer。 |
| `name` | `string` | 文件名。 |
| `fid` | `string` | 文件 id。 |
| `size` | `number` | 大小。 |
| `md5` / `sha1` | `string` | 校验值。 |
| `duration` | `number` | 存在时间。 |
| `temp` | `boolean` | 发送后是否删除源文件。 |

### ReplyElem / QuoteElem 引用回复

`QuoteElem` 是收到消息里表示「引用了某条消息」的段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"quote"` | 固定值。 |
| `user_id` | `number` | 被引用消息的发送者。 |
| `time` | `number` | 时间（秒）。 |
| `seq` | `number` | 序号。 |
| `rand` | `number` | 随机标识。 |
| `message` | `Sendable` | 被引用的消息内容。 |

> `ReplyElem`（`type: "reply"`，带 `id`）是旧版兼容形式，新代码用 [`Quotable`](#quotable) 引用回复。

### ForwardNodeElem 转发节点

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"node"` | 固定值。 |
| `user_id` | `number` | 发言人账号。 |
| `message` | `Sendable` | 这条子消息内容。 |
| `nickname` | `string` | 显示昵称。 |
| `time` | `number` | 显示时间（秒）。 |

> 用 [`segment.node(...)`](/api/segment#转发节点-segment-node-segment-fake) 构造，配合 `client.makeForwardMsg` 生成合并转发消息。

---

## Quotable

引用回复时传给 `sendMsg(content, source)` 的 `source` 对象。一般直接把收到的消息事件传进去即可。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `user_id` | `number` | 被引用消息的发送方账号。 |
| `time` | `number` | 时间（秒）。 |
| `seq` | `number` | 序号。 |
| `rand` | `number` | 随机标识（私聊回复必须有）。 |
| `message` | `Sendable` | 被引用的消息内容。 |

```js
client.on("message.group", (e) => {
  // e 本身满足 Quotable，可直接作为引用源
  e.reply("收到", true)
})
```

---

## Forwardable

构造合并转发节点时的内容，对应 `segment.node` 的参数集合。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `user_id` | `number` | 发送方账号。 |
| `message` | `Sendable` | 发送的消息。 |
| `nickname` | `string` | 发送方昵称。 |
| `time` | `number` | 发送时间（秒）。 |
| `seq` / `rand` | `number` | 可选标识。 |
| `preview` | `string` | 预览文字。 |

---

## MessageRet

发送消息成功后的返回值。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `message_id` | `string` | 消息 id，用于撤回 / 引用。**是字符串，不要当数字解析。** |
| `seq` | `number` | 消息序号。 |
| `rand` | `number` | 随机标识。 |
| `time` | `number` | 发送时间（秒）。 |

---

## Config

`createClient(config)` 的配置项，全部可选。

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `platform` | `Platform` | `Android` | 登录设备，见 [枚举](/api/enums#platform-登录设备)。 |
| `ver` | `string` | - | 使用的版本（同一 platform 有多个版本时有效）。 |
| `log_level` | `LogLevel` | `"info"` | 日志等级。 |
| `data_dir` | `string` | `主模块下的 data/` | 数据存储目录，需可写权限。 |
| `sign_api_addr` | `string` | - | 签名服务器地址。**未配置可能导致登录失败和无法收发消息。** |
| `ignore_self` | `boolean` | `true` | 群聊 / 频道中过滤自己发的消息。 |
| `resend` | `boolean` | `false` | 被风控时是否尝试分片发送。 |
| `reconn_interval` | `number` | `5` | 掉线后重连间隔（秒），`0` 表示不自动重连。 |
| `cache_group_member` | `boolean` | `true` | 是否缓存群员列表（群多时占内存）。 |
| `auto_server` | `boolean` | `true` | 是否自动选择最优服务器。 |
| `ffmpeg_path` | `string` | - | `ffmpeg` 可执行路径。 |
| `ffprobe_path` | `string` | - | `ffprobe` 可执行路径。 |

```js
const { createClient, Platform } = require("@icqqjs/icqq")
const client = createClient({
  platform: Platform.Android,
  sign_api_addr: "<your_sign_api_addr>",
  log_level: "info"
})
```

---

## 资料类型

获取好友 / 群 / 成员 / 陌生人信息时返回的对象。

### StrangerInfo 陌生人

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `user_id` | `number` | 账号。 |
| `nickname` | `string` | 昵称。 |

### FriendInfo 好友

继承 `StrangerInfo`，额外有：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sex` | `Gender` | 性别。 |
| `remark` | `string` | 备注。 |
| `class_id` | `number` | 分组 id。 |
| `user_uid` | `string` | 好友 uid。 |

### GroupInfo 群

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `group_id` | `number` | 群号。 |
| `group_name` | `string` | 群名。 |
| `member_count` | `number` | 群员数。 |
| `max_member_count` | `number` | 群员上限。 |
| `owner_id` | `number` | 群主账号。 |
| `admin_flag` | `boolean` | 自己是否为该群管理员。 |
| `last_join_time` | `number` | 上次入群时间。 |
| `last_sent_time` | `number` | 上次发言时间。 |
| `shutup_time_whole` | `number` | 全员禁言时间。 |
| `shutup_time_me` | `number` | 自己被禁言时间。 |
| `create_time` | `number` | 群创建时间。 |
| `grade` | `number` | 群活跃等级。 |
| `max_admin_count` | `number` | 管理员上限。 |
| `active_member_count` | `number` | 在线群员数。 |
| `update_time` | `number` | 群信息更新时间。 |

### MemberInfo 群员

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `group_id` | `number` | 所在群号。 |
| `user_id` | `number` | 群员账号。 |
| `nickname` | `string` | 昵称。 |
| `card` | `string` | 群名片。 |
| `sex` | `Gender` | 性别。 |
| `age` | `number` | 年龄。 |
| `area` | `string` | 地区。 |
| `join_time` | `number` | 入群时间。 |
| `last_sent_time` | `number` | 上次发言时间。 |
| `level` | `number` | 聊天等级。 |
| `rank` | `string` | 聊天排名。 |
| `role` | `GroupRole` | 群权限（`owner` / `admin` / `member`）。 |
| `title` | `string` | 头衔。 |
| `title_expire_time` | `number` | 头衔到期时间。 |
| `shutup_time` | `number` | 被禁言时间。 |
| `update_time` | `number` | 信息更新时间。 |
| `user_uid` | `string` | 群员 uid。 |

### 相关

[消息段 segment](/api/segment) · [事件类型参考](/api/events) · [枚举与常量](/api/enums)
