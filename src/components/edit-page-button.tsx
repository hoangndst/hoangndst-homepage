import { chakra, Icon, Link, Stack } from "@chakra-ui/react"
import { MdEdit } from 'react-icons/md'

const EditPageButton = ({ href }: { href?: string }) => {
  return (
    <Link href={href} isExternal>
      <Stack
        fontSize='sm'
        textAlign='right'
        display='inline-flex'
        direction='row'
        spacing={1}
        align='center'
        opacity={0.7}
      > 
        <Icon as={MdEdit} mr='1' />
      </Stack>
    </Link>
  )
}
export default EditPageButton