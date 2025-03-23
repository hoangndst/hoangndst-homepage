/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: '@hoangndst',
  author: 'Hoang Dinh Nguyen',
  headerTitle: '@hoangndst',
  description: 'Tech stuffs, thoughts and more',
  openToWork: true,
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://hoangndst.com',
  siteRepo: 'https://github.com/hoangndst/hoangndst-homepage',
  siteLogo: `https://hoangndst.com/static/images/logo.png`,
  socialBanner: `https://hoangndst.com/static/images/homepage.png`,
  email: 'hoangndst@gmail.com',
  github: 'https://github.com/hoangndst',
  x: 'https://x.com/hoangndst',
  youtube: 'https://youtube.com/@hoangndst',
  linkedin: 'https://www.linkedin.com/in/hoangndst',
  instagram: 'https://www.instagram.com/hoangndst',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: true,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    // umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      // umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    // },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    googleAnalytics: {
      googleAnalyticsId: 'G-0FC2XQL731', // e.g. G-XXXXXXX
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: 'hoangndst/hoangndst-homepage',
      repositoryId: 'R_kgDOIPvQkg',
      category: '@hoangndst',
      categoryId: 'DIC_kwDOIPvQks4CkjuW',
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
  },
}

module.exports = siteMetadata
