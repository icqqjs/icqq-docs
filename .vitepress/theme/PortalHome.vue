<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { createNebula } from './portal/nebula.js'
import PortalNav from './portal/PortalNav.vue'
// Space Grotesk, dynamically subset to the glyphs actually used on the portal
// (vite-plugin-font / cn-font-split). `brandFont.family` is the generated
// @font-face family name; the @font-face CSS is injected by this import.
// Source TTF: .vitepress/theme/assets/SpaceGrotesk.ttf (Google Fonts variable).
import { css as brandFont } from './assets/SpaceGrotesk.ttf?subsets'

// Background (nebula) mode — drives the ambient hero glow.
const mode = ref('balanced') // 'balanced' | 'node' | 'rust'
const modeLabel = computed(() => ({
  balanced: '双运行时 · 平衡态',
  node: 'Node.js · 进程内运行时',
  rust: 'Rust · 独立守护进程',
}[mode.value]))

// What the CARD currently shows (may be manually overridden, independent of bg).
const cardSide = ref('node') // 'node' | 'rust'
const activeHref = computed(() => (cardSide.value === 'rust' ? '/rust/' : '/guide/'))

const portalEl = ref(null)
const showcaseEl = ref(null)
const cardW = ref(760) // card pixel size → SVG border viewBox (kept 1:1, no distortion)
const cardH = ref(420)

const COLORS = { node: '#34e29a', rust: '#2f93ff' }

let field = null
let manual = null     // null = follow the wave; 'node'|'rust' = held by the user
let cur = 0           // displayed wipe (0 = Node … 1 = Rust)

// Card geometry in the shader's coordinate space, so the card's diagonal wipe
// lines up with where the wave crest physically crosses the card.
let axisTL = -0.1
let axisBR = 0.4
const FRONT_K = 0.82 // must match the shader's `front = bal * 0.82`

function computeGeom() {
  const el = showcaseEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const W = window.innerWidth
  const H = window.innerHeight
  const axis = (sx, sy) => ((sx - W / 2) / H - (0.5 - sy / H)) * 0.66
  axisTL = axis(r.left, r.top)         // top-left corner = smallest axis
  axisBR = axis(r.right, r.bottom)     // bottom-right corner = largest axis
  cardW.value = Math.round(r.width)
  cardH.value = Math.round(r.height)
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Manual switch — affects the CARD only, never the background sweep.
const SIDES = ['node', 'rust']
let manualAt = 0
function setCard(side) { manual = side; manualAt = performance.now() }
function stepCard(delta) {
  const i = SIDES.indexOf(cardSide.value)
  setCard(SIDES[(i + delta + SIDES.length) % SIDES.length]) // wraps → loops
}

onMounted(() => {
  document.documentElement.classList.add('portal-page')
  nextTick(computeGeom)
  window.addEventListener('resize', computeGeom)

  const canvas = document.getElementById('nebula-canvas')
  field = createNebula(canvas, {
    onMode: (m) => {
      mode.value = m
      // Background settled on a runtime → the card conforms, but honour a brief
      // manual hold first so a click always registers visibly before re-syncing.
      if ((m === 'node' || m === 'rust') && performance.now() - manualAt > 2500) manual = null
    },
    onBalance: (b) => {
      const root = portalEl.value
      if (!root) return
      // Spatial target: how far the wave crest has crossed the card (0..1),
      // unless the user is holding the card on a side.
      const wave = clamp01((b * FRONT_K - axisTL) / (axisBR - axisTL))
      const target = manual ? (manual === 'rust' ? 1 : 0) : wave
      cur += (target - cur) * 0.3
      root.style.setProperty('--wipe', cur.toFixed(4))
      const side = cur > 0.5 ? 'rust' : 'node'
      if (side !== cardSide.value) cardSide.value = side
    },
    // Forward-only border progress: incoming colour sweeps over the previous.
    onProgress: (p, incoming, base) => {
      const root = portalEl.value
      if (!root) return
      root.style.setProperty('--p', p.toFixed(4))
      root.style.setProperty('--bar-fill', COLORS[incoming])
      root.style.setProperty('--bar-base', COLORS[base])
    },
  })
  field.start()
})

onUnmounted(() => {
  document.documentElement.classList.remove('portal-page')
  window.removeEventListener('resize', computeGeom)
  field?.destroy()
})
</script>

<template>
  <div class="portal" ref="portalEl" :data-mode="mode" :style="{ '--brand-font': brandFont.family }">
    <!-- Minimal immersive navbar (only the top-right cluster) -->
    <PortalNav />

    <!-- CSS fallback / base, sits under the shader -->
    <div class="fallback-bg"></div>

    <!-- Diagonal-wave nebula -->
    <canvas id="nebula-canvas"></canvas>

    <!-- Hero -->
    <header class="hero">
      <span class="eyebrow">
        <span class="eyebrow-dot"></span>
        <span class="eyebrow-label">{{ modeLabel }}</span>
      </span>
      <h1 class="logo-text">ICQQ</h1>
      <p class="slogan-text">QQ 协议的现代实现 · Node 与 Rust 双运行时</p>
    </header>

    <!-- Single spotlight showcase — content is wiped over along the same
         diagonal wave that sweeps the background. -->
    <div class="showcase-wrap">
      <div class="showcase-row">
        <button class="sc-arrow" type="button" aria-label="上一个运行时" @click="stepCard(-1)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <a class="showcase" ref="showcaseEl" :href="withBase(activeHref)">
          <!-- Forward-only perimeter progress: base = previous colour (full),
               fill = incoming colour drawing around 0→1 each lap. -->
          <svg class="sc-border" :viewBox="`0 0 ${cardW} ${cardH}`" preserveAspectRatio="none" aria-hidden="true">
            <rect class="sc-border-base" x="1.25" y="1.25" :width="cardW - 2.5" :height="cardH - 2.5" rx="24" pathLength="1"/>
            <rect class="sc-border-fill" x="1.25" y="1.25" :width="cardW - 2.5" :height="cardH - 2.5" rx="24" pathLength="1"/>
          </svg>

          <!-- Node face (base layer) -->
          <div class="face face-node">
            <div class="face-head">
              <span class="face-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                  <path d="M12 7v6m0 0c-1.5 0-3 .8-3 2.2 0 1 .8 1.6 2 1.6s2.2-.5 2.2-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="face-kicker">运行时 · 进程内</span>
            </div>
            <h2 class="face-title">Node.js SDK</h2>
            <p class="face-desc">在 JS / TS 进程内直接 <code>import</code> 调用——完整类型、事件驱动，零 IPC、零桥接开销。</p>
            <ul class="face-chips"><li>原生 import</li><li>TypeScript</li><li>事件驱动</li></ul>
            <span class="face-rule"></span>
            <span class="face-cta">进入 Node 文档 →</span>
          </div>

          <!-- Rust face (revealed diagonally as the wave passes) -->
          <div class="face face-rust">
            <div class="face-head">
              <span class="face-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path d="M12 3l7 4.5v9L12 21l-7-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                  <path d="M12 7.5l4 2.5v4l-4 2.5-4-2.5v-4l4-2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="face-kicker">运行时 · 独立进程</span>
            </div>
            <h2 class="face-title">Rust OneBot</h2>
            <p class="face-desc">纯 Rust 实现的单二进制守护进程，提供标准 OneBot 11 协议接口——任意语言、任意框架均可接入，高性能、低资源占用。</p>
            <ul class="face-chips"><li>单二进制</li><li>守护进程</li><li>&lt; 15 MB</li></ul>
            <span class="face-rule"></span>
            <span class="face-cta">进入 Rust 文档 →</span>
          </div>
        </a>

        <button class="sc-arrow" type="button" aria-label="下一个运行时" @click="stepCard(1)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <!-- Pager: which runtime is in the spotlight (click to hold the card) -->
      <div class="pager">
        <button class="pg pg-node" :class="{ on: cardSide === 'node' }" type="button" aria-label="Node" @click="setCard('node')"></button>
        <button class="pg pg-rust" :class="{ on: cardSide === 'rust' }" type="button" aria-label="Rust" @click="setCard('rust')"></button>
      </div>
    </div>

    <footer class="portal-foot">
      <p class="foot-tag">从 oicq 到 icqq，从 JS 到 Rust —— 始终为协议而生</p>
      <p class="foot-copy">Copyright © 2026–present icqqjs contributors</p>
    </footer>
  </div>
</template>

<!-- Global chrome overrides (page shell) — unscoped on purpose. -->
<style lang="scss">
@use './portal/chrome';
</style>

<!-- Component-scoped portal styles. -->
<style scoped lang="scss">
@use './portal/background';
@use './portal/hero';
@use './portal/showcase';
@use './portal/animations';
@use './portal/responsive';
</style>
