import { defineConfig } from 'vitepress'
import taskLists from 'markdown-it-task-lists'

// icqq 多实现文档站。中文站点 + 本地搜索。
// 站点按「实现」分区，每个实现自成一体（顶栏切实现，侧栏切栏目）：
//   根 /            —— 门户中转页（选实现）
//   /guide/、/api/  —— icqq（Node 库，TypeScript）：共用同一侧栏（指南 + API 参考）
//   /rust/          —— icqq-rs（纯 Rust OneBot 11 桥）
//   （将来）/python/ —— icqq Python 实现
// 顶栏只放「实现切换」直链，不放会跨实现误跳的全局「指南/API」。
// 注：内容分批补全期间先放开 ignoreDeadLinks；全部就位后改回 false 以在 CI 卡死链。

// ── icqq Node 库（根分区）：指南 + API 合一侧栏，挂在 /guide/ 与 /api/ ──
const nodeSidebar = [
  {
    text: '指南',
    collapsed: false,
    items: [
      { text: '介绍', link: '/guide/' },
      { text: '安装', link: '/guide/install' },
      { text: '快速开始', link: '/guide/quickstart' },
      { text: '登录', link: '/guide/login' },
      { text: '配置', link: '/guide/config' },
      { text: '事件系统', link: '/guide/events' },
      { text: '消息与消息段', link: '/guide/message' },
      { text: '联系人对象', link: '/guide/contacts' },
      { text: '在 Deno 运行', link: '/guide/deno' },
      { text: '常见问题', link: '/guide/faq' },
    ],
  },
  {
    text: 'API 参考',
    collapsed: false,
    items: [
      { text: '总览', link: '/api/' },
      { text: 'Client', link: '/api/client' },
      { text: 'Friend / User', link: '/api/friend' },
      { text: 'Group / Discuss', link: '/api/group' },
      { text: 'Member', link: '/api/member' },
      { text: '群文件 Gfs', link: '/api/gfs' },
      { text: 'Guild / Channel', link: '/api/guild' },
      { text: '消息段 segment', link: '/api/segment' },
      { text: '事件类型', link: '/api/events' },
      { text: '枚举与常量', link: '/api/enums' },
      { text: '核心类型', link: '/api/types' },
    ],
  },
  {
    text: '参与',
    collapsed: true,
    items: [
      { text: '文档编写规范', link: '/guide/docs-style' },
      { text: '贡献', link: '/guide/contributing' },
    ],
  },
]

// ── icqq-rs OneBot 桥（/rust/ 分区）：指南 + API 合一侧栏 ──
const rustSidebar = [
  {
    text: 'icqq-rs · 入门',
    collapsed: false,
    items: [
      { text: '介绍', link: '/rust/guide/' },
      { text: '快速开始 / 上线', link: '/rust/guide/quickstart' },
      { text: '配置说明', link: '/rust/guide/config' },
    ],
  },
  {
    text: 'icqq-rs · 对接开发',
    collapsed: false,
    items: [
      { text: '基本概念', link: '/rust/guide/basics' },
      { text: '对接示例', link: '/rust/guide/examples' },
    ],
  },
  {
    text: 'icqq-rs · 消息与事件',
    collapsed: false,
    items: [
      { text: '消息段类型', link: '/rust/guide/segments' },
      {
        text: '事件参考',
        collapsed: false,
        items: [
          { text: '事件概览', link: '/rust/guide/events/' },
          { text: '消息事件', link: '/rust/guide/events/message' },
          { text: '通知事件', link: '/rust/guide/events/notice' },
          { text: '请求事件', link: '/rust/guide/events/request' },
          { text: '元事件', link: '/rust/guide/events/meta' },
        ],
      },
      { text: 'message_id 说明', link: '/rust/guide/message-id' },
    ],
  },
  {
    text: 'icqq-rs · API 参考',
    collapsed: false,
    items: [
      { text: '总览（全 action 表）', link: '/rust/api/' },
      { text: '消息', link: '/rust/api/message' },
      { text: '群管理', link: '/rust/api/group-admin' },
      { text: '账号 & 资料', link: '/rust/api/account-profile' },
      { text: '信息获取', link: '/rust/api/info' },
      { text: '群文件 (gfs)', link: '/rust/api/gfs' },
      { text: 'QQ 频道 (guild)', link: '/rust/api/guild' },
      { text: 'Web 接口', link: '/rust/api/web' },
      { text: '媒体（图片/语音/文件）', link: '/rust/api/media' },
      { text: '元信息 & 杂项', link: '/rust/api/meta' },
    ],
  },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'ICQQ',
  description: 'icqq —— QQ 协议 Node 库，附纯 Rust OneBot 11 桥实现。多实现文档站。',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'vitesse-dark'
    },
    config: (md) => {
      md.use(taskLists)
    }
  },
  // 全站品牌字体 Space Grotesk 改为自托管 @font-face，见 theme/custom.css 顶部。
  themeConfig: {
    logo: '/logo.png',
    // 顶栏 = 实现切换直链（点 logo 回门户首页）。当前实现高亮，互不跨跳。
    nav: [
      { text: 'Node.js', link: '/guide/', activeMatch: '^/(guide|api)/' },
      { text: 'OneBot', link: '/rust/', activeMatch: '^/rust/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/icqqjs/icqq' },
    ],
    footer: {
      copyright: 'Copyright © 2022-present icqqjs contributors',
    },
    search: { provider: 'local' },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
    sidebar: {
      '/guide/': nodeSidebar,
      '/api/': nodeSidebar,
      '/rust/': rustSidebar,
    },
  },
})
