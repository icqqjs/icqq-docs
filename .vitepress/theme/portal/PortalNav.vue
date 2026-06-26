<script setup>
import { inject } from 'vue'
import { useData } from 'vitepress'
import { VPSocialLinks } from 'vitepress/theme'

const { theme, isDark } = useData()
const social = theme.value.socialLinks || []

// VitePress's own appearance toggle (same fallback its VPSwitchAppearance uses).
const toggleAppearance = inject('toggle-appearance', () => { isDark.value = !isDark.value })
</script>

<template>
  <!-- Fully immersive: only a small top-right utility cluster. -->
  <header class="pnav">
    <div class="pnav-right">
      <VPSocialLinks v-if="social.length" class="pnav-social" :links="social" />
      <button class="pnav-toggle" type="button" aria-label="切换深浅色" @click="toggleAppearance">
        <svg v-if="isDark" class="pnav-ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>
        </svg>
        <svg v-else class="pnav-ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use 'nav';
</style>
