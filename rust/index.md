---
layout: home

hero:
  name: icqq-rust-onebot
  tagline: 纯 Rust QQ 机器人后端，OneBot 11 接口，开箱即用
  image:
    src: /logo.png
    alt: icqq-rust-onebot Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /rust/guide/quickstart
    - theme: alt
      text: 介绍
      link: /rust/guide/
    - theme: alt
      text: API 参考
      link: /rust/api/

features:
  - title: 纯 Rust 实现
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    details: "零 JS 运行时，内存占用极低（< 15 MB RSS）。内置 SQLite 存储，单二进制部署即可长期运行。"
  - title: OneBot 11 接口
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    details: "标准 OneBot 11 接口 + go-cqhttp 扩展，框架可直接对接。"
  - title: 60+ API 覆盖
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 3.82-13.82L12 2l1.18 1.18c.28.28.75.28 1.03 0A22 22 0 0 1 22 15l-3 3a22 22 0 0 1-7 0Z"/><path d="m9 15-3 3-1-1 3-3"/></svg>
    details: "消息收发、群管理、合并转发、媒体上传、好友/群请求处理、QQ 频道——一站搞定。"
  - title: 开箱即用
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    details: "YAML 配置 + 环境变量覆盖，HTTP 与 WebSocket 并行，单二进制即可对接任意 OneBot v11 框架。"
---

<div class="home-code-demo">
<h2>一次调用，发送消息</h2>
<p>启动后向 <code>http://127.0.0.1:5700</code> 发送 HTTP 请求即可：</p>

::: code-group

```bash [请求]
curl -X POST 'http://127.0.0.1:5700/send_group_msg' \
  -H 'Content-Type: application/json' \
  -d '{"group_id":"<group_id>","message":[{"type":"text","data":{"text":"Hello!"}}]}'
```

```json [响应]
{
  "status": "ok",
  "retcode": 0,
  "data": {
    "message_id": "eJx..."
  }
}
```

:::

</div>

<div class="home-notice">
<h2>当前状态</h2>
<p>本项目仍在<strong>快速迭代中</strong>，接口和配置可能随版本调整。采用<strong>闭源分发二进制</strong>的方式发布，所有版本通过 GitHub Releases 提供预编译产物。</p>
<div class="notice-links">
<a href="https://github.com/icqqjs/icqq-rust-onebot-releases/releases" target="_blank">下载最新版本</a>
<span class="notice-sep">·</span>
<a href="https://github.com/icqqjs/icqq-rust-onebot-releases/issues" target="_blank">反馈问题</a>
<span class="notice-sep">·</span>
<a href="https://github.com/icqqjs/icqq-rust-onebot-releases" target="_blank">GitHub</a>
</div>
<p class="notice-disclaimer">本项目仅供学习交流，不得用于违法用途。如有侵权请通过 <a href="https://github.com/icqqjs/icqq-rust-onebot-releases/issues" target="_blank">GitHub Issue</a> 联系。</p>
</div>

