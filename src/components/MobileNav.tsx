'use client'

import { useState } from 'react'
import { ListIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <Sheet open={navOpen} onOpenChange={setNavOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          aria-label="Toggle menu"
        >
          <ListIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse all pages from the mobile menu.</SheetDescription>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-2 px-4 pb-6">
          {headerNavLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              className="h-auto justify-start px-2 py-2 text-sm"
              asChild
            >
              <Link href={link.href} onClick={() => setNavOpen(false)}>
                {link.title}
              </Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
