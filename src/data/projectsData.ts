interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Kusion',
    description: `Declarative Intent Driven Platform Orchestrator for Internal Developer Platform (IDP).`,
    imgSrc: 'https://raw.githubusercontent.com/KusionStack/kusion/main/docs/overview.jpg',
    href: 'https://github.com/KusionStack/kusion',
  },
  {
    title: 'Doc Formatter',
    description: 'A document formatter that uses AI to clean up files before they are shared.',
    href: 'https://github.com/a1y-developer/doc-formatter',
    imgSrc: '/static/images/doc-formatter.png',
  },
  {
    title: 'Container Monitoring Mobile App',
    description: 'A mobile app for monitoring container metrics and logs, with an AI assistant for Docker hosts.',
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/container-monitoring-app/refs/heads/main/assets/images/demo_2.png',
    href: 'https://github.com/hoangndst/container-monitoring-app',
  },
  {
    title: 'Kusion Backstage Plugin',
    description: 'Plugins and modules that bring Kusion into the Backstage developer portal.',
    imgSrc: 'https://raw.githubusercontent.com/KusionStack/kusion/main/docs/overview.jpg',
    href: 'https://github.com/KusionStack/kusion-backstage-plugin',
  },
  {
    title: 'Homepage',
    description: `My personal website. Blogging about my experiences, projects, and other things that interest me.`,
    imgSrc: '/static/images/homepage.png',
    href: 'https://github.com/hoangndst/hoangndst-homepage',
  },
  {
    title: 'DevOps Sphere',
    description: 'A DevOps platform for automating delivery, managing source code, and improving software security. Built for Viettel Cloud.',
    imgSrc: '/static/images/devops-sphere.png',
    href: 'https://viettelcloud.vn/en/products/60',
  },
  {
    title: 'Cluster Upgrade Operator',
    description: 'A Cluster API operator for rolling and blue-green Kubernetes upgrades. Built for Viettel Cloud.',
    imgSrc: 'https://cluster-api.sigs.k8s.io/images/introduction.svg',
    href: 'https://viettelcloud.vn/en/products/8/30',
  },
  {
    title: '@danchoicloud GitHub App',
    description: 'GitHub App for @danchoicloud that supports PR review, task force coordination, CLA checks, and other repository automations.',
    imgSrc: '/static/images/danchoicloud-gh.png',
    href: 'https://github.com/a1y-developer/danchoicloud-gh',
  },
  {
    title: '@danchoicloud Genkit',
    description: 'An AI-assisted tool for monitoring and managing containers, built with Genkit.',
    imgSrc: '',
    href: 'https://github.com/hoangndst/danchoicloud-genkit',
  },
  {
    title: "@danchoicloud_bot",
    description: "Telegram chat bot to help manage my everyday tasks.",
    imgSrc: '/static/images/danchoicloud_bot.png',
    href: "https://github.com/hoangndst/danchoicloud",
  },
  {
    title: 'Project Management System',
    description: `A project management system that helps teams to collaborate and manage projects from start to finish.`,
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/pm/master/pm-client/public/preview.png',
    href: 'https://github.com/hoangndst/pm',
  },
  {
    title: 'Super Bomberman',
    description: 'A Super Bomberman 2 remake with pathfinding and smart monster behavior.',
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/bomb/master/core/assets/img/map1.png',
    href: 'https://github.com/hoangndst/bomb',
  },
  {
    title: 'Dictionary',
    description: `Online dictionary, multi-language support.`,
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/dictionary-java/refs/heads/master/demo/dashboard.png',
    href: 'https://github.com/hoangndst/dictionary-java',
  },
  {
    title: 'Evaluate network performance',
    description: `A tool to evaluate network performance.`,
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/evaluate-network-performance/main/wireless/assets/granularity.png',
    href: 'https://github.com/hoangndst/evaluate-network-performance',
  },
  {
    title: 'Gas Warning System',
    description: `Gas warning system at mines using network mesh.`,
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/gas-warning-system/refs/heads/main/assets/frontend.png',
    href: 'https://github.com/hoangndst/gas-warning-system',
  },
  {
    title: 'caro-ai',
    description: 'A Gomoku AI using minimax, alpha-beta pruning, and Zobrist hashing.',
    imgSrc: '',
    href: 'https://github.com/hoangndst/caro-ai',
  },
  {
    title: 'Ratelimit',
    description: `Golang rate limit library.`,
    imgSrc: '',
    href: 'https://github.com/hoangndst/ratelimit',
  },
  {
    title: '510Pay',
    description: 'A small web app for friends at My Dinh dormitory to manage shared money.',
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/510pay/master/src/images/readme/7.png',
    href: 'https://github.com/hoangndst/510pay',
  },
  {
    title: "Kmeans Algorithm Visualization",
    description: 'An interactive visualization for understanding the K-means algorithm.',
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/kmeans-visualization/main/img/kmeans.gif',
    href: "https://github.com/hoangndst/kmeans-visualization",
  },
  {
    title: "stuffops",
    description: 'Utilities for deploying and managing containers with Docker and Kubernetes.',
    imgSrc: '',
    href: "https://github.com/hoangndst/stuffops",
  },
  {
    title: "@buddy",
    description: 'A Discord bot with AI features for game help, reminders, notifications, and tasks.', 
    imgSrc: '/static/images/buddy_bot.png',
    href: "https://github.com/hoangndst/buddy",
  }
]

export default projectsData
