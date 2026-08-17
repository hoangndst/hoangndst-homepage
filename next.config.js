const createMDX = require('@next/mdx')
const path = require('node:path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'false',
})
const remarkGithubAlertPluginPath = path.join(process.cwd(), 'src/lib/mdx/remark-github-alert.mjs')

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm', 'remark-math', remarkGithubAlertPluginPath],
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', { behavior: 'prepend' }],
      ['rehype-katex', { strict: 'ignore', throwOnError: false }],
      'rehype-katex-notranslate',
      ['rehype-citation', { path: path.join(process.cwd(), 'src/data') }],
      ['rehype-prism-plus', { defaultLanguage: 'js', ignoreMissing: true }],
    ],
  },
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com giscus.app https://assets.calendly.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src 'self' blob: *;
  font-src 'self';
  frame-src giscus.app https://www.youtube.com https://www.youtube-nocookie.com https://github.com https://calendly.com;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next').NextConfig}
 **/
module.exports = () => {
  const plugins = [withMDX, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    basePath,
    reactStrictMode: true,
    experimental: {
      viewTransition: true,
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.waterstones.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn-images-1.medium.com',
        },
        {
          protocol: 'https',
          hostname: 'miro.medium.com',
        },
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        {
          source: '/feed.xml',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/rss+xml; charset=utf-8',
            },
          ],
        },
        {
          source: '/tags/:tag/feed.xml',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/rss+xml; charset=utf-8',
            },
          ],
        },
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
