import Link from "next/link";
import styled from "@emotion/styled";
import RaspberryIcon from "icons/raspberry"
import { Text, useColorModeValue } from "@chakra-ui/react";

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 15px;
  display: inline-flex;
  alight-item: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;

  > svg {
    transition: 200ms ease;
  }
  &:hover > svg {
    transform: rotate(20deg);
  }
`

const Logo = () => {
  return (
    <Link href="/" scroll={false}>
      <a>
        <LogoBox>
          <RaspberryIcon />
          <Text
            color={useColorModeValue('gray.800', 'whiteAlpha.900')}
            fontWeight='bold'
            ml={3}
          >
            @hoangndst
          </Text>
        </LogoBox>
      </a>
    </Link>
  )
}

export default Logo