# 消息段 segment

一条消息不只是纯文本，还可能包含图片、@、表情、语音、视频等。icqq 用「消息段」（element）来表示这些片段，`segment` 对象就是用来**构造**这些片段的工具集。

## Sendable 与 segment 的关系

发送方法（如 `friend.sendMsg`、`group.sendMsg`）接收的类型是 `Sendable`：

```ts
type Sendable = string | MessageElem | (string | MessageElem)[]
```

也就是说，你可以传：

- 一个字符串（等价于纯文本）；
- 一个消息段对象（用 `segment.xxx(...)` 构造）；
- 以上两者混合的数组（拼成一条图文消息）。

```js
const { segment } = require("@icqqjs/icqq")

await client.pickGroup(<group_id>).sendMsg([
  "看这张图：",
  segment.image("https://example.com/cat.png"),
  segment.at(<friend_id>)
])
```

> 收到的消息里，`e.message` 同样是消息段数组（`MessageElem[]`），每个元素带 `type` 字段。各段「收到时」的形态见下方每个条目。
>
> 更系统的讲解见 [消息与消息段](/guide/message)。各消息段对象的完整字段表见 [核心类型](/api/types)。

::: tip 哪些能组合发送
只有可组合的消息段才能放在同一个数组里一起发（文本、表情、图片、AT、markdown、button、引用、转发节点等）。语音、视频、JSON、XML、文件、位置等**只能单独发送**，不要和别的段拼在一个数组里。
:::

---

## 文本 `segment.text`

- 构造: `segment.text(text)`
- 类型: `TextElem`

> 文本可以直接用字符串代替，一般不需要显式调用 `segment.text`。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `text` | `string` | 是 | - | 文字内容。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg(segment.text("你好"))
// 等价于直接写：
await client.pickGroup(<group_id>).sendMsg("你好")
```

### 收到时

在 `e.message` 里表现为 `{ type: "text", text: "你好" }`。

---

## @提及 `segment.at`

- 构造: `segment.at(qq, text?, dummy?)`
- 类型: `AtElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `qq` | `number \| "all" \| string` | 是 | - | 要 @ 的 QQ 号；`"all"` 表示 @全体成员；在频道里传 `tiny_id`（字符串）。 |
| `text` | `string` | 否 | - | @ 后跟随显示的文字。 |
| `dummy` | `boolean` | 否 | - | 假 @（只显示文字不真正提醒）。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg([
  segment.at(<friend_id>),
  " 在吗？"
])
// @全体成员
await client.pickGroup(<group_id>).sendMsg([segment.at("all"), " 集合"])
```

### 收到时

表现为 `{ type: "at", qq, text }`；@全体时 `qq` 为 `"all"`，频道中 `qq` 为 `0` 且带 `id`（tiny_id）。

---

## 经典表情 `segment.face`

- 构造: `segment.face(id, big?)`
- 类型: `FaceElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 是 | - | 表情 id，范围约 `0~324`。 |
| `big` | `boolean` | 否 | `true` | 是否作为超级（大）表情发送。 |

### 构造示例

```js
await client.pickFriend(<friend_id>).sendMsg(segment.face(4))
```

### 收到时

表现为 `{ type: "face", id, text? }`，`text` 是表情说明。

---

## 小表情 `segment.sface`

- 构造: `segment.sface(id, text?)`
- 类型: `FaceElem`（`type` 为 `"sface"`）

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 是 | - | 小表情 id（规则不明）。 |
| `text` | `string` | 否 | - | 表情说明。 |

### 收到时

表现为 `{ type: "sface", id, text? }`。

---

## 原创表情 `segment.bface`

- 构造: `segment.bface(file, text)`
- 类型: `BfaceElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string` | 是 | - | 暂时只能发收到的 `file`。 |
| `text` | `string` | 是 | - | 表情说明。 |

### 收到时

表现为 `{ type: "bface", file, text }`。

---

## 图片 `segment.image`

- 构造: `segment.image(file, cache?, timeout?, headers?)`
- 类型: `ImageElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string \| Buffer \| Readable` | 是 | - | 本地路径、`http(s)://` URL、`base64://...`、`Buffer` 或可读流。 |
| `cache` | `boolean` | 否 | - | 是否缓存远程图片。 |
| `timeout` | `number` | 否 | `60` | 读取流的超时秒数。 |
| `headers` | `OutgoingHttpHeaders` | 否 | - | 下载远程图片时附带的请求头。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg([
  "看图：",
  segment.image("https://example.com/cat.png")
])
// 本地文件
await client.pickGroup(<group_id>).sendMsg(segment.image("/tmp/1.jpg"))
```

### 收到时

表现为 `{ type: "image", file, url, ... }`，可用 `url` 字段下载原图。

---

## 闪照 `segment.flash`

- 构造: `segment.flash(file, cache?, timeout?, headers?)`
- 类型: `FlashElem`

参数同 [`segment.image`](#图片-segment-image)，区别是发出去的是「闪照」。

### 构造示例

```js
await client.pickFriend(<friend_id>).sendMsg(segment.flash("/tmp/secret.jpg"))
```

### 收到时

表现为 `{ type: "flash", ... }`。

---

## 语音 `segment.record`

- 构造: `segment.record(file, data?)`
- 类型: `PttElem`

::: warning 依赖
非 `silk`/`amr` 的音频文件需要本机安装 `ffmpeg` 进行转码。
:::

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string \| Buffer` | 是 | - | 本地路径、`http(s)://`、`base64://...` 或 `Buffer`；支持 raw silk / amr。 |
| `data` | `Partial<PttElem>` | 否 | `{}` | 附加项，例如 `seconds`（时长）、`transcode`（是否转码，默认 `true`）、`temp`（发送后删除文件）。 |

### 构造示例

```js
await client.pickFriend(<friend_id>).sendMsg(segment.record("/tmp/hello.mp3"))
```

### 收到时

表现为 `{ type: "record", url, seconds, ... }`，`url` 可用于下载语音。

---

## 视频 `segment.video`

- 构造: `segment.video(file, data?)`
- 类型: `VideoElem`

::: warning 依赖
发送视频需要本机安装 `ffmpeg` 和 `ffprobe`（用于抽取封面与读取时长等信息）。
:::

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `file` | `string \| Buffer` | 是 | - | 本地路径、`http(s)://`、`base64://...` 或 `Buffer`。 |
| `data` | `Partial<VideoElem>` | 否 | `{}` | 附加项，例如 `name`、`temp`（发送后删除文件）。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg(segment.video("/tmp/clip.mp4"))
```

### 收到时

表现为 `{ type: "video", file, fid, url?, seconds, ... }`。

---

## 链接分享 `segment.share`

- 构造: `segment.share(url, title, image?, content?, audio?)`
- 类型: `ShareElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `url` | `string` | 是 | - | 跳转地址，缺失则发不出。 |
| `title` | `string` | 是 | - | 分享标题。 |
| `image` | `string` | 否 | - | 预览图网址。 |
| `content` | `string` | 否 | - | 消息列表里看到的描述文字。 |
| `audio` | `string` | 否 | - | 音频地址（用于音乐分享）。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg(
  segment.share("https://example.com", "标题", "https://example.com/cover.png", "一段描述")
)
```

### 收到时

通常表现为 `{ type: "json", data }`（客户端把分享渲染为卡片）。

---

## 位置分享 `segment.location`

- 构造: `segment.location(lat, lng, address, id?)`
- 类型: `LocationElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `lat` | `number` | 是 | - | 纬度。 |
| `lng` | `number` | 是 | - | 经度。 |
| `address` | `string` | 是 | - | 地址描述。 |
| `id` | `string` | 否 | - | 位置 id。 |

### 构造示例

```js
await client.pickFriend(<friend_id>).sendMsg(
  segment.location(39.908, 116.397, "北京市天安门")
)
```

---

## JSON 消息 `segment.json`

- 构造: `segment.json(data)`
- 类型: `JsonElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `any` | 是 | - | JSON 卡片数据，可以是对象或 JSON 字符串。 |

### 构造示例

```js
await client.pickGroup(<group_id>).sendMsg(segment.json({ /* 卡片结构 */ }))
```

### 收到时

表现为 `{ type: "json", data }`。

---

## XML 消息 `segment.xml`

- 构造: `segment.xml(data, id?)`
- 类型: `XmlElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `string` | 是 | - | XML 字符串。 |
| `id` | `number` | 否 | - | 服务类型 id。 |

### 收到时

表现为 `{ type: "xml", data, id? }`。

---

## 戳一戳 `segment.poke`

- 构造: `segment.poke(id)`
- 类型: `PokeElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 是 | - | 戳一戳类型，`0~6`。 |

### 构造示例

```js
await client.pickFriend(<friend_id>).sendMsg(segment.poke(0))
```

---

## 转发节点 `segment.node` / `segment.fake`

- 构造: `segment.node(user_id, message, nickname?, time?, seq?, rand?, preview?)`
- 别名: `segment.fake(user_id, message, nickname?, time?)`
- 类型: `ForwardNodeElem`

用来拼「合并转发」的每一条子消息（伪造发言人）。

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `user_id` | `number` | 是 | - | 这条子消息的发言人账号。 |
| `message` | `Sendable` | 是 | - | 这条子消息的内容。 |
| `nickname` | `string` | 否 | - | 显示的昵称。 |
| `time` | `number` | 否 | - | 显示的时间（秒）。 |
| `seq` / `rand` / `preview` | `number` / `number` / `string` | 否 | - | 其他可选项（`node` 独有）。 |

### 构造示例

```js
const nodes = [
  segment.node(<friend_id>, "第一条", "小明"),
  segment.node(<friend_id>, "第二条", "小明")
]
// 配合 client.makeForwardMsg 生成转发消息后再发送
const forward = await client.makeForwardMsg(nodes)
await client.pickGroup(<group_id>).sendMsg(forward)
```

---

## Markdown `segment.markdown`

- 构造: `segment.markdown(content, config?)`
- 类型: `MarkdownElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `string` | 是 | - | Markdown 文本。 |
| `config` | `{ unknown?: number; time: number; token: string }` | 否 | - | 附加配置。 |

> Markdown / Button 一般用于机器人场景，普通账号可能无法正常显示。

---

## Button `segment.button`

- 构造: `segment.button(content)`
- 类型: `ButtonElem`

### 参数

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `{ appid: number; rows: { buttons: Button[] }[] }` | 是 | - | 按钮键盘结构，`rows` 每个元素表示一行按钮。 |

> 按钮（`Button`）的详细字段较多，结构见 [核心类型](/api/types)。

---

## 猜拳 `segment.rps` / 骰子 `segment.dice`

- 构造: `segment.rps(id?)` / `segment.dice(id?)`
- 类型: `MfaceElem`

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `number` | 否 | - | `rps`（猜拳）`1~3`；`dice`（骰子）`1~6`；留空则随机。 |

### 构造示例

```js
await client.pickFriend(<friend_id>).sendMsg(segment.dice())
```

---

## 特殊消息 `segment.mirai`

- 构造: `segment.mirai(data)`
- 类型: `MiraiElem`

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `string` | 是 | - | 自定义携带数据（官方客户端无法解析，常用于程序间约定）。 |

---

## 长消息 `segment.long_msg`

- 构造: `segment.long_msg(resid)`
- 类型: `LongMsgElem`

| 参数 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `resid` | `string` | 是 | - | 长消息资源 id。 |

> 属于较底层的用法，普通收发一般用不到。

### 相关

[消息与消息段](/guide/message) · [核心类型](/api/types) · [事件类型参考](/api/events)
