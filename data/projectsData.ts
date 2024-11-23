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
  }
]

export default projectsData
