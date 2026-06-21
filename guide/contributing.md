# 贡献

欢迎为 icqq 与本文档站贡献。

## 代码（icqq 库）

- 仓库：<https://github.com/icqqjs/icqq>
- 提交前请跑 `npm run lint`。
- 提交信息遵循 [Release Please](https://github.com/googleapis/release-please) 约定（如 `fix:`、`feat:`）。

## 文档（本站）

- 本站是 **icqq 多实现文档站**，按实现分区，详见[文档站结构规范](/STRUCTURE)。
- 写 / 改 icqq（Node 库）文档前，请先读[文档编写规范](/guide/docs-style)，按其中的「方法 / 事件 / 消息段」模板来写。
- 本地预览：

```bash
npm install
npm run docs:dev
```

- 原则：只描述库对外的公开能力（方法、参数、返回值、事件、消息段、示例、必要限制）；不写协议内部链路、第三方框架、真实账号 / token。
