import { ArrowForwardIcon } from "@chakra-ui/icons";
import { 
  Box,
  Button,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react";

import MDXLayout from "components/layouts/mdx";
import NextLink from 'next/link'
 
const Blog = () => {
  return (
    <MDXLayout
      frontmatter={{
        title: 'Blog',
        description: '@hoangndst - homepage',
        slug: '/blog',
      }}
    >
      <Stack divider={<StackDivider />} my='12' spacing='20'>

      </Stack>
    </MDXLayout>
  )
}