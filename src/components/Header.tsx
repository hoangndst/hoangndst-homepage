'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from '@/components/Image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import NextLink from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const Header = () => {
  const primaryLinkSet = new Set(['/blog', '/talks', '/projects', '/about'])
  const primaryLinks = headerNavLinks.filter(
    (link) => link.href !== '/' && primaryLinkSet.has(link.href)
  )
  const overflowLinks = headerNavLinks.filter(
    (link) => link.href !== '/' && !primaryLinkSet.has(link.href)
  )
  let headerClass = 'bg-background px-4'
  if (siteMetadata.stickyNav) {
    headerClass +=
      ' sticky top-0 z-40 border-b border-border/60 supports-backdrop-filter:bg-background/80 supports-backdrop-filter:backdrop-blur'
  }
  const headerContainerClass =
    'mx-auto flex w-full items-center justify-between sm:max-w-[768px] py-3 sm:py-4 transition-colors duration-300'

  return (
    <header className={headerClass} style={{ viewTransitionName: 'site-header' }}>
      <div className={headerContainerClass}>
        <div className="flex items-center">
          <Link
            href="/"
            aria-label={siteMetadata.headerTitle}
            className="focus-visible:ring-ring flex-shrink-0 focus:outline-none focus-visible:ring-2"
          >
            <div className="flex items-center">
              <div className="mr-2.5">
                <Image src="/static/images/logo.png" alt="Logo" width={24} height={24} className="size-6" />
              </div>
              {typeof siteMetadata.headerTitle === 'string' ? (
                <div className="font-heading hidden text-xl font-semibold tracking-tight sm:block">
                  {siteMetadata.headerTitle}
                </div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3 leading-5 sm:gap-4">
          <div className="hidden items-center gap-1 sm:flex">
            {primaryLinks.map((link) => (
              <NextLink
                key={link.title}
                href={link.href}
                className={cn(navigationMenuTriggerStyle(), 'h-8')}
              >
                {link.title}
              </NextLink>
            ))}
            {overflowLinks.length > 0 ? (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-8">More</NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-44">
                      <div className="flex flex-col gap-1">
                        {overflowLinks.map((link) => (
                          <NavigationMenuLink key={link.title} asChild>
                            <NextLink href={link.href}>{link.title}</NextLink>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : null}
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
