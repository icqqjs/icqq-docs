# 基本概念

本页面帮你理解 icqq-rust-onebot 的通信机制。如果你之前没用过 OneBot 协议，建议从这里开始。

## 整体架构

```
你的程序（Bot）  ←──HTTP / WebSocket──→  icqq-rust-onebot  ←──QQ协议──→  腾讯服务器
```

icqq-rust-onebot 是一个**中间层**：它一边跟 QQ 服务器通信（登录、收发消息），一边通过标准的 HTTP/WebSocket 接口跟你的程序交互。你的程序不需要关心 QQ 协议的细节。

## Action（动作）—— 你告诉 Bot 做事

当你想让 Bot 做一件事（发消息、踢人、获取群列表……），你向 Bot 发送一个 **action 请求**。

**HTTP 方式**（最简单）：直接 POST 到对应的路径。

```bash
# 发送群消息
curl -X POST http://127.0.0.1:5700/send_group_msg \
  -H "Content-Type: application/json" \
  -d '{"group_id": 123456, "message": [{"type":"text","data":{"text":"你好"}}]}'
```

Bot 会返回一个 JSON 响应：

```json
{
  "status": "ok",
  "retcode": 0,
  "data": {
    "message_id": "eJx..."
  }
}
```

- `status`: `"ok"` 表示成功，`"failed"` 表示失败
- `retcode`: `0` 表示成功，非零表示错误（如 `1400` 参数错误、`1404` API 不存在）
- `data`: 返回的数据（不同 API 返回不同内容）

**WebSocket 方式**：通过 WebSocket 连接发送 JSON 消息。

```json
{
  "action": "send_group_msg",
  "params": {
    "group_id": 123456,
    "message": [{"type":"text","data":{"text":"你好"}}]
  },
  "echo": "my-request-1"
}
```

## Event（事件）—— Bot 告诉你发生了什么

当有人给 Bot 发消息、有人加群、有人撤回消息……Bot 会把这些事件**推送**给你。

推送方式取决于你的配置：

- **HTTP POST**：Bot 向你配置的 `post_url` 发 POST 请求
- **WebSocket**：Bot 通过已建立的 WS 连接直接推送

一条群消息事件长这样：

```json
{
  "post_type": "message",
  "message_type": "group",
  "group_id": 123456,
  "user_id": 654321,
  "message": [
    {"type": "text", "data": {"text": "大家好"}}
  ],
  "raw_message": "大家好",
  "message_id": "eJx...",
  "sender": {
    "user_id": 654321,
    "nickname": "张三",
    "card": "群名片"
  }
}
```

事件分四大类：

- **message** —— 收到消息（私聊、群聊）
- **notice** —— 通知（撤回、禁言、成员变动、戳一戳……）
- **request** —— 请求（好友申请、入群申请）
- **meta_event** —— 元事件（心跳、生命周期）

完整事件列表见[事件参考](./events/)。

## echo —— WebSocket 请求的关联标记

用 HTTP 时，一个请求对应一个响应，很直接。但用 **WebSocket** 时，action 请求和 event 推送走的是同一条连接——你发了一个请求，Bot 的响应可能夹在好几条 event 中间回来。

**`echo` 就是用来把请求和响应对应起来的**。

### 实际场景

假设你用 WebSocket 写了一个 Bot，群里有人发了一条消息 `"转发给小明"`，你的代码需要：

1. 收到群消息事件
2. 调用 `send_private_msg` 把消息转发给小明
3. 拿到发送结果（成功还是失败）

在 WebSocket 连接上，你会看到这样的数据流：

```
── 时间线 ──────────────────────────────────────────────────

Bot → 你：  事件 — 群消息 "转发给小明"
你 → Bot：  请求 — send_private_msg，echo: "fwd-1"

Bot → 你：  事件 — 另一个群里有人说话（跟你的请求无关）
Bot → 你：  事件 — 心跳
Bot → 你：  响应 — send_private_msg 结果，echo: "fwd-1"  ← 匹配！
```

代码里怎么写？

::: code-group

```javascript [Node.js]
import WebSocket from "ws";

const ws = new WebSocket("ws://127.0.0.1:6700");

// 存放待回调的请求
const pending = new Map();

ws.on("message", (raw) => {
  const data = JSON.parse(raw.toString());

  if (data.echo) {
    // 这是一条 action 响应——按 echo 找到对应的回调
    const resolve = pending.get(data.echo);
    if (resolve) {
      resolve(data);
      pending.delete(data.echo);
    }
    return;
  }

  // 没有 echo 的就是事件推送
  if (data.post_type === "message" && data.raw_message === "转发给小明") {
    // 把这条消息的内容转发给小明
    callAction("send_private_msg", {
      user_id: "<friend_id>",
      message: data.message,
    }).then((result) => {
      if (result.status === "ok") {
        console.log("转发成功！");
      }
    });
  }
});

// 封装：发送 action 并等待响应
let echoId = 0;
function callAction(action, params) {
  return new Promise((resolve) => {
    const echo = `req-${++echoId}`;
    pending.set(echo, resolve);
    ws.send(JSON.stringify({ action, params, echo }));
  });
}
```

```python [Python]
import asyncio, json
import websockets

pending = {}
echo_id = 0

async def main():
    async with websockets.connect("ws://127.0.0.1:6700") as ws:
        async for raw in ws:
            data = json.loads(raw)

            if "echo" in data and data["echo"] in pending:
                # 这是一条 action 响应——按 echo 找到对应的 future
                pending.pop(data["echo"]).set_result(data)
                continue

            # 没有 echo 的就是事件推送
            if data.get("post_type") == "message" and data.get("raw_message") == "转发给小明":
                result = await call_action(ws, "send_private_msg", {
                    "user_id": "<friend_id>",
                    "message": data["message"],
                })
                if result["status"] == "ok":
                    print("转发成功！")

async def call_action(ws, action, params):
    global echo_id
    echo_id += 1
    echo = f"req-{echo_id}"
    future = asyncio.get_event_loop().create_future()
    pending[echo] = future
    await ws.send(json.dumps({"action": action, "params": params, "echo": echo}))
    return await future

asyncio.run(main())
```

:::

::: tip

- `echo` 可以是任意字符串或数字，只要你自己能区分就行
- HTTP 方式不需要 `echo`（因为请求-响应是一一对应的）
- `echo` 是可选的，不传也行，但 WebSocket 场景下强烈建议带上
:::

## Message（消息）—— 数组格式

icqq-rust-onebot 的消息是一个**段数组**，每个段是一个 `{ "type": ..., "data": {...} }` 对象：

```json
[
  {"type": "text", "data": {"text": "看看这张图 "}},
  {"type": "image", "data": {"file": "https://example.com/pic.jpg"}},
  {"type": "at", "data": {"qq": "123456"}}
]
```

常用段类型：

| 类型 | 用途 | 示例 |
| ---- | ---- | ---- |
| `text` | 纯文本 | `{"type":"text","data":{"text":"你好"}}` |
| `image` | 图片 | `{"type":"image","data":{"file":"https://..."}}` |
| `at` | @ 某人 | `{"type":"at","data":{"qq":"123456"}}` |
| `face` | QQ 表情 | `{"type":"face","data":{"id":178}}` |
| `reply` | 回复消息 | `{"type":"reply","data":{"id":"<message_id>"}}` |
| `record` | 语音 | `{"type":"record","data":{"file":"/path/to.amr"}}` |

完整列表见[消息段类型](./segments)。

::: warning 不支持 CQ 码
不要传 `"[CQ:image,file=...]"` 这样的字符串。传字符串会被当作纯文本处理，不会解析 CQ 码。始终使用数组格式。
:::

## access_token —— 鉴权

如果配置了 `access_token`，每次请求都需要带上认证信息：

**HTTP**：在请求头加 `Authorization: Bearer <你的token>`

```bash
curl -X POST http://127.0.0.1:5700/get_login_info \
  -H "Authorization: Bearer <access_token>"
```

**WebSocket**：连接时在 URL 参数里传 `?access_token=<你的token>`，或在请求头里带。

## 通信方式选择

| 方式 | 适合场景 | 说明 |
| ---- | ---- | ---- |
| **HTTP** | 最简单，适合入门 | 你主动调 API（action），Bot 把事件 POST 到你的 URL |
| **正向 WebSocket** | 需要双向实时通信 | 你连 Bot 的 WS 端口，一条连接搞定 action + event |
| **反向 WebSocket** | Bot 框架常用 | Bot 主动连你的 WS 服务，框架默认用这种 |

如果你不确定用哪种，先从 HTTP 开始，最容易理解和调试。

## 下一步

- [对接示例](./examples) —— 看实际的代码怎么写
- [消息段类型](./segments) —— 所有支持的消息类型
- [事件参考](./events/) —— 所有会推送的事件
- [API 参考](/rust/api/) —— 全部可调用的 API
