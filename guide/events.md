# 事件系统

icqq 的客户端是一个事件发射器。收到消息、有人加群、登录需要扫码……这些都通过**事件**通知你的代码。

## 监听、取消监听

```js
// 假设 client 已创建
client.on("message", (e) => {
  console.log(e.raw_message);
});

// 只触发一次
client.once("system.online", () => {
  console.log("上线了");
});

// 取消监听（需要传入同一个函数引用）
function onMsg(e) {}
client.on("message", onMsg);
client.off("message", onMsg);
```

## 事件名是分层的

事件名用 `.` 分层，**监听父事件能收到它的所有子事件**：

- 监听 `message` —— 收到**全部**消息（私聊 + 群 + 讨论组）。
- 监听 `message.group` —— 只收**群消息**。
- 监听 `message.private` —— 只收**私聊消息**。

回调参数里都有 `sub_type` 等字段，可进一步区分。下面按类别列出主要事件。详尽的字段表见 [事件类型参考](/api/events)。

## 消息事件 `message.*`

| 事件 | 触发时机 | 关键 payload |
| --- | --- | --- |
| `message` | 收到任意消息 | `message`、`raw_message`、`sender` |
| `message.private` | 收到私聊消息 | `friend`、`sender`、`message` |
| `message.group` | 收到群消息 | `group_id`、`group`、`member`、`sender`、`message` |
| `message.discuss` | 收到讨论组消息 | `discuss`、`message` |
| `message.guild` | 收到频道消息 | 频道消息事件 |

- `message` 是已解析的消息段数组 `MessageElem[]`，`raw_message` 是文本化预览。
- 所有消息事件都带便捷方法 `e.reply(content, quote?)` 快速回复；群消息事件还带 `e.recall()` 撤回本条。

```js
client.on("message.group", (e) => {
  if (e.raw_message === "ping") {
    e.reply("pong", true); // 第二个参数 true 表示引用对方这条消息
  }
});
```

## 通知事件 `notice.*`

好友相关 `notice.friend.*`：

| 事件 | 触发时机 | 关键 payload |
| --- | --- | --- |
| `notice.friend.increase` | 新增好友 | `user_id`、`nickname` |
| `notice.friend.decrease` | 好友减少 | `user_id`、`nickname` |
| `notice.friend.recall` | 好友撤回消息 | `operator_id`、`message_id` |
| `notice.friend.poke` | 好友戳一戳 | `operator_id`、`target_id`、`action` |

群相关 `notice.group.*`：

| 事件 | 触发时机 | 关键 payload |
| --- | --- | --- |
| `notice.group.increase` | 群成员增加 | `group_id`、`user_id`、`nickname` |
| `notice.group.decrease` | 群成员减少 | `group_id`、`user_id`、`operator_id`、`dismiss` |
| `notice.group.recall` | 群消息撤回 | `user_id`、`operator_id`、`message_id` |
| `notice.group.admin` | 管理员变更 | `user_id`、`set` |
| `notice.group.ban` | 群禁言 | `user_id`、`operator_id`、`duration` |
| `notice.group.transfer` | 群转让 | `operator_id`、`user_id` |
| `notice.group.poke` | 群内戳一戳 | `operator_id`、`target_id`、`action` |
| `notice.group.sign` | 群打卡 | `user_id`、`nickname`、`sign_text` |

```js
client.on("notice.group.increase", (e) => {
  e.group.sendMsg([segment.at(e.user_id), " 欢迎入群！"]);
});
```

## 请求事件 `request.*`

| 事件 | 触发时机 | 关键 payload |
| --- | --- | --- |
| `request.friend.add` | 有人申请加你好友 | `user_id`、`comment`、`approve()` |
| `request.friend.single` | 对方已单向加你为好友 | `user_id`、`approve()` |
| `request.group.add` | 有人申请加群 | `group_id`、`user_id`、`comment`、`approve()` |
| `request.group.invite` | 你被邀请进群 | `group_id`、`user_id`、`approve()` |

请求事件都带便捷方法 `e.approve(yes?)`：传 `true`（默认）同意，传 `false` 拒绝。

```js
client.on("request.friend.add", (e) => {
  e.approve(true); // 自动同意加好友
});
```

## 系统事件 `system.*`

| 事件 | 触发时机 | 关键 payload |
| --- | --- | --- |
| `system.online` | 成功上线 | 无 |
| `system.offline` | 下线 | `message` |
| `system.offline.network` | 因网络原因下线（默认自动重连） | `message` |
| `system.offline.kickoff` | 被服务器踢下线 | `message` |
| `system.login.qrcode` | 收到登录二维码 | `image`（二维码图片 Buffer） |
| `system.login.slider` | 需要滑动验证 | `url` |
| `system.login.device` | 需要设备锁验证 | `url`、`phone` |
| `system.login.error` | 登录出错 | `code`、`message` |

```js
client.on("system.online", () => console.log("登录成功"));

client.on("system.login.slider", (e) => {
  console.log("请到此地址完成滑块验证：", e.url);
});
```

## 同步事件 `sync.*`

多端登录时，你在其它设备上的操作会同步过来：

| 事件 | 触发时机 | 关键 payload |
| --- | --- | --- |
| `sync.message` | 你在别处发的私聊消息同步过来 | 私聊消息体 |
| `sync.read` | 消息已读同步 | `{ user_id, time }` 或 `{ group_id, seq }` |
| `sync.read.private` | 私聊已读同步 | `user_id`、`time` |
| `sync.read.group` | 群聊已读同步 | `group_id`、`seq` |

```js
client.on("sync.message", (e) => {
  console.log("我在其它设备发了：", e.raw_message);
});
```

## 相关

- [事件类型参考](/api/events) —— 每个事件的完整字段表与类型。
- [消息与消息段](/guide/message) —— 如何解析 `e.message` 和构造回复内容。
