# message_id 说明

## 它是什么

icqq-rust-onebot 的 `message_id` 是一个**字符串**（base64url 编码），不是数字。

你在收到消息事件时会拿到 `message_id`，在撤回消息或回复消息时需要把它传回去。就是这样——把它当一个**不透明的标记**用就行，不需要解析它的内容。

## 与标准的差异

::: warning
标准 OneBot 11 要求 `message_id` 是一个 32 位整数。icqq-rust-onebot 使用字符串格式，**不提供整数模式**。

如果你使用的 Bot 框架把 `message_id` 强制转为了整数，会导致撤回、回复等功能失败。
:::

## 使用方式

```python
# 收到消息事件
event = ...  # {"message_id": "eJx...", "message": [...], ...}

# 回复这条消息：直接把 message_id 传回去
requests.post("http://127.0.0.1:5700/send_group_msg", json={
    "group_id": event["group_id"],
    "message": [
        {"type": "reply", "data": {"id": event["message_id"]}},
        {"type": "text", "data": {"text": "收到了"}}
    ]
})

# 撤回这条消息
requests.post("http://127.0.0.1:5700/delete_msg", json={
    "message_id": event["message_id"]
})
```

## 注意

- 事件 JSON 里的 `message_id` 始终是 **JSON 字符串**类型
- 频道（guild）消息的 `message_id` 是消息序号的字符串形式
- 不要尝试将它转为数字、拆分或假设其内部格式
