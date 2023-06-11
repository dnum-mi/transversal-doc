import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Projets JS/TS",
  description: "Conventions du Ministère de l’intérieur",
  themeConfig: {
    logo: '/nouveau-logo-marianne-gouvernement.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'outils', link: '/outils/' },
      { text: 'client', link: '/client/' },
      { text: 'serveur', link: '/serveur/' },
    ],

    sidebar: [
      {
        text: 'Recettes client',
        items: [
          { text: 'Vue 3', link: '/client/vue3' },
          { text: 'Nuxt 3', link: '/client/nuxt3' },
          { text: 'Toaster', link: '/client/toaster' },
        ]
      },
      {
        text: 'Recettes serveur',
        items: [
          { text: 'NestJS', link: '/serveur/nestjs' },
          { text: 'Fastify', link: '/serveur/fastify' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
