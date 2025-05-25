import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import WorkBadge from './WorkBadge'

const Header = () => {
  let headerClass = 'bg-white dark:bg-gray-950 px-4'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-10 backdrop-blur bg-opacity-80 dark:bg-opacity-80'
  }
  const headerContainerClass =
    'mx-auto w-full flex items-center justify-between max-w-3xl xl:max-w-5xl py-7 transition-colors duration-300'

  return (
    <header className={headerClass}>
      <div className={headerContainerClass}>
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="flex-shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
        {siteMetadata.openToWork && <WorkBadge />}
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                >
                  {link.title}
                </Link>
              ))}
          </div>
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
