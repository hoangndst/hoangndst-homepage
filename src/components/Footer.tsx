import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import GitHubSponsor from './GitHubSponsor'
import BuyMeACoffee from './BuyMeACoffee'

export default function Footer() {
  return (
    <footer style={{ viewTransitionName: 'site-footer' }}>
      <div className="mt-12 flex flex-col items-center">
        {/* {siteMetadata.newsletter?.provider && (
          <div className="flex items-center justify-center pb-6 pt-6">
            <NewsletterForm />
          </div>
        )} */}
        <div className="flex items-center justify-center gap-2.5 pb-4">
          <GitHubSponsor />
          <BuyMeACoffee />
        </div>
        <div className="mb-2.5 flex items-center gap-3">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={5} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
          <SocialIcon kind="x" href={siteMetadata.x} size={5} />
        </div>
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
          <div>{siteMetadata.author}</div>
          <div aria-hidden="true">{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div aria-hidden="true">{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
