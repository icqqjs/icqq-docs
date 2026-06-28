<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'

// 代码主角：Node 进程内 import vs Rust OneBot HTTP，二选一切换。
// 每个样本是「逐行高亮 HTML」数组；复制内容由其去标签还原。
const samples = {
  node: {
    label: 'Node.js',
    lines: [
      `<span class="c">// 1. 引入 createClient 工厂函数</span>`,
      `<span class="k">import</span> { <span class="fn">createClient</span> } <span class="k">from</span> <span class="s">'icqq'</span>`,
      ``,
      `<span class="c">// 2. 创建一个机器人实例</span>`,
      `<span class="kd">const</span> bot = <span class="fn">createClient</span>()`,
      ``,
      `<span class="c">// 3. 监听群消息事件，实现简单的 ping-pong 回复</span>`,
      `bot.<span class="fn">on</span>(<span class="s">'message.group'</span>, (e) => {`,
      `  <span class="k">if</span> (e.raw_message === <span class="s">'ping'</span>)`,
      `    e.<span class="fn">reply</span>(<span class="s">'pong'</span>)`,
      `})`,
      ``,
      `<span class="c">// 4. 输入账号密码登录</span>`,
      `bot.<span class="fn">login</span>(<span class="n">10086</span>, <span class="s">'password'</span>)`,
    ],
  },
  onebot: {
    label: 'Rust · OneBot',
    lines: [
      `<span class="c"># 1. 拷贝示例配置，自行修改账号密码与通信端口</span>`,
      `<span class="fn">cp</span> config.default.toml config.toml`,
      ``,
      `<span class="c"># 2. 赋予运行权限并启动进程 (Linux / macOS)</span>`,
      `<span class="fn">chmod</span> +x ./icqq-rs`,
      `<span class="fn">./icqq-rs</span> &`,
      ``,
      `<span class="c"># 3. Windows 用户可直接双击运行 icqq-rs.exe 提权并启动</span>`,
      ``,
      `<span class="c"># 4. 任意语言皆可通过标准 API (HTTP / WS) 进行调用</span>`,
      `<span class="fn">curl</span> http://127.0.0.1:5700<span class="p">/send_group_msg</span> \\`,
      `  -H <span class="s">'Content-Type: application/json'</span> \\`,
      `  -d <span class="s">'{ "group_id": 10086, "message": "pong" }'</span>`,
      `<span class="c"># → { "status": "ok", "retcode": 0 }</span>`,
    ],
  },
}

const tab = ref('node')
const copied = ref(false)

const lines = computed(() => samples[tab.value].lines)

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

async function copyCode() {
  const text = samples[tab.value].lines.map(stripTags).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    /* clipboard 不可用时静默 */
  }
}
</script>

<template>
  <div class="hh">
    <section class="hh-hero">
      <div class="hh-lead">
        <div class="hh-eyebrow">
          <i class="hh-dot"></i>
          <span class="evo-step">oicq</span>
          <svg class="evo-arr" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          <span class="evo-step">icqq</span>
          <svg class="evo-arr" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          <span class="evo-step">onebot</span>
        </div>

        <h1 class="hh-title">
        <span class="hh-accent">ICQQ · Protocol</span> <br />
        </h1>

        <p class="hh-sub">          
          优雅 · 轻量 · 高性能<br />
          现代化的 QQ 协议实现，支持 Node.js 与 Rust 平台，提供丰富的 API 与事件系统，助你快速构建 QQ 机器人。
        </p>

        <div class="hh-cta">
          <a class="hh-btn hh-btn-primary" :href="withBase('/guide/')">
            开始使用 · Node <span class="arr">→</span>
          </a>
          <a class="hh-btn hh-btn-outline" :href="withBase('/rust/')">Rust OneBot</a>
          <a class="hh-btn hh-btn-ghost" href="https://github.com/icqqjs/icqq" target="_blank"
            rel="noreferrer">GitHub</a>
        </div>
      </div>

      <!-- 代码面板 -->
      <div class="hh-code">
        <div class="hh-code-bar">
          <span class="hh-traffic"><i></i><i></i><i></i></span>
          <div class="hh-tabs">
            <button v-for="(s, key) in samples" :key="key" :class="{ on: tab === key }" @click="tab = key">{{ s.label
              }}</button>
          </div>
          <button class="hh-copy" :class="{ done: copied }" type="button" @click="copyCode">
            <svg v-if="!copied" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{{ copied ? '已复制' : '复制' }}</span>
          </button>
        </div>

        <div class="hh-pre">
          <div v-for="(line, i) in lines" :key="i" class="hh-row">
            <span class="hh-no">{{ i + 1 }}</span>
            <span class="hh-ln" v-html="line || '&#8203;'"></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hh {
  --hh-code-bg: #1e1e1e;
  --hh-code-fg: #d4d4d4;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.hh::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(48% 55% at 26% 30%, rgba(56, 189, 248, 0.16), transparent 70%),
    radial-gradient(42% 50% at 86% 16%, rgba(129, 140, 248, 0.10), transparent 70%);
}

.dark .hh::before {
  background:
    radial-gradient(48% 55% at 26% 30%, rgba(56, 189, 248, 0.14), transparent 70%),
    radial-gradient(42% 50% at 86% 16%, rgba(129, 140, 248, 0.10), transparent 70%);
}

/* ---------- Hero ---------- */
.hh-hero {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;
  padding: 40px 0;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 56px;
  align-items: center;
}

.hh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
  padding: 6px 16px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 9999px;
  background: var(--vp-c-bg-soft);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px -4px var(--vp-c-brand-soft);
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace;
}

.hh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
  flex: none;
  animation: dot-pulse 2s infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.5; box-shadow: 0 0 4px rgba(34, 197, 94, 0.4); }
  50% { opacity: 1; box-shadow: 0 0 10px rgba(34, 197, 94, 0.8); }
}

.hh-eyebrow::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
  opacity: 0.15;
  animation: sweep 5s linear infinite;
  pointer-events: none;
}

@keyframes sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.evo-step {
  color: var(--vp-c-text-2);
  animation: evo-color-wave 5s infinite;
}

.evo-arr {
  color: var(--vp-c-text-3);
  opacity: 0.4;
  animation: evo-arr-wave 5s infinite;
}

/* 顺序轮播: 总时长 5s，每个元素延迟 1s */
.evo-step:nth-of-type(1) { animation-delay: 0s; }
.evo-arr:nth-of-type(1)  { animation-delay: 1s; }
.evo-step:nth-of-type(2) { animation-delay: 2s; }
.evo-arr:nth-of-type(2)  { animation-delay: 3s; }
.evo-step:nth-of-type(3) { animation-delay: 4s; }

@keyframes evo-color-wave {
  0%, 40%, 100% {
    color: var(--vp-c-text-2);
  }
  20% {
    color: var(--vp-c-brand-1);
  }
}

@keyframes evo-arr-wave {
  0%, 40%, 100% {
    color: var(--vp-c-text-3);
    opacity: 0.4;
  }
  20% {
    color: var(--vp-c-brand-1);
    opacity: 0.9;
  }
}

.hh-title {
  margin: 22px 0 0;
  font-size: clamp(2.4rem, 4.6vw, 3.6rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.hh-accent {
  color: var(--vp-c-brand-1);
}

.hh-sub {
  margin: 22px 0 0;
  font-size: 1.06rem;
  line-height: 1.85;
  font-weight: 300;
  color: var(--vp-c-text-2);
}

.hh-sub b {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.hh-cta {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  padding: 0 24px;
  border-radius: 9999px;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.hh-btn .arr {
  transition: transform 0.2s;
}

.hh-btn:hover .arr {
  transform: translateX(3px);
}

.hh-btn-primary {
  color: #fff;
  background-color: var(--vp-c-brand-1);
}

.hh-btn-primary:hover {
  background-color: var(--vp-c-brand-2);
}

.hh-btn-outline {
  color: var(--vp-c-text-1);
  background-color: transparent;
  border: 1px solid var(--vp-c-border);
}

.hh-btn-outline:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.hh-btn-ghost {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid transparent;
}

.hh-btn-ghost:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}

/* ---------- Code panel ---------- */
.hh-code {
  position: relative;
  border-radius: 14px;
  background: var(--hh-code-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 60px -24px rgba(8, 14, 26, 0.55);
  overflow: hidden;
}

.hh-code-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 46px;
  padding: 0 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.02);
}

.hh-traffic {
  display: inline-flex;
  gap: 8px;
  flex: none;
}

.hh-traffic i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.hh-traffic i:nth-child(1) {
  background: #ff5f56;
}

.hh-traffic i:nth-child(2) {
  background: #ffbd2e;
}

.hh-traffic i:nth-child(3) {
  background: #27c93f;
}

.hh-tabs {
  display: flex;
  gap: 2px;
  align-self: flex-end;
}

.hh-tabs button {
  padding: 8px 14px 8px;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: #7c8aa0;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  position: relative;
  top: 1px;
}

.hh-tabs button.on {
  color: #fff;
  background: var(--hh-code-bg);
  border-color: rgba(255, 255, 255, 0.07);
}

.hh-tabs button:hover:not(.on) {
  color: #c6d2e3;
  background: rgba(255, 255, 255, 0.02);
}

.hh-copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
}

.hh-copy svg {
  transform: translateY(-1px);
}

.hh-copy {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  background: transparent;
  color: #8b97ac;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.hh-copy:hover {
  color: #c6d2e3;
  border-color: rgba(255, 255, 255, 0.22);
}

.hh-copy.done {
  color: #27c93f;
  border-color: rgba(39, 201, 63, 0.4);
}

.hh-pre {
  margin: 0;
  padding: 16px 16px 18px;
  overflow-x: auto;
  min-height: 314px;
  font-family: 'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.86rem;
  color: var(--hh-code-fg);
}

.hh-row {
  display: flex;
  line-height: 1.6;
}

.hh-no {
  flex: none;
  width: 2.5em;
  padding-right: 16px;
  text-align: right;
  color: #858585;
  user-select: none;
  -webkit-user-select: none;
}

.hh-ln {
  white-space: pre;
}

.hh-ln :deep(.k) {
  color: #c586c0; /* Control flow, import, export */
}

.hh-ln :deep(.kd) {
  color: #569cd6; /* Variable declarations */
}

.hh-ln :deep(.fn) {
  color: #dcdcaa; /* Functions */
}

.hh-ln :deep(.s) {
  color: #ce9178; /* Strings */
}

.hh-ln :deep(.n) {
  color: #b5cea8; /* Numbers */
}

.hh-ln :deep(.c) {
  color: #6a9955; /* Comments */
}

.hh-ln :deep(.p) {
  color: #9cdcfe; /* Variables/Properties */
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .hh {
    align-items: flex-start;
  }

  .hh-hero {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 36px 0 48px;
  }
}

@media (max-width: 560px) {
  .hh {
    padding: 0 18px;
  }

  .hh-sub {
    font-size: 1rem;
  }

  .hh-pre {
    font-size: 0.78rem;
    min-height: 0;
  }

  .hh-code-bar {
    gap: 8px;
    padding: 0 10px;
  }

  .hh-tabs button {
    white-space: nowrap;
    padding: 5px 9px;
    font-size: 0.76rem;
  }

  .hh-copy {
    padding: 7px;
  }

  .hh-copy span {
    display: none;
  }

  /* 窄屏只留图标 */
}
</style>
