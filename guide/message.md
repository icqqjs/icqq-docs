# 消息与消息段

QQ 的一条消息可以包含文字、图片、@、表情等多种内容，icqq 把它们统一表示成**消息段**（`MessageElem`）。本页讲怎么**构造**要发的消息、怎么**解析**收到的消息。

## 核心概念：Sendable

所有发消息的方法（`sendMsg` / `reply` 等）接受的内容类型都是 `Sendable`：

```ts
type Sendable = string | MessageElem | (string | MessageElem)[];
```

也就是说，要发的内容可以是：

- **一段纯文本**：`"你好"`；
- **单个消息段**：`segment.image("cat.png")`；
- **数组混排**：把文本和多个段放进数组，按顺序拼成一条消息。

```js
// 假设 client 已登录
const group = client.pickGroup(<group_id>);

await group.sendMsg("纯文本");
await group.sendMsg(segment.face(66));
await group.sendMsg(["文本 + ", segment.image("https://example.com/cat.png")]);
```

## 用 segment 构造消息段

从 `@icqqjs/icqq` 导入 `segment`，用它的方法构造各种段：

```js
const { segment } = require("@icqqjs/icqq");
```

常用构造器：

| 构造器 | 说明 |
| --- | --- |
| `segment.text(text)` | 文本（也可直接用字符串代替）。 |
| `segment.at(qq, text?)` | @某人；`qq` 传 `"all"` 表示 @全体成员。 |
| `segment.face(id)` | QQ 经典表情，`id` 为表情编号。 |
| `segment.image(file, cache?, timeout?, headers?)` | 图片，`file` 支持本地路径、`http(s)://`、`base64://`、`Buffer`。 |
| `segment.record(file, data?)` | 语音，需要 ffmpeg；支持本地路径 / URL / `Buffer`。 |
| `segment.video(file, data?)` | 视频，需要 ffmpeg 和 ffprobe。 |
| `segment.json(data)` | JSON 卡片消息。 |
| `segment.xml(data, id?)` | XML 卡片消息。 |
| `segment.share(url, title, image?, content?, audio?)` | 链接分享。 |
| `segment.location(lat, lng, address, id?)` | 位置分享。 |
| `segment.poke(id)` | 戳一戳（`id` 0~6）。 |
| `segment.node(user_id, message, nickname?, time?, ...)` | 合并转发的一个节点。 |

> 引用回复**不是**通过消息段拼进数组，而是把收到的消息作为 `source` 参数传给发送方法，见下面的 [引用回复](#引用回复)。

组合示例（@某人 + 文本 + 图片）：

```js
await group.sendMsg([
  segment.at(<group_id>),     // @ 群里的某个成员
  " 看这张图：",
  segment.image("https://example.com/cat.png"),
]);
```

## 解析收到的消息

收到的消息事件里：

- `e.message` 是 `MessageElem[]`——已解析的消息段数组；
- `e.raw_message` 是文本化预览（方便日志和简单判断）。

遍历 `e.message` 按 `type` 处理：

```js
client.on("message", (e) => {
  for (const seg of e.message) {
    switch (seg.type) {
      case "text":
        console.log("文字:", seg.text);
        break;
      case "image":
        console.log("图片 url:", seg.url); // 收到的图片带 url 字段
        break;
      case "at":
        console.log("@了:", seg.qq);
        break;
      case "face":
        console.log("表情 id:", seg.id);
        break;
    }
  }
});
```

## 引用回复

要「引用某条消息并回复」，把**收到的消息事件**当作 `source`（类型为 `Quotable`）传给发送方法：

```js
client.on("message", async (e) => {
  // 直接用便捷方法（第二个参数 true 即引用本条）
  await e.reply("收到", true);

  // 或者手动调用 sendMsg，把 e 作为 source 传入
  await e.friend?.sendMsg("收到", e);
});
```

`Quotable` 需要的字段（`user_id`、`time`、`seq`、`rand`、`message`）收到的消息事件本身就带有，所以一般直接把事件对象传进去即可。

## 合并转发

合并转发是把多条消息打包成一个「聊天记录」卡片。先准备若干转发节点（`Forwardable`），用 `segment.node(...)` 构造，再用 `client.makeForwardMsg(...)` 生成可发送的消息：

```js
const nodes = [
  segment.node(<friend_id>, "第一条", "小明"),
  segment.node(<friend_id>, "第二条", "小红"),
];

const forward = await client.makeForwardMsg(nodes);
await client.pickGroup(<group_id>).sendMsg(forward);
```

更细的参数与变体（好友 / 群各自的 `makeForwardMsg`）见 [client API](/api/client) 与 [segment API](/api/segment)。

## 相关

- [消息段参考](/api/segment) —— 每个段的完整字段。
- [类型参考](/api/types) —— `Sendable`、`Quotable`、`Forwardable` 等类型定义。
