import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const title = 'VuesomeDev'
const description = `${title} - A blog about Javascript focused on Vue.js and Node.js`

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  modern: 'client',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: description,
      },
      {
        hid: 'ogtype',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'ogurl',
        property: 'og:url',
        content: baseUrl,
      },
      {
        hid: 'ogtitle',
        property: 'og:title',
        content: title,
      },
      {
        hid: 'ogdescription',
        property: 'og:description',
        content: description,
      },
      // {
      //   hid: 'og:image',
      //   property: 'og:image',
      //   content: baseUrl,
      // },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  env: {
    baseUrl,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/theme.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/disqus'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build: https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/fontawesome',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-194404646-1',
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  fontawesome: {
    icons: {
      solid: true,
      regular: true,
      brands: true,
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
  },

  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const { text } = require('reading-time')(document.text)

        document.readingTime = text

        if (document.published_at) {
          document.ago = dayjs().to(dayjs(document.published_at))
        }
      }
    },
  },
}
