# 对接示例

本页提供最常见场景的实际代码，帮你快速上手。所有示例假设 icqq-rust-onebot 已启动，HTTP 接口在 `http://127.0.0.1:5700`。

## 发送群消息

最基础的操作——往一个群里发一条消息。

::: code-group

```bash [curl]
curl -X POST http://127.0.0.1:5700/send_group_msg \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "group_id": <group_id>,
    "message": [{"type": "text", "data": {"text": "Hello!"}}]
  }'
```

```javascript [Node.js]
const resp = await fetch("http://127.0.0.1:5700/send_group_msg", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <access_token>",
  },
  body: JSON.stringify({
    group_id: "<group_id>",
    message: [{ type: "text", data: { text: "Hello!" } }],
  }),
});

const result = await resp.json();
if (result.status === "ok") {
  console.log("发送成功，message_id:", result.data.message_id);
}
```

```python [Python]
import requests

resp = requests.post("http://127.0.0.1:5700/send_group_msg",
    headers={"Authorization": "Bearer <access_token>"},
    json={
        "group_id": "<group_id>",
        "message": [{"type": "text", "data": {"text": "Hello!"}}]
    })

result = resp.json()
if result["status"] == "ok":
    print(f"发送成功，message_id: {result['data']['message_id']}")
else:
    print(f"发送失败，retcode: {result['retcode']}")
```

:::

## 发送图文混合消息

消息是一个段数组，可以自由组合文字、图片、@ 等。

::: code-group

```javascript [Node.js]
const message = [
  { type: "text", data: { text: "看看这张图：" } },
  { type: "image", data: { file: "https://example.com/pic.jpg" } },
  { type: "text", data: { text: "\n" } },
  { type: "at", data: { qq: "<friend_id>" } },
  { type: "text", data: { text: " 你觉得怎么样？" } },
];

const resp = await fetch("http://127.0.0.1:5700/send_group_msg", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <access_token>",
  },
  body: JSON.stringify({ group_id: "<group_id>", message }),
});
```

```python [Python]
import requests

message = [
    {"type": "text", "data": {"text": "看看这张图："}},
    {"type": "image", "data": {"file": "https://example.com/pic.jpg"}},
    {"type": "text", "data": {"text": "\n"}},
    {"type": "at", "data": {"qq": "<friend_id>"}},
    {"type": "text", "data": {"text": " 你觉得怎么样？"}}
]

resp = requests.post("http://127.0.0.1:5700/send_group_msg",
    headers={"Authorization": "Bearer <access_token>"},
    json={"group_id": "<group_id>", "message": message})

print(resp.json())
```

:::

## 回复消息

收到一条消息后，引用回复它。需要用消息事件里的 `message_id`。

::: code-group

```javascript [Node.js]
const originalMessageId = "eJx...";

const message = [
  { type: "reply", data: { id: originalMessageId } },
  { type: "text", data: { text: "收到了！" } },
];

await fetch("http://127.0.0.1:5700/send_group_msg", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <access_token>",
  },
  body: JSON.stringify({ group_id: "<group_id>", message }),
});
```

```python [Python]
import requests

# 假设你从事件里拿到了 message_id
original_message_id = "eJx..."

message = [
    {"type": "reply", "data": {"id": original_message_id}},
    {"type": "text", "data": {"text": "收到了！"}}
]

requests.post("http://127.0.0.1:5700/send_group_msg",
    headers={"Authorization": "Bearer <access_token>"},
    json={"group_id": "<group_id>", "message": message})
```

:::

## 用 HTTP POST 接收事件

配置 `http.post_url` 后，Bot 会把事件 POST 到你的服务器。你只需要写一个简单的 HTTP 服务：

::: code-group

```javascript [Node.js (Express)]
import express from "express";
const app = express();
app.use(express.json());

app.post("/", (req, res) => {
  const event = req.body;

  if (event.post_type === "message" || event.post_type === "message_sent") {
    const sender = event.sender.nickname;
    const raw = event.raw_message;

    if (event.message_type === "group") {
      console.log(`[群 ${event.group_id}] ${sender}: ${raw}`);
    } else if (event.message_type === "private") {
      console.log(`[私聊] ${sender}: ${raw}`);
    }
  } else if (event.post_type === "notice") {
    console.log(`通知事件: ${event.notice_type}`);
  }

  res.send("ok");
});

app.listen(8080, () => console.log("事件服务器已启动: http://localhost:8080"));
```

```python [Python (Flask)]
from flask import Flask, request

app = Flask(__name__)

@app.post("/")
def handle_event():
    event = request.json
    post_type = event.get("post_type")

    if post_type in ("message", "message_sent"):
        msg_type = event["message_type"]
        raw = event["raw_message"]
        sender = event["sender"]["nickname"]

        if msg_type == "group":
            group_id = event["group_id"]
            print(f"[群 {group_id}] {sender}: {raw}")
        elif msg_type == "private":
            print(f"[私聊] {sender}: {raw}")

    elif post_type == "notice":
        print(f"通知事件: {event['notice_type']}")

    elif post_type == "request":
        print(f"请求事件: {event['request_type']}")

    return "ok"

if __name__ == "__main__":
    app.run(port=8080)
```

:::

对应的 `config.yaml` 配置：

```yaml
http:
  enable: true
  host: "127.0.0.1"
  port: 5700
  post_url: "http://127.0.0.1:8080/"  # 你的事件接收地址
```

## 用 WebSocket 收发

WebSocket 一条连接同时处理 action 和 event，适合需要实时交互的场景。

::: code-group

```javascript [Node.js]
import WebSocket from "ws";

const ws = new WebSocket("ws://127.0.0.1:6700?access_token=<access_token>");

ws.on("open", () => {
  console.log("已连接");

  // 发送一条 action
  ws.send(JSON.stringify({
    action: "get_login_info",
    echo: "req-1",
  }));
});

ws.on("message", (raw) => {
  const data = JSON.parse(raw.toString());

  if (data.post_type) {
    // 事件
    if (data.post_type === "message" || data.post_type === "message_sent") {
      console.log(`收到消息: ${data.raw_message}`);
    }
  } else if (data.echo) {
    // action 响应
    console.log(`响应 [${data.echo}]:`, data.data);
  }
});
```

```python [Python]
import asyncio
import json
import websockets

async def main():
    uri = "ws://127.0.0.1:6700?access_token=<access_token>"
    async with websockets.connect(uri) as ws:
        # 启动一个任务持续接收事件
        async def recv_loop():
            async for raw in ws:
                data = json.loads(raw)
                if "post_type" in data:
                    # 这是一条事件
                    if data["post_type"] in ("message", "message_sent"):
                        print(f"收到消息: {data['raw_message']}")
                elif "echo" in data:
                    # 这是一条 action 的响应
                    print(f"响应 [{data['echo']}]: {data['status']}")

        recv_task = asyncio.create_task(recv_loop())

        # 发送一条 action
        await ws.send(json.dumps({
            "action": "get_login_info",
            "echo": "req-1"
        }))

        await recv_task

asyncio.run(main())
```

:::

对应的 `config.yaml`：

```yaml
ws:
  enable: true
  host: "127.0.0.1"
  port: 6700
```

## 完整示例：关键词自动回复 Bot

一个最简单的实用 Bot——收到特定关键词自动回复。

::: code-group

```javascript [Node.js]
import express from "express";
const app = express();
app.use(express.json());

const API = "http://127.0.0.1:5700";
const TOKEN = "<access_token>";

app.post("/", async (req, res) => {
  const event = req.body;

  if (event.post_type !== "message" || event.message_type !== "group") {
    return res.send("ok");
  }

  const text = event.raw_message.trim();
  const groupId = event.group_id;

  if (text === "/ping") {
    await sendGroup(groupId, "pong!");
  } else if (text === "/help") {
    await sendGroup(groupId, "可用命令：/ping /help /info");
  } else if (text === "/info") {
    const info = await getLoginInfo();
    await sendGroup(groupId, `Bot 昵称: ${info.nickname}, QQ: ${info.user_id}`);
  }

  res.send("ok");
});

async function sendGroup(groupId, text) {
  await fetch(`${API}/send_group_msg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      group_id: groupId,
      message: [{ type: "text", data: { text } }],
    }),
  });
}

async function getLoginInfo() {
  const resp = await fetch(`${API}/get_login_info`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return (await resp.json()).data;
}

app.listen(8080, () => console.log("Bot 已启动: http://localhost:8080"));
```

```python [Python]
import requests
from flask import Flask, request as req

app = Flask(__name__)
API = "http://127.0.0.1:5700"
TOKEN = "<access_token>"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

@app.post("/")
def handle():
    event = req.json

    # 只处理群消息
    if event.get("post_type") != "message" or event.get("message_type") != "group":
        return "ok"

    text = event["raw_message"].strip()
    group_id = event["group_id"]
    user_id = event["user_id"]

    # 关键词匹配
    if text == "/ping":
        send_group(group_id, "pong!")
    elif text == "/help":
        send_group(group_id, "可用命令：/ping /help /info")
    elif text == "/info":
        info = get_login_info()
        send_group(group_id, f"Bot 昵称: {info['nickname']}, QQ: {info['user_id']}")

    return "ok"

def send_group(group_id, text):
    requests.post(f"{API}/send_group_msg", headers=HEADERS, json={
        "group_id": group_id,
        "message": [{"type": "text", "data": {"text": text}}]
    })

def get_login_info():
    resp = requests.post(f"{API}/get_login_info", headers=HEADERS)
    return resp.json()["data"]

if __name__ == "__main__":
    app.run(port=8080)
```

:::

## 与 Bot 框架对接

::: tip
使用框架时，在框架的 OneBot 适配器配置里填入 icqq-rust-onebot 的地址和端口即可。具体配置方式参考各框架文档。

注意：由于本实现的 `message_id` 是字符串（非整数），部分框架可能需要适配。如果遇到问题，优先检查框架是否将 `message_id` 强制转为了整数。
:::
