# 联系人对象

要给某个好友发消息、踢某个群成员，你需要先**拿到对应的对象**，再在对象上调用方法。icqq 用一组 `pick*` 方法从客户端获取这些对象。

## 获取联系人对象

| 方法 | 返回 | 说明 |
| --- | --- | --- |
| `client.pickFriend(uin)` | `Friend` | 好友对象。 |
| `client.pickGroup(gid)` | `Group` | 群对象。 |
| `client.pickMember(gid, uin)` | `Member` | 某群里的某个成员。 |
| `client.pickUser(uin)` | `User` | 用户对象（不一定是好友）。 |
| `client.pickDiscuss(gid)` | `Discuss` | 讨论组对象。 |
| `client.pickGuild(id)` | `Guild` | QQ 频道对象。 |

`pick*` 只是「拿到一个操作句柄」，不会发起网络请求；拿到后即可链式调用：

```js
// 假设 client 已登录
await client.pickFriend(<friend_id>).sendMsg("你好");
```

> ID 字段（QQ 号、群号）都是数字，建议用 `number` 传入。

## 好友 Friend

```js
const friend = client.pickFriend(<friend_id>);

// 发消息
const ret = await friend.sendMsg("你好");

// 撤回（传发送时拿到的 message_id）
await friend.recallMsg(ret.message_id);

// 戳一戳
await friend.poke();
```

## 群 Group

```js
const group = client.pickGroup(<group_id>);

// 发群消息
await group.sendMsg("大家好");

// 踢人
await group.kickMember(<group_id>);

// 禁言某成员（秒）
await group.muteMember(<group_id>, 600);

// 改某成员名片
await group.setCard(<group_id>, "新名片");

// 获取群成员列表（Map<uin, MemberInfo>）
const members = await group.getMemberMap();
```

群对象还有很多管理方法：`muteAll(yes?)` 全员禁言、`setName(name)` 改群名、`setAdmin(uin, yes?)` 设管理员、`invite(uin)` 邀请入群、`quit()` 退群等，详见 [Group API](/api/group)。群文件操作见 [群文件系统 gfs](/api/gfs)。

## 群成员 Member

如果你已经在操作某个具体成员，用 `Member` 对象更直接：

```js
const member = client.pickMember(<group_id>, <friend_id>);

// 踢出
await member.kick();

// 禁言 30 分钟
await member.mute(1800);

// 设为管理员
await member.setAdmin(true);

// 改名片
await member.setCard("新名片");
```

`Group.kickMember` / `muteMember` / `setCard` / `setAdmin` 等其实就是转发到对应 `Member` 方法的快捷写法，两种写法都可以。完整方法见 [Member API](/api/member)。

## 频道 Guild

```js
const guild = client.pickGuild(<guild_id>);
await guild.sendMsg(<channel_id>, "频道里发条消息");
```

频道目前提供基础的消息收发能力，详见 [Guild API](/api/guild)。

## 本地缓存：fl / gl / gml

客户端会把好友、群、群成员信息缓存到几个 `Map` 上，方便快速查询（无需每次请求服务器）：

| 属性 | 类型 | 内容 |
| --- | --- | --- |
| `client.fl` | `Map<number, FriendInfo>` | 好友列表（key 是好友 QQ 号）。 |
| `client.gl` | `Map<number, GroupInfo>` | 群列表（key 是群号）。 |
| `client.gml` | `Map<number, Map<number, MemberInfo>>` | 群成员列表（外层 key 是群号，内层 key 是成员 QQ 号）。 |

```js
// 遍历所有好友
for (const [uin, info] of client.fl) {
  console.log(uin, info.nickname);
}

// 查某个群的成员
const memberMap = client.gml.get(<group_id>);
```

> 缓存可能不是最新的。需要确保拿到最新成员列表时，用 `group.getMemberMap(true)`（传 `true` 跳过缓存）。

## 相关

- [Friend API](/api/friend) · [Group API](/api/group) · [Member API](/api/member)
- [群文件系统 gfs](/api/gfs) · [Guild API](/api/guild)
- [消息与消息段](/guide/message) —— 各种 `sendMsg` 能发什么内容。
