<script setup>
import { withBase } from 'vitepress'

// 门户首页：选择实现。只保留 Node 库 / Rust 两个入口。
const impls = [
  {
    href: '/guide/',
    icon: '📦',
    name: 'icqq',
    tag: 'Node 库 · TypeScript',
    desc: '在你自己的 Node 进程里 import 调用——方法调用 + 事件监听，用 JS / TS 写机器人。',
    points: ['import 即用，无需独立服务', 'EventEmitter 事件 + 链式联系人对象'],
    cta: '进入 Node 库文档',
  },
  {
    href: '/rust/',
    icon: '🦀',
    name: 'icqq-rs',
    tag: 'OneBot 11 桥 · Rust',
    desc: '独立进程，对外暴露 OneBot 11 的 HTTP / WebSocket 接口，跨语言对接。',
    points: ['HTTP / WebSocket 双通道', '单二进制部署，零 JS 运行时'],
    cta: '进入 Rust 桥文档',
  },
]
</script>

<template>
  <div class="portal">
    <header class="portal-hero">
      <img class="portal-logo" :src="withBase('/logo.png')" alt="icqq" />
      <h1 class="portal-name">icqq</h1>
      <p class="portal-text">QQ 协议的多实现文档中心</p>
      <p class="portal-tagline">一套协议，两种用法，按需选择。</p>
    </header>

    <div class="portal-grid">
      <a
        v-for="it in impls"
        :key="it.href"
        class="portal-card"
        :href="withBase(it.href)"
      >
        <div class="portal-card-icon">{{ it.icon }}</div>
        <div class="portal-card-head">
          <span class="portal-card-name">{{ it.name }}</span>
          <span class="portal-card-tag">{{ it.tag }}</span>
        </div>
        <p class="portal-card-desc">{{ it.desc }}</p>
        <ul class="portal-card-points">
          <li v-for="p in it.points" :key="p">{{ p }}</li>
        </ul>
        <span class="portal-card-cta">{{ it.cta }} →</span>
      </a>
    </div>

    <p class="portal-foot">
      不确定选哪个？用 JS / TS 写机器人 → <strong>Node 库</strong>；要 HTTP / OneBot 接口 → <strong>Rust 桥</strong>。
    </p>
  </div>
</template>

<style scoped>
.portal {
  max-width: 940px;
  margin: 0 auto;
  padding: 72px 24px 88px;
}

/* ── Hero ── */
.portal-hero {
  text-align: center;
  margin-bottom: 52px;
}

.portal-logo {
  width: 74px;
  height: 74px;
  display: block;
  margin: 0 auto 18px;
  filter: drop-shadow(0 10px 22px rgba(31, 35, 47, 0.12));
}

.portal-name {
  margin: 0;
  font-size: 3.4rem;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  background: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.portal-text {
  margin: 10px 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.portal-tagline {
  margin: 12px 0 0;
  font-size: 1.02rem;
  color: var(--vp-c-text-2);
}

/* ── Cards ── */
.portal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.portal-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 26px;
  border-radius: 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: inherit;
  text-decoration: none !important;
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
}

.portal-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--brand-gradient);
  opacity: 0.55;
  transition: opacity 0.28s ease;
}

.portal-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 78, 0, 0.18);
  box-shadow:
    0 16px 40px -12px rgba(255, 78, 0, 0.16),
    0 6px 16px -6px rgba(0, 0, 0, 0.06);
}

.portal-card:hover::before {
  opacity: 1;
}

.portal-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 18px;
  font-size: 27px;
  border-radius: 13px;
  background: var(--brand-gradient-soft);
}

.portal-card-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.portal-card-name {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.portal-card-tag {
  padding: 3px 9px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 99px;
}

.portal-card-desc {
  margin: 0 0 14px;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.portal-card-points {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
}

.portal-card-points li {
  position: relative;
  padding-left: 20px;
  font-size: 0.88rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.portal-card-points li::before {
  content: "✓";
  position: absolute;
  left: 0;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.portal-card-cta {
  margin-top: auto;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

/* ── Footer hint ── */
.portal-foot {
  margin: 40px auto 0;
  max-width: 620px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-3);
}

.portal-foot strong {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* ── Mobile ── */
@media (max-width: 720px) {
  .portal {
    padding: 48px 20px 64px;
  }

  .portal-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .portal-name {
    font-size: 2.6rem;
  }

  .portal-text {
    font-size: 1.25rem;
  }
}
</style>
