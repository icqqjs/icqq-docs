import DefaultTheme from 'vitepress/theme'
import HomeLayout from './HomeLayout.vue'
import PortalHome from './PortalHome.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: HomeLayout,
  enhanceApp({ app }) {
    // 门户首页组件，供根 index.md 使用
    app.component('PortalHome', PortalHome)
  },
}
