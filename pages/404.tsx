import NextLink from 'next/link'
import {
  Container,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Box,
  Button
} from '@chakra-ui/react'
const NotFound = () => {
  return (
    <Container mt={10} h='100%'>
      <Alert status='error' borderRadius={5}>
        <AlertIcon />
        <AlertTitle>It&apos;s beta don&apos;t expect too much!</AlertTitle>
      </Alert>
      <Heading as='h2' mt={10}>
        Not Found
      </Heading>
      <Text>The page you&apos;re looking for was not found.</Text>
      <Divider my={6} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '6'
        }}
      >
        <NextLink href='/' passHref>
          <Button>Return to home</Button>
        </NextLink>
      </Box>
    </Container>
  )
}
export default NotFound