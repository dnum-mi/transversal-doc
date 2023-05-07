import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Conventions projets JS/TS",
  description: "Conventions du Ministère de l’intérieur",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'outils', link: '/outils/' },
      { text: 'client', link: '/client' },
      { text: 'serveur', link: '/serveur' }
    ],

    sidebar: [
      {
        text: 'Recettes client',
        items: [
          { text: 'Vue 3', link: '/client/vue3-recettes' },
          { text: 'Nuxt 3', link: '/client/nuxt3-recettes' }
        ]
      },
      {
        text: 'Recettes serveurs',
        items: [
          { text: 'NestJS', link: '/serveurs/nestjs-recettes' },
          { text: 'Fastify', link: '/serveurs/fastify-recettes' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
