const fs = require('fs')

const blogDirectory = 'docs/pages/blog'
// get .md files
const blogPosts = fs.readdirSync(blogDirectory)
// { description, rendered, title, headers } = docs.en;
const blogPostsInfo = blogPosts.map((file) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { description, title, headers } = require(`./${blogDirectory}/${file}?@mui/markdown`).docs.en
  return {
    description,
    title,
    slug: file.replace('.md', ''),
    date: headers.date,
  }
})

// write to file
fs.writeFileSync(
  'docs/pages/blog/blogPostsInfo.json',
  JSON.stringify(blogPostsInfo, null, 2),
)