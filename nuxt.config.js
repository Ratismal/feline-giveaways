const config = require('./config.json');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Feline Giveaways',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'An interface for password-protected discord giveaways.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js', body: true }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  modules: [
    ["@nuxtjs/axios", {
      prefix: "/api",
      proxy: true,
      port: 8102
    }]
  ],
  plugins: [
    '~/plugins/auth'
  ],
  proxy: {
    "/api/": config.origin || "https://giveaways.stupidcat.me"
  },
  mode: 'spa',

  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
