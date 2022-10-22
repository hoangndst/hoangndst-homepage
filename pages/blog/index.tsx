import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text
} from "@chakra-ui/react";
import { allBlogs } from 'contentlayer/generated'
import MDXLayout from "components/layouts/mdx";
import NextLink from 'next/link'
import Layout from "components/layouts/page";

const Blog = () => {
  return (
    <Layout title="Blog">
      <Container
        minW={{ md: '50rem' }}
      >
        <MDXLayout
          frontmatter={{
            title: 'Blog',
            description: 'Blog - @hoangndst',
            slug: '/blog',
          }}
        >
          <Stack divider={<StackDivider />} my='12' spacing='10'>
            {allBlogs.map((item: any) => (
              <Box key={item._id}>
                <NextLink href={item.slug} passHref>
                  <Link _hover={{ textDecoration: 'none' }}>
                    <Heading fontWeight='md' size='lg' _hover={{ color: 'accent' }}>
                      {item.title}
                    </Heading>
                  </Link>
                </NextLink>

                <Text as='time' my='1' color='gray.500' fontSize='sm'>
                  {item.frontMatter.publishedDate.text}
                </Text>
                <Text mt='4'>{item.description}</Text>

                <NextLink href={item.slug} passHref>
                  <Button
                    size='sm'
                    as='a'
                    mt='8'
                    variant='outline'
                    rightIcon={<ArrowForwardIcon />}
                  >
                    Read more
                  </Button>
                </NextLink>
              </Box>
            ))}
          </Stack>
        </MDXLayout>
      </Container>
    </Layout>
  )
}
export default Blog