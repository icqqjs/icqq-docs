# 枚举与常量

icqq 导出的常用枚举值。从 `@icqqjs/icqq` 引入即可使用。

```js
const { OnlineStatus, Platform, ErrorCode } = require("@icqqjs/icqq")
```

---

## Platform（登录设备）

创建客户端时通过 `config.platform` 指定要模拟的登录设备。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `Android` | `1` | 安卓手机（默认）。 |
| `aPad` | `2` | 安卓平板。 |
| `Watch` | `3` | 安卓手表。 |
| `iMac` | `4` | macOS。 |
| `iPad` | `5` | iPad。 |
| `Tim` | `6` | Tim。 |
| `Custom` | `7` | 自定义。 |

### 示例

```js
const { createClient, Platform } = require("@icqqjs/icqq")
const client = createClient({ platform: Platform.aPad })
```

---

## OnlineStatus（在线状态）

用于 `client.setOnlineStatus(status)` 设置账号在线状态。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `Offline` | `0` | 离线。 |
| `Online` | `11` | 在线。 |
| `Absent` | `31` | 离开。 |
| `Invisible` | `41` | 隐身。 |
| `Busy` | `50` | 忙碌。 |
| `Qme` | `60` | Q 我吧。 |
| `DontDisturb` | `70` | 请勿打扰。 |

### 示例

```js
// 假设 client 已登录
const { OnlineStatus } = require("@icqqjs/icqq")
await client.setOnlineStatus(OnlineStatus.Online)
```

---

## ChannelType（子频道类型）

频道相关，出现在子频道信息的 `channel_type` 字段。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `Unknown` | `0` | 未知类型。 |
| `Text` | `1` | 文字频道。 |
| `Voice` | `2` | 语音频道。 |
| `Live` | `5` | 直播频道。 |
| `App` | `6` | 应用频道。 |
| `Forum` | `7` | 论坛频道。 |

### 示例

```js
const { ChannelType } = require("@icqqjs/icqq")
const channels = client.getChannelList("<guild_id>")
const textChannels = channels.filter((c) => c.channel_type === ChannelType.Text)
```

---

## NotifyType（频道通知类型）

频道相关，出现在子频道的 `notify_type` 字段。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `Unknown` | `0` | 未知类型。 |
| `AllMessages` | `1` | 接收所有消息通知。 |
| `Nothing` | `2` | 不通知。 |

---

## GuildRole（频道权限）

频道成员的权限，出现在 `GuildMember.role`。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `Member` | `1` | 普通成员。 |
| `GuildAdmin` | `2` | 频道管理员。 |
| `Owner` | `4` | 频道主。 |
| `ChannelAdmin` | `5` | 子频道管理员。 |

---

## Gender（性别）

注意 `Gender` 是字符串字面量类型，不是数字枚举。

| 取值 | 说明 |
| --- | --- |
| `"male"` | 男。 |
| `"female"` | 女。 |
| `"unknown"` | 未知。 |

出现在 `FriendInfo.sex`、`MemberInfo.sex`、好友申请事件的 `sex` 等字段。

---

## GroupRole（群内权限）

同样是字符串字面量类型。出现在 `MemberInfo.role`。

| 取值 | 说明 |
| --- | --- |
| `"owner"` | 群主。 |
| `"admin"` | 管理员。 |
| `"member"` | 普通成员。 |

---

## ErrorCode（调用错误码）

调用 API 失败时，抛出的 `ApiRejection.code` 可能是下列值之一。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `ClientNotOnline` | `-1` | 客户端离线。 |
| `PacketTimeout` | `-2` | 发包超时未收到回应。 |
| `UserNotExists` | `-10` | 用户不存在。 |
| `GroupNotJoined` | `-20` | 群不存在（未加入）。 |
| `MemberNotExists` | `-30` | 群员不存在。 |
| `MessageBuilderError` | `-60` | 发消息参数不正确。 |
| `RiskMessageError` | `-70` | 群消息被风控发送失败。 |
| `SensitiveWordsError` | `-80` | 群消息含敏感词发送失败。 |
| `SignApiError` | `-90` | 签名 api 异常。 |
| `HighwayTimeout` | `-110` | 上传图片 / 文件 / 视频超时。 |
| `HighwayNetworkError` | `-120` | 上传时网络错误。 |
| `NoUploadChannel` | `-130` | 没有上传通道。 |
| `HighwayFileTypeError` | `-140` | 不支持的 file 类型。 |
| `UnsafeFile` | `-150` | 文件安全校验未通过。 |
| `OfflineFileNotExists` | `-160` | 离线（私聊）文件不存在。 |
| `GroupFileNotExists` | `-170` | 群文件不存在（无法转发）。 |
| `FFmpegVideoThumbError` | `-210` | 获取视频封面失败。 |
| `FFmpegPttTransError` | `-220` | 音频转换失败。 |

### 示例

```js
const { ErrorCode } = require("@icqqjs/icqq")
try {
  await client.pickGroup(<group_id>).sendMsg("hi")
} catch (e) {
  if (e.code === ErrorCode.RiskMessageError) console.log("被风控了")
}
```

---

## LoginErrorCode（登录错误码）

登录失败时 `system.login.error` 事件的 `code` 可能是下列值（不在列内的属于未知错误）。

| 成员 | 值 | 说明 |
| --- | --- | --- |
| `WrongPassword` | `1` | 密码错误。 |
| `AccountFrozen` | `40` | 账号被冻结。 |
| `TooManySms` | `162` | 发短信太频繁。 |
| `WrongSmsCode` | `163` | 短信验证码错误。 |
| `WrongTicket` | `237` | 滑块 ticket 错误。 |

### 示例

```js
const { LoginErrorCode } = require("@icqqjs/icqq")
client.on("system.login.error", (e) => {
  if (e.code === LoginErrorCode.WrongPassword) console.log("密码错了")
})
```

### 相关

[事件类型参考](/api/events) · [核心类型](/api/types)
