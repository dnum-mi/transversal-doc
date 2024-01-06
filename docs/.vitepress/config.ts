import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Projets JS/TS",
  description: "Conventions de la Fabrique Numérique",
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Rechercher...',
            buttonAriaLabel: 'Rechercher'
          },
          modal: {
            backButtonTitle: 'effacer la recherche',
            displayDetails: 'afficher les détails',
            noResultsText: 'Aucun résultat pour ',
            resetButtonTitle: 'resetButtonTitle',
            footer: {
              selectText: 'aller à ce texte',
              navigateText: 'naviguer dans les résultats',
              closeText: 'fermer'
            }
      }
        },
      }
    },
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
        items: [
          {text: 'Windows', link: '/installations/windows'},
          {text: 'macOS', link: '/installations/macos'},
          {text: 'Ubuntu', link: '/installations/ubuntu'},
        ]
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
        link: '/client/',
        items: [
          { text: 'Vue 3', link: '/client/vue3' },
          { text: 'Nuxt 3', link: '/client/nuxt3' },
          { text: 'Toaster', link: '/client/toaster' },
        ]
      },
      {
        text: 'Recettes serveur',
        link: '/serveur/',
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
      {
        text: 'CI/CD',
        link: '/ci-cd/',
        items: [
          { text: 'Principes', link: '/ci-cd/principes' },
          { text: 'Exemples', link: '/ci-cd/exemples' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dnum-mi/transversal-doc' }
    ]
  }
})
