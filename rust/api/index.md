# API 总览

icqq-rust-onebot 实现了 OneBot 11 标准动作集，并兼容大量 go-cqhttp 扩展动作、QQ 频道动作及少量 icqq 扩展动作。

所有动作以统一格式调用：

```json
{
  "action": "<动作名>",
  "params": { ... },
  "echo": null
}
```

统一响应信封：

```json
{
  "status": "ok",
  "retcode": 0,
  "data": { ... },
  "echo": null
}
```

## retcode 约定

| retcode | status | 说明 |
| --- | --- | --- |
| `0` | `ok` | 成功。 |
| `1` | `async` | 已接受异步处理（`_async` 后缀触发）。 |
| `1400` | `failed` | 参数错误或消息 ID 非法。 |
| `1404` | `failed` | 未知动作或不支持的动作。 |
| `1500` | `failed` | 操作失败，例如风控、传输错误、服务器拒绝。 |

## 动作后缀

- 动作名以 `_async` 结尾时，立即返回 `{ "status": "async", "retcode": 1 }` 并在后台执行。
- `_rate_limited` 后缀会被剥离后按基础动作分发。

## 消息

| action | 描述 | 分页 |
| --- | --- | --- |
| `send_private_msg` | 发送私聊消息 | [消息](/rust/api/message) |
| `send_group_msg` | 发送群消息 | [消息](/rust/api/message) |
| `send_msg` | 发送消息（自动判定类型） | [消息](/rust/api/message) |
| `send_group_forward_msg` | 发送群合并转发 | [消息](/rust/api/message) |
| `send_private_forward_msg` | 发送私聊合并转发 | [消息](/rust/api/message) |
| `send_forward_msg` | 发送合并转发（自动判定类型） | [消息](/rust/api/message) |
| `delete_msg` | 撤回消息 | [消息](/rust/api/message) |
| `get_msg` | 获取单条消息 | [消息](/rust/api/message) |
| `get_forward_msg` | 获取合并转发内容 | [消息](/rust/api/message) |
| `get_group_msg_history` | 获取群消息历史 | [消息](/rust/api/message) |
| `get_friend_msg_history` | 获取好友消息历史 | [消息](/rust/api/message) |
| `mark_msg_as_read` | 标记消息已读 | [消息](/rust/api/message) |
| `set_msg_emoji_like` | 消息表情回应 | [消息](/rust/api/message) |
| `unset_msg_emoji_like` | 取消消息表情回应 | [消息](/rust/api/message) |
| `forward_friend_single_msg` | 转发单条消息给好友 | [消息](/rust/api/message) |
| `forward_group_single_msg` | 转发单条消息到群 | [消息](/rust/api/message) |
| `mark_private_msg_as_read` | 标记私聊会话已读 | [消息](/rust/api/message) |
| `mark_group_msg_as_read` | 标记群会话已读 | [消息](/rust/api/message) |
| `friend_poke` | 戳一戳好友 | [消息](/rust/api/message) |
| `group_poke` | 戳一戳群成员 | [消息](/rust/api/message) |
| `send_poke` | 戳一戳（统一入口） | [消息](/rust/api/message) |
| `handle_quick_operation` | 快速操作 | [消息](/rust/api/message) |

## 群管理

| action | 描述 | 分页 |
| --- | --- | --- |
| `set_group_kick` | 群踢人 | [群管理](/rust/api/group-admin) |
| `set_group_kick_members` | 批量群踢人 | [群管理](/rust/api/group-admin) |
| `set_group_ban` | 群禁言 | [群管理](/rust/api/group-admin) |
| `set_group_whole_ban` | 群全员禁言 | [群管理](/rust/api/group-admin) |
| `set_group_anonymous_ban` | 匿名用户禁言 | [群管理](/rust/api/group-admin) |
| `set_group_admin` | 设置/取消群管理员 | [群管理](/rust/api/group-admin) |
| `set_group_anonymous` | 群匿名开关 | [群管理](/rust/api/group-admin) |
| `set_group_card` | 设置群名片 | [群管理](/rust/api/group-admin) |
| `set_group_remark` | 设置群备注（仅自己可见） | [群管理](/rust/api/group-admin) |
| `set_group_name` | 设置群名 | [群管理](/rust/api/group-admin) |
| `set_group_leave` | 退群/解散群 | [群管理](/rust/api/group-admin) |
| `set_group_special_title` | 设置群专属头衔 | [群管理](/rust/api/group-admin) |
| `set_essence_msg` | 设置精华消息 | [群管理](/rust/api/group-admin) |
| `delete_essence_msg` | 移除精华消息 | [群管理](/rust/api/group-admin) |
| `get_group_at_all_remain` | 获取群 @全体 剩余次数 | [群管理](/rust/api/group-admin) |
| `send_group_sign` | 群打卡 | [群管理](/rust/api/group-admin) |
| `send_group_notice` | 发送群公告 | [群管理](/rust/api/group-admin) |
| `set_group_msg_mask` | 群消息提醒方式（提醒/群助手/屏蔽/免打扰） | [群管理](/rust/api/group-admin) |
| `get_group_shut_list` | 获取群禁言列表 | [群管理](/rust/api/group-admin) |
| `set_friend_add_request` | 处理加好友请求 | [群管理](/rust/api/group-admin) |
| `set_group_add_request` | 处理加群请求/邀请 | [群管理](/rust/api/group-admin) |

## 账号资料

| action | 描述 | 分页 |
| --- | --- | --- |
| `send_like` | 点赞（名片赞） | [账号资料](/rust/api/account-profile) |
| `set_qq_profile` | 设置自身资料 | [账号资料](/rust/api/account-profile) |
| `set_qq_avatar` | 设置自身头像 | [账号资料](/rust/api/account-profile) |
| `set_online_status` | 设置在线状态 | [账号资料](/rust/api/account-profile) |
| `set_self_longnick` | 设置个性签名 | [账号资料](/rust/api/account-profile) |
| `get_roaming_stamp` | 获取漫游表情 | [账号资料](/rust/api/account-profile) |
| `delete_stamp` | 删除漫游表情 | [账号资料](/rust/api/account-profile) |
| `add_friend_category` | 新增好友分组 | [账号资料](/rust/api/account-profile) |
| `delete_friend_category` | 删除好友分组 | [账号资料](/rust/api/account-profile) |
| `rename_friend_category` | 重命名好友分组 | [账号资料](/rust/api/account-profile) |
| `set_friend_category` | 设置好友分组（移动好友到指定分组） | [账号资料](/rust/api/account-profile) |
| `set_friend_remark` | 设置好友备注 | [账号资料](/rust/api/account-profile) |
| `get_friends_with_category` | 获取按分组组织的好友列表 | [账号资料](/rust/api/account-profile) |
| `get_qq_avatar` | 获取头像直链（用户/群） | [账号资料](/rust/api/account-profile) |
| `get_user_status` | 获取用户扩展在线状态 | [账号资料](/rust/api/account-profile) |
| `get_clientkey` | 获取设备 ClientKey | [账号资料](/rust/api/account-profile) |
| `delete_friend` | 删除好友 | [账号资料](/rust/api/account-profile) |
| `get_unidirectional_friend_list` | 获取单向好友列表 | [账号资料](/rust/api/account-profile) |
| `set_group_portrait` | 设置群头像 | [账号资料](/rust/api/account-profile) |
| `delete_unidirectional_friend` | 删除单向好友（不支持） | [账号资料](/rust/api/account-profile) |

## 信息查询

| action | 描述 | 分页 |
| --- | --- | --- |
| `get_login_info` | 获取登录号信息 | [信息查询](/rust/api/info) |
| `get_stranger_info` | 获取陌生人信息 | [信息查询](/rust/api/info) |
| `get_friend_list` | 获取好友列表 | [信息查询](/rust/api/info) |
| `get_group_info` | 获取群信息 | [信息查询](/rust/api/info) |
| `get_group_list` | 获取群列表 | [信息查询](/rust/api/info) |
| `get_group_member_info` | 获取群成员信息 | [信息查询](/rust/api/info) |
| `get_group_member_list` | 获取群成员列表 | [信息查询](/rust/api/info) |
| `get_group_honor_info` | 获取群荣誉信息 | [信息查询](/rust/api/info) |
| `get_cookies` | 获取 Cookies | [信息查询](/rust/api/info) |
| `get_csrf_token` | 获取 CSRF Token | [信息查询](/rust/api/info) |
| `get_credentials` | 获取凭证 | [信息查询](/rust/api/info) |
| `can_send_image` | 能否发送图片 | [信息查询](/rust/api/info) |
| `can_send_record` | 能否发送语音 | [信息查询](/rust/api/info) |
| `get_online_clients` | 获取在线设备 | [信息查询](/rust/api/info) |
| `get_group_system_msg` | 获取群系统消息 | [信息查询](/rust/api/info) |

## 群文件

| action | 描述 | 分页 |
| --- | --- | --- |
| `get_group_file_system_info` | 获取群文件系统信息 | [群文件](/rust/api/gfs) |
| `get_group_root_files` | 获取群根目录文件 | [群文件](/rust/api/gfs) |
| `get_group_files_by_folder` | 获取群子目录文件 | [群文件](/rust/api/gfs) |
| `get_group_file_url` | 获取群文件下载地址 | [群文件](/rust/api/gfs) |
| `upload_group_file` | 上传群文件 | [群文件](/rust/api/gfs) |
| `upload_private_file` | 上传私聊文件 | [群文件](/rust/api/gfs) |
| `delete_group_file` | 删除群文件 | [群文件](/rust/api/gfs) |
| `create_group_file_folder` | 创建群文件目录 | [群文件](/rust/api/gfs) |
| `delete_group_folder` | 删除群文件目录 | [群文件](/rust/api/gfs) |
| `move_group_file` | 移动群文件 | [群文件](/rust/api/gfs) |
| `rename_group_file` | 重命名群文件 | [群文件](/rust/api/gfs) |
| `rename_group_file_folder` | 重命名群文件目录 | [群文件](/rust/api/gfs) |
| `get_private_file_url` | 获取私聊/离线文件下载地址 | [群文件](/rust/api/gfs) |

## QQ 频道

| action | 描述 | 分页 |
| --- | --- | --- |
| `get_guild_service_profile` | 获取频道 BOT 资料 | [QQ 频道](/rust/api/guild) |
| `get_guild_list` | 获取频道列表 | [QQ 频道](/rust/api/guild) |
| `get_guild_channel_list` | 获取子频道列表 | [QQ 频道](/rust/api/guild) |
| `get_guild_member_list` | 获取频道成员列表 | [QQ 频道](/rust/api/guild) |
| `send_guild_channel_msg` | 发送子频道消息 | [QQ 频道](/rust/api/guild) |

## Web

| action | 描述 | 分页 |
| --- | --- | --- |
| `get_essence_msg_list` | 获取精华消息列表 | [Web](/rust/api/web) |
| `get_group_notice` | 获取群公告 | [Web](/rust/api/web) |
| `del_group_notice` | 删除群公告 | [Web](/rust/api/web) |
| `set_group_anonymous_ban` | 匿名用户禁言（同[群管理](/rust/api/group-admin)） | [Web](/rust/api/web) |
| `check_url_safely` | 检查链接安全性 | [Web](/rust/api/web) |
| `ocr_image` | 图片 OCR | [Web](/rust/api/web) |

## 媒体

| action | 描述 | 分页 |
| --- | --- | --- |
| `get_image` | 获取图片 | [媒体](/rust/api/media) |
| `get_record` | 获取语音 | [媒体](/rust/api/media) |

## 元信息与杂项

| action | 描述 | 分页 |
| --- | --- | --- |
| `get_status` | 获取运行状态 | [元信息](/rust/api/meta) |
| `get_version_info` | 获取版本信息 | [元信息](/rust/api/meta) |
| `get_supported_actions` | 获取支持的动作列表 | [元信息](/rust/api/meta) |
| `set_restart` | 重启（空操作） | [元信息](/rust/api/meta) |
| `clean_cache` | 清理缓存（空操作） | [元信息](/rust/api/meta) |
| `download_file` | 下载文件到本地 | [元信息](/rust/api/meta) |
| `get_word_slices` | 中文分词（不支持） | [元信息](/rust/api/meta) |
| `reload_event_filter` | 重载事件过滤器（空操作） | [元信息](/rust/api/meta) |

## 不支持的动作

以下动作在本项目中不受支持，调用返回 `1404`，响应包含 `not_supported: true` 标记。

| action | 说明 |
| --- | --- |
| `delete_unidirectional_friend` | 删除单向好友 |
| `get_model_show` / `_get_model_show` | 获取机型展示 |
| `set_model_show` / `_set_model_show` | 设置机型展示 |
| `qidian_get_account_info` | 企点账号信息 |
| `.get_word_slices` | 中文分词 |
| 频道 meta / role 系列 | `get_guild_meta_by_guest`、`get_guild_member_profile`、`get_guild_msg`、`get_topic_channel_feeds`、`get_guild_roles`、`create_guild_role`、`delete_guild_role`、`update_guild_role`、`set_guild_member_role` |
