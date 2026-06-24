# 消息段类型参考

消息由一组**段（segment）**组成，每个段是 `{ "type": "xxx", "data": {...} }` 格式的对象。
发送消息时传段数组，收到消息时 `message` 字段也是段数组。

::: warning 不支持 CQ 码
发送时若 `message` 传字符串，会被当作**纯文本**，不会解析 `[CQ:...]`。事件里的 `raw_message` 也是纯文本（仅文本段拼接）。
:::

## 段类型一览

| 类型 | 说明 | 常用 |
| ---- | ---- | :--: |
| [`text`](#text-纯文本) | 纯文本 | ✓ |
| [`at`](#at-提及) | @某人 / @全体 | ✓ |
| [`face`](#face-sface-qq-表情) / `sface` | QQ 表情 | ✓ |
| [`image`](#image-flash-图片-flash-为闪照) / `flash` | 图片 / 闪照 | ✓ |
| [`reply`](#reply-quote-回复) / `quote` | 回复引用 | ✓ |
| [`record`](#record-语音) | 语音 | ✓ |
| [`video`](#video-bubble-视频-bubble-为气泡视频) / `bubble` | 视频 / 气泡视频 | |
| [`file`](#file-文件) | 文件 | |
| [`json`](#json-json-卡片) | JSON 卡片 | |
| [`xml`](#xml-xml-卡片) | XML 卡片 | |
| [`share`](#share-链接分享) | 链接分享 | |
| [`location`](#location-位置) | 位置 | |
| [`music`](#music-音乐分享) | 音乐分享（QQ音乐/网易云/自定义） | |
| [`contact`](#contact-推荐联系人) | 推荐联系人/群 | |
| [`poke`](#poke-戳一戳) | 戳一戳 | |
| [`mface`](#mface-商城表情-market-face) | 商城表情 | |
| [`bface`](#bface-原创表情) | 原创表情 | |
| [`rps`](#rps-dice-猜拳-骰子-魔法表情) / `dice` | 猜拳 / 骰子 | |
| [`markdown`](#markdown-markdown) | Markdown | |
| [`button`](#button-按钮) | 按钮 | |
| [`node`](#node-转发节点) | 转发节点（合并转发用） | |
| [`forward`](#forward-合并转发-已上传) | 合并转发引用 | |
| [`long_msg`](#其它段) | 长消息引用 | |
| [`mirai`](#其它段) | mirai 数据透传 | |
| [`forum`](#其它段) | 论坛/帖子 | |

> 未识别的段类型会原样透传为 `Unknown`，不会丢失。

---

## text —— 纯文本

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `text` | string | 文本内容。 |

```json
{ "type": "text", "data": { "text": "你好世界" } }
```

## at —— 提及

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `qq` | string | 被 @ 的 QQ 号；`"all"` 表示全体成员。 |
| `id` | string | 频道场景下的 guild tiny_id（非 `0`/空时优先于 `qq`）。 |
| `text` | string | 可选，@ 的展示文本。 |
| `dummy` | bool | 可选。 |

```json
{ "type": "at", "data": { "qq": "<friend_id>" } }
```

## face / sface —— QQ 表情

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `id` | int | 表情 id。 |
| `text` | string | 可选，表情文字。 |
| `big` | bool | 可选，是否大表情。 |
| `stickerId` | string | 可选，超级表情贴纸 id。 |
| `stickerType` | int | 可选，贴纸类型。 |

```json
{ "type": "face", "data": { "id": 4 } }
```

## bface —— 原创表情

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `file` | string | 表情文件标识。 |
| `text` | string | 表情文字。 |

```json
{ "type": "bface", "data": { "file": "<file>", "text": "[斗图]" } }
```

## rps / dice —— 猜拳 / 骰子（魔法表情）

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `id` | int | 可选，点数/结果。 |

```json
{ "type": "dice", "data": {} }
```

## image / flash —— 图片（`flash` 为闪照）

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `file` | string | 图片来源（路径 / URL / base64 / 已上传 fid）。 |
| `url` | string | 可选，图片 URL。 |
| `cache` | bool | 可选，是否使用缓存。 |
| `timeout` | int | 可选，下载超时（秒）。 |
| `name` | string | 可选，文件名。 |
| `asface` | bool | 可选，是否作为表情发送。 |
| `origin` | bool | 可选，是否原图。 |
| `summary` | string | 可选，图片摘要/描述。 |
| `fid` | string | 可选，已上传文件标识。 |
| `md5` / `sha1` | string | 可选，校验值。 |
| `height` / `width` | int | 可选，像素尺寸。 |
| `size` | int | 可选，字节大小。 |
| `nt` | bool | 可选，是否走 NT 媒体通道。 |

```json
{ "type": "image", "data": { "file": "https://example.com/a.jpg" } }
```

## reply / quote —— 回复

`quote` 是 `reply` 的别名。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `id` | string | 被回复消息的 `message_id`。 |
| `text` | string | 可选，回复展示文本。 |

```json
{ "type": "reply", "data": { "id": "<message_id>" } }
```

## record —— 语音

### 版本变化

| 版本 | 变化 |
| --- | --- |
| `v0.4.0` | 新增转码参数 `sr`、`bps`；旧版本会忽略这些字段并使用内置转码参数。 |

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `file` | string | 语音来源。 |
| `url` | string | 可选，语音 URL。 |
| `name` | string | 可选，文件名。 |
| `fid` | string | 可选，已上传标识。 |
| `md5` / `sha1` | string | 可选，校验值。 |
| `size` | int | 可选，字节大小。 |
| `seconds` | int | 可选，时长（秒）。 |
| `transcode` | bool | 可选，是否转码（需 ffmpeg）。 |
| `sr` | int | 可选，转码采样率。支持 `8000` / `12000` / `16000` / `24000`，默认 `24000`。 |
| `bps` | int | 可选，转码目标码率（bits/s），默认 `34500`。 |
| `temp` / `nt` | bool | 可选。 |

```json
{ "type": "record", "data": { "file": "/path/to/voice.mp3", "sr": 24000, "bps": 34500 } }
```

## video / bubble —— 视频（`bubble` 为气泡视频）

字段与 `record` 同族（媒体元素），另含 `width` / `height` / `brief`。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `file` | string | 视频来源。 |
| `url` | string | 可选，视频 URL。 |
| `width` / `height` | int | 可选，分辨率。 |
| `seconds` | int | 可选，时长（秒）。 |
| `size` | int | 可选，字节大小。 |
| `brief` | string | 可选，摘要。 |
| `md5` / `sha1` / `fid` / `name` | string | 可选。 |
| `transcode` / `temp` / `nt` | bool | 可选。 |

```json
{ "type": "video", "data": { "file": "/path/to/clip.mp4" } }
```

## file —— 文件

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `file` | string | 文件来源。 |
| `name` | string | 可选，文件名。 |
| `fid` | string | 可选，已上传标识。 |
| `md5` / `sha1` | string | 可选，校验值。 |
| `size` | int | 可选，字节大小。 |
| `duration` | int | 可选。 |
| `temp` | bool | 可选。 |

```json
{ "type": "file", "data": { "file": "/path/to/doc.pdf", "name": "doc.pdf" } }
```

## json —— JSON 卡片

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `data` | object/string | JSON 卡片内容（原样透传）。 |

```json
{ "type": "json", "data": { "data": { "app": "com.tencent.miniapp" } } }
```

## xml —— XML 卡片

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `data` | string | XML 内容。 |
| `id` | int | 可选，服务 id。 |

```json
{ "type": "xml", "data": { "data": "<msg>...</msg>" } }
```

## share —— 链接分享

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `url` | string | 分享链接。 |
| `title` | string | 标题。 |
| `image` | string | 可选，封面图。 |
| `content` | string | 可选，描述。 |
| `audio` | string | 可选，音频。 |

```json
{ "type": "share", "data": { "url": "https://example.com", "title": "标题" } }
```

## location —— 位置

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `lat` | float | 纬度。 |
| `lng` | float | 经度。 |
| `address` | string | 地址。 |
| `name` | string | 可选，地点名。 |
| `id` | string | 可选，地点 id。 |

```json
{ "type": "location", "data": { "lat": 39.9, "lng": 116.3, "address": "北京" } }
```

## music —— 音乐分享

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `type` | string | 平台：`qq` / `163` / `custom` / …（缺省 `qq`）。 |
| `id` | string | 平台音乐 id（非 custom 时）。 |
| `url` | string | custom：跳转链接。 |
| `audio` | string | custom：音频直链。 |
| `title` | string | custom：标题。 |
| `content` | string | custom：描述。 |
| `image` | string | custom：封面。 |

```json
{ "type": "music", "data": { "type": "163", "id": "<music_id>" } }
```

## contact —— 推荐联系人

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `type` | string | `qq` 或 `group`。 |
| `id` | string | 被推荐的 QQ 号或群号。 |

```json
{ "type": "contact", "data": { "type": "group", "id": "<group_id>" } }
```

## poke —— 戳一戳

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `id` | int | 戳一戳类型 id。 |
| `text` | string | 可选，文字。 |

```json
{ "type": "poke", "data": { "id": 1 } }
```

## mface —— 商城表情（market face）

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `emoji_package_id` | int | 表情包 id（亦接受 `package_id`）。 |
| `emoji_id` | string | 表情 id（亦接受 `face_id`）。 |
| `key` | string | 表情 key。 |
| `summary` | string | 摘要（亦接受 `text`）。 |

```json
{
  "type": "mface",
  "data": {
    "emoji_package_id": 1357,
    "emoji_id": "0123456789abcdef",
    "key": "deadbeef",
    "summary": "[暗示]"
  }
}
```

## markdown —— Markdown

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `content` | string | Markdown 内容。 |
| `config` | object | 可选，配置。 |

```json
{ "type": "markdown", "data": { "content": "# 标题" } }
```

## button —— 按钮

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `content` | object | 按钮内容（原样透传）。 |

## node —— 转发节点

用于构造合并转发。字段命名兼容 OneBot 11、go-cqhttp 与 NapCat。

### 版本变化

| 版本 | 变化 |
| ---- | ---- |
| `v0.1.12` | 支持 `uin`、`name`、`message` 别名；缺省或为 `0` 的 `time` 改为当前 Unix 秒时间戳。 |

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `user_id` / `uin` | int | 节点作者 QQ 号；缺省或为 `0` 时使用机器人账号。 |
| `nickname` / `name` | string | 可选，作者昵称；缺省时使用作者 QQ 号文本。 |
| `content` / `message` | array / object / string | 子消息内容。 |
| `time` | int | 可选，Unix 秒时间戳；缺省或为 `0` 时使用当前时间。 |
| `seq` / `rand` | int | 可选；缺省时自动生成。 |
| `preview` | string | 可选，该节点在外层卡片中的预览文本。 |

```json
{
  "type": "node",
  "data": {
    "user_id": 10001,
    "nickname": "Alice",
    "content": [{ "type": "text", "data": { "text": "转发内容" } }]
  }
}
```

## forward —— 合并转发（已上传）

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `id` / `resid` | string | 转发资源 id。 |
| `filename` | string | 可选。 |
| `title` | string | 可选。 |
| `content` | string | 可选。 |
| `preview` | array | 可选，预览行。 |
| `prompt` | string | 可选。 |

```json
{ "type": "forward", "data": { "id": "<resid>" } }
```

## 其它段

| type | 主要字段 | 说明 |
| ---- | ---- | ---- |
| `long_msg` | `resid` | 长消息引用。 |
| `mirai` | `data` | mirai 私有数据透传。 |
| `forum` | `id`, `create_time` | 论坛/帖子。 |

> 未识别的 `type` 会原样透传为 `Unknown`（保留其 `type` 与 `data`），不会丢失。
