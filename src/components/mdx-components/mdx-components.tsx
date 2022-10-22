import * as Chakra from '@chakra-ui/react'
import * as React from 'react'
import PropsTable from '../props-table'
import CarbonAd from './carbon-ad'
import CodeBlock from './codeblock/codeblock'
import ComponentLinks from './component-links'
import { FeaturesCourses } from './course-banner'
import IconsList from './icons-list'
import {
  ColorPalette,
  ColorPalettes,
  ColorWrapper,
} from 'components/color-palette'
import { FeaturesOverview } from 'components/features-overview'
import { FrameworkLinks } from 'components/framework-link'
import { Anchor } from 'components/mdx-components/anchor'
import { InlineCode } from 'components/mdx-components/inline-code'
import { LinkedHeading } from 'components/mdx-components/linked-heading'
import { Pre } from 'components/mdx-components/pre'
import { TData, THead, Table } from 'components/mdx-components/table'
import { VideoPlayer } from 'components/mdx-components/video-player'
import SandpackEmbed from 'components/sandpack-embed'
import { TutorialCodeBlock } from 'components/tutorial/tutorial-code-block'
import { TutorialFileAction } from 'components/tutorial/tutorial-file-action'
import { JoinCommunityCards } from 'components/community-card'
import NextImage from 'next/image'

const { Alert, AspectRatio, Box, chakra, Kbd, Link } = Chakra

export const MDXComponents = {
  ...Chakra,
  Image: (props: any) => (
    <Box my='5'>
      <NextImage
        layout='responsive'
        width={700}
        height={400}
        objectFit='contain'
        {...props}
      />
    </Box>
  ),
  LinkedImage: ({ href, ...props }) => (
    <Link display='block' my='10' href={href} isExternal>
      <MDXComponents.Image {...props} />
    </Link>
  ),
  h1: (props: any) => <chakra.h1 apply='mdx.h1' {...props} />,
  h2: (props: any) => <LinkedHeading apply='mdx.h2' {...props} />,
  h3: (props: any) => <LinkedHeading as='h3' apply='mdx.h3' {...props} />,
  h4: (props: any) => <LinkedHeading as='h4' apply='mdx.h4' {...props} />,
  hr: (props: any) => <chakra.hr apply='mdx.hr' {...props} />,
  strong: (props: any) => <Box as='strong' fontWeight='semibold' {...props} />,
  code: InlineCode,
  pre: (props: any) => {
    if (typeof props.children === 'string') return <Pre {...props} />
    if (props.children.props.type === 'tutorial') {
      const className = props.children.props.className || ''
      const code = props.children.props.children.trim() || ''
      const language = className.replace(/language-/, '')
      return (
        <TutorialCodeBlock
          language={language}
          code={code}
          path={props.children.props.path}
          showLineNumbers={props.showLineNumbers}
        />
      )
    }
    return <CodeBlock {...props} />
  },
  kbd: Kbd,
  br: ({ reset, ...props }) => (
    <Box
      as={reset ? 'br' : undefined}
      height={reset ? undefined : '24px'}
      {...props}
    />
  ),
  table: Table,
  th: THead,
  td: TData,
  a: Anchor,
  p: (props: any) => <chakra.p apply='mdx.p' {...props} />,
  ul: (props: any) => <chakra.ul apply='mdx.ul' {...props} />,
  ol: (props: any) => <chakra.ol apply='mdx.ul' {...props} />,
  li: (props: any) => <chakra.li pb='4px' {...props} />,
  blockquote: (props: any) => (
    <Alert
      mt='4'
      role='none'
      status='warning'
      variant='left-accent'
      as='blockquote'
      rounded='4px'
      my='1.5rem'
      {...props}
    />
  ),
  'carbon-ad': CarbonAd,
  ComponentLinks,
  IconsList,
  PropsTable,
  FrameworkLinks,
  VideoPlayer,
  AspectRatio,
  ColorPalette,
  ColorPalettes,
  ColorWrapper,
  FeaturesCourses,
  JoinCommunityCards,
  SandpackEmbed: (props: any) => (
    <Box my={6}>
      <SandpackEmbed {...props} />
    </Box>
  ),
  FeaturesOverview,
  TutorialFileAction,
}
