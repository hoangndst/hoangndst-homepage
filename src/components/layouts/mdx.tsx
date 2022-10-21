import PageContainer from "components/page-container";
import React from "react";
import { Frontmatter } from "types/frontmatter";
import { getRouteContex, RouteItem } from "utils/get-route-contex";


interface MDXLayoutProps {
  frontmatter: Frontmatter
  children: React.ReactNode
}

const MDXLayout = (props: MDXLayoutProps) => {
  const { frontmatter, children } = props
  return (
    <PageContainer
      frontmatter={frontmatter}
    >
      {children}
    </PageContainer>
  )
}
export default MDXLayout