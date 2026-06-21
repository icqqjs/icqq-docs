# 事件概览

当 QQ 上发生了事情（有人发消息、有人入群、有人撤回……），icqq-rust-onebot 会把这些**事件**推送给你的程序。

## 推送方式

取决于你的配置：
- **HTTP POST** —— Bot 向你配置的 `post_url` 发 POST 请求
- **正向 WebSocket** —— 通过已建立的 WS 连接直接推送
- **反向 WebSocket** —— 通过 Bot 主动连出的 WS 连接推送

## 公共字段

每个事件都包含以下公共字段：

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `post_type` | string | 事件大类：`message` / `notice` / `request` / `meta_event` |
| `time` | number | 事件发生的时间戳（秒） |
| `self_id` | number | 收到事件的 Bot QQ 号 |

## 事件分类

| 类型 | `post_type` | 说明 | 详情 |
| ---- | ---- | ---- | ---- |
| **消息事件** | `message` | 收到私聊、群聊消息 | [查看详情](./message) |
| **通知事件** | `notice` | 群成员变动、撤回、禁言、戳一戳等 | [查看详情](./notice) |
| **请求事件** | `request` | 好友申请、入群申请/邀请 | [查看详情](./request) |
| **元事件** | `meta_event` | 心跳、生命周期 | [查看详情](./meta) |

::: tip 注意事项
- `message_id` 始终是**字符串**（见 [message_id 说明](../message-id)）
- `message` 字段始终是**段数组**；`raw_message` 是纯文本（仅文本段拼接），不含 CQ 码
- QQ 频道（guild）相关字段的 id 全部为**字符串**
:::
