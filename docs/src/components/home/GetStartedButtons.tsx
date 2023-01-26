import * as React from 'react';
import copy from 'clipboard-copy';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import Link from 'docs/src/modules/components/Link';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

interface GetStartedButtonsProps extends BoxProps {
  installation?: string;
  to?: string;
}

export default function GetStartedButtons(props: GetStartedButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const {
    installation = 'hoangndst@gmail.com',
    to = 'mailto:hoangndst@gmail.com',
    ...other
  } = props;
  const handleCopy = () => {
    setCopied(true);
    copy(installation).then(() => {
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Box
      {...other}
      sx={{
        display: 'flex',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        '&& > *': {
          minWidth: { xs: '100%', md: '0%' },
        },
        ...other.sx,
      }}
    >
      <Button
        href={to}
        component={Link}
        noLinkStyle
        size="large"
        variant="contained"
        endIcon={<SendRoundedIcon />}
        sx={{
          flexShrink: 0,
          mr: { xs: 0, md: 2 },
          mb: { xs: 2, md: 0 },
        }}
      >
        Send mail
      </Button>
      <Button
        size="large"
        // @ts-expect-error
        variant="code"
        endIcon={copied ? <CheckRounded color="primary" /> : <ContentCopyRounded />}
        onClick={handleCopy}
        sx={{
          maxWidth: '324px',
          display: 'inline-block',
          justifyContent: 'start',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          position: 'relative',
          pr: 5,
        }}
      >
        {installation}
      </Button>
    </Box>
  );
}
