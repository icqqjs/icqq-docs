<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { createNebula } from './portal/nebula.js'
import PortalNav from './portal/PortalNav.vue'

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

let field = null
let manual = null     // null = follow the wave; 'node'|'rust' = held by the user
let cur = 0           // displayed wipe (0 = Node … 1 = Rust)

// Card geometry in the shader's coordinate space, so the card's diagonal wipe
// lines up with where the wave crest physically crosses the card.
let axisTL = -0.1
let axisBR = 0.4
const FRONT_K = 1.25 // must match the shader's `front = bal * 1.25`

function computeGeom() {
  const el = showcaseEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const W = window.innerWidth
  const H = window.innerHeight
  const axis = (sx, sy) => ((sx - W / 2) / H - (0.5 - sy / H)) * 0.66
  axisTL = axis(r.left, r.top)         // top-left corner = smallest axis
  axisBR = axis(r.right, r.bottom)     // bottom-right corner = largest axis
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// Manual switch — affects the CARD only, never the background sweep.
function setCard(side) { manual = side }

onMounted(() => {
  document.documentElement.classList.add('portal-page')
  nextTick(computeGeom)
  window.addEventListener('resize', computeGeom)

  const canvas = document.getElementById('nebula-canvas')
  field = createNebula(canvas, {
    onMode: (m) => {
      mode.value = m
      // Background settled on a runtime → the card conforms (clears manual hold).
      if (m === 'node' || m === 'rust') manual = null
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
  <div class="portal" ref="portalEl" :data-mode="mode">
    <!-- Minimal immersive navbar (only the top-right cluster) -->
    <PortalNav />

    <!-- Top progress bar: how far the current switch has swept (full = done) -->
    <div class="switch-bar"><span class="switch-fill"></span></div>

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
      <h1 class="logo-text">icqq</h1>
      <p class="slogan-text">一套协议，两种运行时驱动。</p>
    </header>

    <!-- Single spotlight showcase — content is wiped over along the same
         diagonal wave that sweeps the background. -->
    <div class="showcase-wrap">
      <div class="showcase-row">
        <button class="sc-arrow" type="button" aria-label="显示 Node" @click="setCard('node')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <a class="showcase" ref="showcaseEl" :href="withBase(activeHref)">
          <!-- Node face (base layer) -->
          <div class="face face-node">
            <div class="face-head">
              <span class="face-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                  <path d="M12 7v6m0 0c-1.5 0-3 .8-3 2.2 0 1 .8 1.6 2 1.6s2.2-.5 2.2-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="face-kicker">运行时 A · 进程内</span>
            </div>
            <h2 class="face-title">Node.js SDK</h2>
            <p class="face-desc">在 JS / TS 进程内原生 <code>import</code> 直接调用，零 IPC、零桥接开销。</p>
            <ul class="face-chips"><li>原生 import</li><li>TypeScript 类型</li><li>事件驱动</li></ul>
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
              <span class="face-kicker">运行时 B · 独立进程</span>
            </div>
            <h2 class="face-title">Rust Bridge</h2>
            <p class="face-desc">极速单二进制独立守护进程，OneBot 协议对外，任意语言皆可接入。</p>
            <ul class="face-chips"><li>单二进制</li><li>&lt; 15 MB RSS</li><li>守护进程</li></ul>
            <span class="face-cta">进入 Rust 文档 →</span>
          </div>
        </a>

        <button class="sc-arrow" type="button" aria-label="显示 Rust" @click="setCard('rust')">
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
      <p class="foot-tag">一道浪扫过 · Node 与 Rust 此消彼长</p>
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
