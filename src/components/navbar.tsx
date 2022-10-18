import { 
  useColorModeValue,
  Box,
  Container,
  Flex,
  Heading,
  HTMLChakraProps,
  Link,
  Stack
} from "@chakra-ui/react";
import Logo from "./logo";
import NextLink from "next/link"
import styled from "@emotion/styled";

type ListItemType = {
  href: string,
  path: string,
  target?: string,
  children: React.ReactNode,
  props?: HTMLChakraProps<'link'>
}

const LinkItem = ({ href, path, target, children, ...props }: ListItemType) => {

  const active = path === href;
  const inActiveColor = useColorModeValue('#F3F6F9', '#001E3C');
  const activeColor = useColorModeValue('#2D3843', '#173A5E');
  return (
    <NextLink href={href} passHref scroll={false}
    >
      <Link
        p={2}
        bg={active? activeColor : inActiveColor}
        target={target}
        borderRadius="5px"
        style={{
          textDecoration: 'none'
        }}
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  )
}



const NavBar = ({ path }: { path: string}) => {
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#F3F6F9', '#001E3C')}
      css={{ 
        backdropFilter: 'blur(20px)' 
      }}
      boxShadow={useColorModeValue('inset 0px -1px 1px #e7ebf0', 'rgb(19 47 76) 0px -1px 1px inset')}
      zIndex={2}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        alignItems="center"
        justifyItems="space-between"
      >
        <Flex align="center" mr={5}> 
          <Heading as="h1" size="lg">
            <Logo />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem
            href="/resume" path={path}
          >
            Resume
          </LinkItem>
          <LinkItem
            href="/blog" path={path}
          >
            Blog
          </LinkItem>
        </Stack>
      </Container>
    </Box>
  )
}

export default NavBar