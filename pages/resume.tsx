import { Container } from "@chakra-ui/react";
import PdfComponent from "components/pdf-components"

const Resume = () => {
  return (
    <Container>
      <PdfComponent />
    </Container>
  )
}

export default Resume
export { getServerSideProps } from 'components/chakra'