import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import GitHubSponsor from './GitHubSponsor'
import BuyMeACoffee from './BuyMeACoffee'

export default function Footer() {
  return (
    <footer>
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
        <div className="mb-2.5 flex items-center space-x-3">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={5} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
          <SocialIcon kind="x" href={siteMetadata.x} size={5} />
        </div>
        <div className="mb-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
