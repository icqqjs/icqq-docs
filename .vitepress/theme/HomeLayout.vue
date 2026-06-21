<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const route = useRoute()

// 仅在 Rust 桥 landing（/rust/，layout: home）显示其指标统计条。
// 根门户首页用 PortalHome 组件（layout: page），不走这里。
const isRust = computed(() => route.path.startsWith('/rust'))

const rustStats = [
  { value: '60+', label: 'API' },
  { value: '100%', label: 'Rust' },
  { value: '< 15 MB', label: 'RSS' },
  { value: '0', label: 'JS runtime' },
]
</script>

<template>
  <Layout>
    <template #home-features-before>
      <div v-if="isRust" class="stats-bar">
        <div class="stat-item" v-for="s in rustStats" :key="s.label">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </template>
  </Layout>
</template>
