"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { SiteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons/icons"
import { NavItem } from "@/types"

interface NavigationMobileProps {
  siteConfig: SiteConfig
  navItems : NavItem[]
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string
  disabled?: boolean
  segment: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setIsOpen,
}: Readonly<MobileLinkProps>): JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        href.includes(segment) && "text-foreground",
        disabled && "pointer-events-none opacity-60"
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  )
}

export function NavigationMobile({
  siteConfig,
  navItems
}: Readonly<NavigationMobileProps>) {
  const segment = useSelectedLayoutSegment()
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="transition-all duration-300 ease-in-out">
        <Button variant="default" size="icon" className="md:hidden">
          <Icons.menuToggle className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col gap-10 transition-all duration-300 ease-in-out"
      >
        <div className="pl-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Image src="/images/logo.png" width={180} height={180} alt="logo" />
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 pl-16 text-xl font-medium leading-none tracking-wide">
          {navItems.map((item) => (
            <MobileLink
              key={item.title}
              href={item.href}
              segment={String(segment)}
              setIsOpen={setIsOpen}
            >
              {item.title}
            </MobileLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
