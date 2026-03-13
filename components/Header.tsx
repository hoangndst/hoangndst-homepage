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
    'mx-auto flex w-full items-center justify-between sm:max-w-[768px] py-3 sm:py-4 transition-colors duration-300'

  return (
    <header className={headerClass}>
      <div className={headerContainerClass}>
        <div className="flex items-center">
          <Link
            href="/"
            aria-label={siteMetadata.headerTitle}
            className="flex-shrink-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <div className="flex items-center">
              <div className="mr-2.5">
                <Logo />
              </div>
              {typeof siteMetadata.headerTitle === 'string' ? (
                <div className="hidden text-xl font-semibold tracking-tight sm:block">
                  {siteMetadata.headerTitle}
                </div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </Link>
          {siteMetadata.openToWork && <WorkBadge />}
        </div>
        <div className="flex items-center space-x-3 leading-5 sm:space-x-4">
          <div className="no-scrollbar hidden max-w-40 items-center space-x-3 overflow-x-auto sm:flex sm:space-x-4 md:max-w-72 lg:max-w-96">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="block text-sm font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
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
