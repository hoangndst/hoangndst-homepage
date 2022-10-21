import { Badge, Box, Flex, chakra } from "@chakra-ui/react";
import EditPageButton from "./edit-page-button";
import * as React from 'react'

interface PageContainerProps {
  frontmatter: {
    slug?: string
    title: string
    description?: string
    editUrl?: string
    version?: string
  }
  children: React.ReactNode
  pagination?: React.ReactElement
}

const PageContainer = (props: PageContainerProps) => {
  const { frontmatter, pagination, children } = props
  return (
    <Box>
      <Box
        minW={0}
        flex='auto'
        px={{ base: '4', sm: '6', xl: '8' }}
        pt='10'
      >
        <Box>
          <chakra.h1 tabIndex={-1} outline={0} apply='mdx.h1'>
            {frontmatter.title}
          </chakra.h1>
          {frontmatter.version && (
            <Badge letterSpacing='wider'>
              v{frontmatter.version}
            </Badge>
          )}
          {children}
          <Box mt='40px'>
            <Box>
              <Box>{frontmatter.editUrl && <EditPageButton href={frontmatter.editUrl} />}</Box>
              {pagination || null}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default PageContainer