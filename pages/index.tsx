import Layout from 'components/layouts/page'
import {
  useColorModeValue,
  useColorMode, 
  Container,
  Link,
  Box ,
  Alert,
  AlertIcon,
  Heading,
  Highlight,
  chakra
} from '@chakra-ui/react'
import Image from 'next/image'
import Section from 'components/section'
import Paragraph from 'components/paragraph'
import { BioSection, BioYear } from 'components/bio'

const ProfileImage = chakra(Image, {
  shouldForwardProp: prop => ['width', 'height', 'src', 'alt'].includes(prop)
})


const Page = () => {

  const { colorMode } = useColorMode()

  return (
    <Layout title='Home'>
      <Container>
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
            <Highlight
              query={['developer', 'gamer', 'photographer', 'designer']}
              styles={{ px: '2', py: '1', rounded: 'full', bg: 'teal.100' }}
            >
            Developer / Designer / Photographer
            </Highlight>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0}}
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
              _focusWithin={{
                borderColor: colorMode === 'dark' ? '#0072e5' : '#CDD2D7',
                boxShadow: `0px 4px 20px ${colorMode === 'dark'
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(170, 180, 190, 0.3)'
                  }`,
              }}
              borderRadius='full'
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
          <Heading as='h4' variant='section-title'>
            About
          </Heading>
          <Paragraph>
          An IT student with competent background and growth mindset, motivated by his interest in Information Technology
          and science. Realizing the academic research track may not be for him, he is taking steps into the industry with a
          strong will to learn, develop and be useful.
          </Paragraph>
        </Section>
        <Section delay={0.2}>
          <Heading as='h4' variant='section-title'>
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
          <Heading as='h4' variant='section-title'>
            Hobbies
          </Heading>
          <Paragraph>
            
          </Paragraph>
        </Section>
      </Container>
    </Layout>
  )
}

export default Page