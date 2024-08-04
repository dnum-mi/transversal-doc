// https://vitepress.dev/guide/custom-theme
import type { EnhanceAppContext } from 'vitepress'

import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  ...Theme,
  outlineTitle: 'Sur cette page',
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    app.use(TwoSlashFloatingVue)
  }
}
