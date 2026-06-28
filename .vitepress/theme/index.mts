import DefaultTheme from 'vitepress/theme'
import HomeLayout from './HomeLayout.vue'
import HomeHero from './HomeHero.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: HomeLayout,
  enhanceApp({ app }) {
    // 根首页自定义 hero（代码主角 + 运行时双面板），供 index.md 使用
    app.component('HomeHero', HomeHero)
  },
}
