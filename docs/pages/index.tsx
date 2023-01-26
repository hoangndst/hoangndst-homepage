import * as React from 'react';
import Head from 'docs/src/modules/components/Head';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Paper, { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from 'docs/src/modules/components/Link';
import AppHeader from 'docs/src/layouts/AppHeader';
import HeroEnd from 'docs/src/components/home/HeroEnd';
import AppFooter from 'docs/src/layouts/AppFooter';
import GradientText from 'docs/src/components/typography/GradientText';
import ROUTES from 'docs/src/route';
import BrandingCssVarsProvider from 'docs/src/BrandingCssVarsProvider';
import AppHeaderBanner from 'docs/src/components/banner/AppHeaderBanner';
import SponsorCard from 'docs/src/components/home/SponsorCard';
import { useInView } from 'react-intersection-observer';

interface Profile {
  name: string;
  /**
   * Role, what are you working on?
   */
  title: string;
  /**
   * Country where you live in, ISO 3166-1.
   */
  locationCountry: string; // https://flagpedia.net/download/api
  /**
   * Image URL.
   */
  src?: string;
  /**
   * Lives in.
   */
  location?: string;
  /**
   * Short summary about you.
   */
  about?: string;
  github?: string;
  twitter?: string;
}

function Person(props: Profile & { sx?: PaperProps['sx'] }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%', ...props.sx }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          '& > div': { minWidth: 'clamp(0px, (150px - 100%) * 999 ,100%)' },
        }}
      >
        <Tooltip
          title={props.location || false}
          placement="right-end"
          PopperProps={{
            popperOptions: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [3, 2],
                  },
                },
              ],
            },
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              variant="rounded"
              imgProps={{
                width: '100',
                height: '100',
                loading: 'lazy',
              }}
              src={props.src}
              alt={props.name}
              {...(props.src?.startsWith('https://avatars.githubusercontent.com') && {
                src: `${props.src}?s=70`,
                srcSet: `${props.src}?s=140 2x`,
              })}
              sx={(theme) => ({
                width: 100,
                height: 100,
                borderRadius: 1,
                backgroundColor: 'primary.100',
                ...theme.applyDarkStyles({
                  backgroundColor: 'primary.700',
                }),
              })}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                transform: 'translateX(50%)',
                boxShadow: '0px 4px 20px rgba(61, 71, 82, 0.25)',
                width: 24,
                height: 24,
                border: '2px solid #fff',
                backgroundColor: '#fff',
                borderRadius: 40,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                loading="lazy"
                height="20"
                src={`https://flagcdn.com/${props.locationCountry}.svg`}
                alt=""
              />
            </Box>
          </Box>
        </Tooltip>
        <Box mx="auto" height={15} />
        <Box sx={{ mt: -0.5, mr: -0.5 }}>
          {props.github && (
            <IconButton
              aria-label={`${props.name} github`}
              component="a"
              href={`https://github.com/${props.github}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <GitHubIcon fontSize="small" sx={{ color: 'grey.500' }} />
            </IconButton>
          )}
          {props.twitter && (
            <IconButton
              aria-label={`${props.name} twitter`}
              component="a"
              href={`https://twitter.com/${props.twitter}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <TwitterIcon fontSize="small" sx={{ color: 'grey.500' }} />
            </IconButton>
          )}
        </Box>
      </Box>
      <Typography variant="body2" fontWeight="bold" sx={{ mt: 2, mb: 0.5 }}>
        {props.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.title}
      </Typography>
      {props.about && (
        <Divider
          sx={(theme) => ({
            my: 1,
            borderColor: 'grey.100',
            ...theme.applyDarkStyles({
              borderColor: 'primaryDark.400',
            }),
          })}
        />
      )}
      {props.about && (
        <Typography variant="body2" color="text.secondary">
          {props.about}
        </Typography>
      )}
    </Paper>
  );
}

const SOCIALs = [
  {
    src: '/static/branding/companies/facebook.svg',
    srcSet: '/static/branding/companies/facebook.svg',
    name: 'Facebook',
    description: 'Nguyen Dinh Hoang (hoangndst)',
    href: 'https://www.facebook.com/hoangndst.25',
  },
  {
    src: '/static/branding/companies/instagram.svg',
    srcSet: '/static/branding/companies/instagram.svg',
    name: 'Instagram',
    description: '@hoangndst',
    href: 'https://www.instagram.com/hoangndst/',
  },
  {
    src: '/static/branding/companies/youtube.svg',
    srcSet: '/static/branding/companies/youtube.svg',
    name: 'Youtube',
    description: '@hoangndst',
    href: 'https://www.youtube.com/@hoangndst',
  },
  {
    src: '/static/branding/companies/twitter-light.svg',
    srcSet: '/static/branding/companies/twitter-light.svg',
    name: 'Twitter',
    description: '@hoangndst',
    href: 'https://twitter.com/hoangndst',
  },
];

export function AboutContent() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '500px',
  });
  return (
    <React.Fragment>
      <Container>
        <Box
          sx={{
            height: '90vh',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 600,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="primary.600" fontWeight="bold">
            About me
          </Typography>
          <Box sx={{ pt: 2 }}>
            <Person
              name="Nguyen Dinh Hoang"
              github="hoangndst"
              twitter="hoangndst"
              title="Student at UET-VNU"
              about="if you know you don't know."
              location="Hanoi, Vietnam"
              locationCountry="vn"
              src="/static/branding/about/hoangndst.jpg"
            />
          </Box>
          <Typography component="h1" variant="h2" sx={{ my: 1 }}>
            An IT student with competent background and growth mindset
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{
              maxWidth: { md: 500 },
              minHeight: 48, // a hack to reduce CLS (layout shift)
            }}
          >
            motivated by his interest in <GradientText>Information Technology</GradientText> and science. Realizing the academic research track may not be for him, he is taking steps into the industry with a
            strong will to learn, develop and be useful.
          </Typography>
        </Box>
      </Container>
      <Box
        sx={(theme) => ({
          bgcolor: 'grey.50',
          ...theme.applyDarkStyles({
            bgcolor: 'primaryDark.900',
          }),
        })}
      >
        <Container sx={{ py: { xs: 4, md: 8 } }}>
          <Typography variant="h5" sx={{ my: 1 }}>
            Bio
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
            <Grid container>
              <Grid item xs={2} sm={2} md={2}>
                <Typography fontWeight='bold' variant='h6'>
                  2002
                </Typography>
              </Grid>
              <Grid item xs={10} sm={10} md={10}>
                <Typography variant='h6'>
                  Born in <Link href={'https://goo.gl/maps/Y5Ck9nHup9E6kkQ86'} target={'_blank'}>Son Tay, Vietnam.</Link>
                </Typography>
              </Grid>

              <Grid item xs={2} sm={2} md={2}>
                <Typography fontWeight='bold' variant='h6'>
                  2020
                </Typography>
              </Grid>
              <Grid item xs={10} sm={10} md={10}>
                <Typography variant='h6'>
                  Start IT Engineering Program at <Link href='https://uet.vnu.edu.vn/' target={'_blank'}>VNU University of Engineering and Technology</Link>
                </Typography>
              </Grid>

              <Grid item xs={2} sm={2} md={2}>
                <Typography fontWeight='bold' variant='h6'>
                  2022
                </Typography>
              </Grid>
              <Grid item xs={10} sm={10} md={10}>
                <Typography variant='h6'>
                  Software Engineer Intern at <Link href='https://viettelhightech.vn/' target={'_blank'}>Viettel High Tech</Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Typography variant="h5" sx={{ my: 1 }}>
            Hobbies
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
            <Typography>
              Football, Electric Guitar and <Link href='https://www.instagram.com/hoangndst/'>Photography</Link>.
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ my: 1 }}>
            Social
          </Typography>
          <Box ref={ref} sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {SOCIALs.map((item) => (
                <Grid item key={item.name} xs={12} sm={6} md={4} lg={3}>
                  <SponsorCard logoSize={64} inView={inView} item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h2" sx={{ my: 1 }}>
              Resumes
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 450 }}>
              I&apos;m available for a job. Here&apos;s my resume. Feel free to contact me.
            </Typography>
            <Button
              component={Link}
              noLinkStyle
              href={ROUTES.home}
              endIcon={<KeyboardArrowRightRounded fontSize="small" />}
              variant="contained"
              size="large"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              View Resumes
            </Button>
          </div>
        </Box>
      </Container>
      <HeroEnd />
      <Divider />
    </React.Fragment>
  );
}

export default function Home() {
  return (
    <BrandingCssVarsProvider>
      <Head
        title="About me - @hoangndst" description={''}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MUI',
            url: 'https://hoangndst.freeddns.org/',
            logo: 'https://hoangndst.freeddns.org/static/logo.png',
            sameAs: [
              'https://twitter.com/hoangndst',
              'https://github.com/hoangndst/'
            ],
          }),
        }}
      />
      <AppHeaderBanner />
      <AppHeader />
      <main id="main-content">
        <AboutContent />
      </main>
      <AppFooter />
    </BrandingCssVarsProvider>
  );
}
