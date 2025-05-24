interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Kusion ',
    description: `Declarative Intent Driven Platform Orchestrator for Internal Developer Platform (IDP).`,
    imgSrc: 'https://raw.githubusercontent.com/KusionStack/kusion/main/docs/overview.jpg',
    href: 'https://github.com/KusionStack/kusion',
  },
  {
    title: 'Kusion Backstage Plugin',
    description: 'Kusion Plugins and Modules that integrates with the Backstage developer portal platform. Enables developers to manage Kusion directly through Backstage.',
    imgSrc: 'https://raw.githubusercontent.com/KusionStack/kusion/main/docs/overview.jpg',
    href: 'https://github.com/KusionStack/kusion-backstage-plugin',
  },
  {
    title: 'Homepage',
    description: `My personal website. CI/CD Automation. Hosted on Raspberry Pi.`,
    imgSrc: '/static/images/homepage.png',
    href: 'https://github.com/hoangndst/hoangndst-homepage',
  },
  {
    title: 'DevOps Sphere',
    description: `A comprehensive solution designed to optimize the software development process for businesses. By integrating advanced DevOps tools and services, automates CI/CD processes, efficiently manages source code, and ensures security throughout.`,
    imgSrc: '/static/images/devops-sphere.png',
    href: 'https://viettelcloud.vn/en/products/60',
  },
  {
    title: 'Cluster Upgrade Operator',
    description: `Automate the process of upgrading a Kubernetes cluster managed by Cluster API.`,
    imgSrc: 'https://cluster-api.sigs.k8s.io/images/introduction.svg',
    href: 'https://viettelcloud.vn/en/products/8/30',
  },
  {
    title: 'Ratelimit',
    description: `Golang rate limit library.`,
    imgSrc: '/static/images/golang.png',
    href: 'https://github.com/hoangndst/ratelimit',
  },
  {
    title: 'Project Management System',
    description: `A project management system that helps teams to collaborate and manage projects from start to finish.`,
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/pm/master/pm-client/public/preview.png',
    href: 'https://github.com/hoangndst/pm',
  },
  {
    title: 'Super Bomberman',
    description: `Remake SuperBomberman 2. Applying algorithms to find the way for monsters and monsters that are able to dodge
    bombs and dodge fire in a smart way.`,
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
    description: `This is a project for AI course. The goal is to create a Gomoku AI using Minimax Algorithm with Alpha-Beta Pruning and Zobrist Hashing.`,
    imgSrc: '/static/images/golang.png',
    href: 'https://github.com/hoangndst/caro-ai',
  },
  {
    title: '510Pay',
    description: `An funny online web app I made for my homies at My Dinh dormitory to manage our money.`,
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/510pay/master/src/images/readme/7.png',
    href: 'https://github.com/hoangndst/510pay',
  },
  {
    title: "Kmeans Algorithm Visualization",
    description: "This is a visualization of Kmeans algorithm. Help people to understand the algorithm and apply it to their own data.",
    imgSrc: 'https://raw.githubusercontent.com/hoangndst/kmeans-visualization/main/img/kmeans.gif',
    href: "https://github.com/hoangndst/kmeans-visualization",
  },
  {
    title: "stuffops",
    description: "All helpful container deployment and management on Docker and Kubernetes.",
    imgSrc: '/static/images/golang.png',
    href: "https://github.com/hoangndst/stuffops",
  },
  {
    title: "@danchoicloud_bot",
    description: "Telegram chat bot to notify, remind, send random girl images, manage tasks and more.",
    imgSrc: '/static/images/danchoicloud_bot.png',
    href: "https://github.com/hoangndst/danchoicloud",
  },
  {
    title: "@buddy",
    description: "Discord bot integrated with AI models, help friends about game play, remind, notify, manage tasks and more.", 
    imgSrc: '/static/images/buddy_bot.png',
    href: "https://github.com/hoangndst/buddy",
  }
]

export default projectsData
