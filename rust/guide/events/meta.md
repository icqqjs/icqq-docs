# 元事件

`post_type: "meta_event"`——Bot 自身状态相关的事件。

---

## 生命周期

`meta_event_type: "lifecycle"`

Bot 启动/关闭时触发。登录成功（含断线重连/重登成功）推送 `connect`；被服务器**踢下线**时推送 `disable`，同时还会推送一条 [`bot_offline`](./notice.md#机器人掉线-bot-offline) 通知事件。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `sub_type` | string | `"connect"`（连接建立）/ `"enable"`（启用）/ `"disable"`（禁用） |

```json
{
  "post_type": "meta_event",
  "meta_event_type": "lifecycle",
  "sub_type": "connect",
  "self_id": "<your-uin>",
  "time": 1700000000
}
```

---

## 心跳

`meta_event_type: "heartbeat"`

Bot 定期发送心跳，表示自己还活着。周期由配置文件的 `heartbeat_interval` 控制（单位：毫秒）。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `status` | object | Bot 状态（`online`: 是否在线，`good`: 是否正常），与 [`get_status`](../../api/meta.md#获取运行状态) 同源——被踢下线 / socket 断开期间 `online` 为 `false`，重连成功后恢复 `true` |
| `interval` | number | 心跳间隔（毫秒） |

```json
{
  "post_type": "meta_event",
  "meta_event_type": "heartbeat",
  "self_id": "<your-uin>",
  "time": 1700000000,
  "status": { "online": true, "good": true },
  "interval": 15000
}
```

::: tip
- 设置 `heartbeat_interval: 0`（或任意 `<= 0` 的值）可以完全关闭心跳
- 框架通过心跳判断 Bot 是否在线，建议保持开启
:::

---

## 被忽略的内部信号

以下内部信号没有对应的 OneBot 事件，会被静默跳过，不会推送到你的程序：

- 输入状态（`internal.input`）
- 拉取触发（`internal.pushNotify`）
- 已读标记（`sync.*`）
