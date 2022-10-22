import Layout from 'components/layouts/page'
import {
  useColorModeValue,
  useColorMode,
  Container,
  Link,
  Box,
  Heading,
  chakra,
  List,
  ListItem,
  Button
} from '@chakra-ui/react'
import Image from 'next/image'
import Section from 'components/section'
import Paragraph from 'components/paragraph'
import { BioSection, BioYear } from 'components/bio'
import { IoLogoGithub, IoLogoFacebook, IoLogoTwitter, IoLogoInstagram } from 'react-icons/io5'
import { ChevronRightIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})


const Page = () => {

  const { colorMode } = useColorMode()

  return (
    <Layout title='Home'>
      <Container
        minW={{ md: '40rem' }}
      >
        <Box
          borderRadius='lg'
          mb={6}
          p={3}
          mt={10}
          textAlign='center'
          bg={useColorModeValue('#F3F6F9', '#132f4c')}
          css={{ backdropFilter: 'blur(10px)' }}
        >
          Hello, I&apos;m a software developer based in Vietnam!
        </Box>
        <Box display={{ md: 'flex' }}>
          <Box flexGrow={1}>
            <Heading as='h3' variant='page-title' mb={2}>
              Nguyen Dinh Hoang
            </Heading>
            Developer / Designer / Photographer
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign='center'
          >
            <Box
              _hover={{
                borderColor: colorMode === 'dark' ? '#0072e5' : '#CDD2D7',
                boxShadow: `0px 4px 20px ${colorMode === 'dark'
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(170, 180, 190, 0.3)'
                  }`,
              }}
              borderRadius='full'
              borderWidth={2}
              borderStyle="solid"
              w="100px"
              h="100px"
              display="inline-block"
              overflow="hidden"
            >
              <ProfileImage
                src="/images/hoangndst.jpg"
                alt="Profile Image"
                borderRadius="full"
                width="100%"
                height="100%"
              />
            </Box>
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as='h4' variant='section-title' mb={2}>
            About
          </Heading>
          <Paragraph>
            An IT student with competent background and growth mindset, motivated by his interest in Information Technology
            and science. Realizing the academic research track may not be for him, he is taking steps into the industry with a
            strong will to learn, develop and be useful.
          </Paragraph>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            mt={10}
          >
            <NextLink href='/resume' passHref scroll={false}>
              <Button
                rightIcon={<ChevronRightIcon />}
              >
                My Resume
              </Button>
            </NextLink>
          </Box>
        </Section>

        <Section delay={0.2}>
          <Heading as='h4' variant='section-title' mb={2}>
            Bio
          </Heading>
          <BioSection>
            <BioYear>2002</BioYear>
            Born in Son Tay, Hanoi.
          </BioSection>
          <BioSection>
            <BioYear>2020</BioYear>
            Start IT Engineering Program at {' '}
            <Link href='https://uet.vnu.edu.vn/' isExternal color='teal.500'>
              VNU University of Engineering and Technology
            </Link>.
          </BioSection>
          <BioSection>
            <BioYear>2022</BioYear>
            Software Engineer Intern at <Link href='https://viettelhightech.vn/' isExternal color='teal.500'>Viettel High Tech</Link>.
          </BioSection>
        </Section>

        <Section delay={0.3}>
          <Heading as='h4' variant='section-title' mb={2}>
            Hobbies
          </Heading>
          <Paragraph>
            Football, Electric Guitar,{' '}
            <Link href='https://www.instagram.com/hoangndst/' isExternal color='teal.500'>Photography</Link>.
          </Paragraph>
        </Section>

        <Section delay={0.4}>
          <Heading as='h4' variant='section-title' mb={2}>
            Social
          </Heading>
          <List>
            <ListItem>
              <Link href='https://github.com/hoangndst' isExternal color='teal.500'>
                <Button
                  variant='ghost'
                  colorScheme='teal'
                  leftIcon={<IoLogoGithub />}
                >
                  @hoangndst
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href='https://www.instagram.com/hoangndst/' isExternal color='teal.500'>
                <Button
                  variant='ghost'
                  colorScheme='teal'
                  leftIcon={<IoLogoInstagram />}
                >
                  @hoangndst
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href='https://www.facebook.com/hoangndst.25/' isExternal color='teal.500'>
                <Button
                  variant='ghost'
                  colorScheme='teal'
                  leftIcon={<IoLogoFacebook />}
                >
                  Nguyen Dinh Hoang
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href='https://twitter.com/hoangndst' isExternal color='teal.500'>
                <Button
                  variant='ghost'
                  colorScheme='teal'
                  leftIcon={<IoLogoTwitter />}
                >
                  @hoangndst
                </Button>
              </Link>
            </ListItem>
          </List>
        </Section>
      </Container>
    </Layout>
  )
}

export default Page