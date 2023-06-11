import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Projets JS/TS",
  description: "Conventions de la Fabrique Numérique",
  themeConfig: {
    outline:{
      level: 2,
      label: 'Sur cette page :',
    },
    logo: '/nouveau-logo-marianne-gouvernement.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Ce document',
        link: '/ce-document',
        items: []
      },
      {
        text: 'Les outils du dev',
        link: '/outils/',
        items: []
      },
      {
        text: 'Conventions',
        link: '/conventions/',
        items: [
          {text: 'Documentation', link: '/conventions/documentation'},
          {text: 'Nommage', link: '/conventions/nommage'},
          {text: 'Architecture des dossiers', link: '/conventions/architecture-dossiers'},
          {text: 'TypeScript', link: '/conventions/typescript'},
          {text: 'RESTful API', link: '/conventions/api-restful'},
          {text: 'Lint et Formattage', link: '/conventions/lint-formattage'},
          {text: 'Autres conventions', link: '/conventions/autres'},
        ],
      },
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
      },
      {
        text: 'Recettes monorepo',
        items: [
          { text: 'pnpm', link: '/monorepo/pnpm' },
          { text: 'turbo', link: '/monorepo/turbo' },
          { text: 'Gabarit de monorepo', link: '/monorepo/gabarit' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
