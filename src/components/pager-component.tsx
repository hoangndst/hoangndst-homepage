import * as React from 'react'
import { 
  useColorModeValue, 
  useColorMode, 
  Box,
  Tag 
} from "@chakra-ui/react"
import { mdProps } from 'src/type/frontmatter'

export const PagerComponent = ( children: React.ReactNode ) => {
  const { colorMode } = useColorMode()
  return (
    <Box
      p={2}
      backgroundColor={useColorModeValue('white', '#132f4c')}
      borderRadius='5px'
      border={colorMode === 'dark' ? '1px solid rgb(30, 73, 118)' : '1px solid #E7EBF0'}
      display='flex'
      flexDirection='column'
      position='relative'
      transition='all ease 120ms'
      _hover={{
        borderColor: colorMode === 'dark' ? '#0072e5' : '#CDD2D7',
        boxShadow: `0px 4px 20px ${colorMode === 'dark'
          ? 'rgba(0, 0, 0, 0.5)'
          : 'rgba(170, 180, 190, 0.3)'
          }`,
      }}
      _focusWithin={{ '& a': { outline: 'none' } }}
      height='400px'
    >
      {children}     
    </Box>
  )
}

const PreviewBlog = ( blog: mdProps, hasImage: boolean ) => {
  return (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '15px'
        }}
      >
        <Tag variant='solid' size='sm'
          style={{
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {blog.frontmatter.tags[0]}
        </Tag>
        <Tag variant='solid' size='sm'
          style={{
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          {blog.frontmatter.tags[0]}
        </Tag>
      </Box>
    </>
  )
}

export default PreviewBlog