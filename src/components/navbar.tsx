import { 
  useColorModeValue,
  Box,
  Container,
  Flex,
  Heading,
  HTMLChakraProps,
  Link,
  Stack,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import Logo from "components/logo";
import NextLink from "next/link"
import { GithubIcon } from "icons/github";
import ThemeChangeButton from "components/theme-change-button";
import { HamburgerIcon } from "@chakra-ui/icons";

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
      <Button
        as={Link}
        // bg={active? activeColor : inActiveColor}
        variant={active? 'solid' : 'ghost'}
        p={2}
        target={target}
        style={{
          textDecoration: 'none'
        }}
        {...props}
      >
        {children}
      </Button>
    </NextLink>
  )
}



const NavBar = ({ path }: { path: string}) => {
  return (
    <Box
      bg={useColorModeValue('#F3F6F940', '#001E3C80')}
      boxShadow={useColorModeValue('inset 0px -1px 1px #e7ebf0', 'rgb(19 47 76) 0px -1px 1px inset')}
      position="fixed"
      as="nav"
      w="100%"
      css={{ backdropFilter: 'blur(50px)' }}
      zIndex={2}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        minH="56px"
        alignItems="center"
        ml="auto"
        mr="auto"
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
            href="/" path={path}
          >
            Home
          </LinkItem>
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
        <Box ml="auto"></Box>
        <Box display="flex" flexGrow={0} ml="auto">
          <Tooltip label='Github' aria-label='Github' openDelay={800}>
            <IconButton 
              style={{
                marginRight: '10px'
              }}
              aria-label="github-icon"
              icon={<GithubIcon width={20} />}
              variant="outline"
              size="sm"
              onClick={() => {
                window.open('https://github.com/hoangndst');
              }}
            />
          </Tooltip>
          <ThemeChangeButton />
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id='nav-menu'>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
                size="sm"
              />
              <MenuList>
                <NextLink href="/" passHref>
                  <MenuItem as={Link}>Home</MenuItem>
                </NextLink>
                <NextLink href="/resume" passHref>
                  <MenuItem as={Link}>Resume</MenuItem>
                </NextLink>
                <NextLink href="/blog" passHref>
                  <MenuItem as={Link}>Blog</MenuItem>
                </NextLink>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default NavBar