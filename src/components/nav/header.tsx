import Image from "next/image"
import { auth } from "@/auth"

import { getSiteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LanguageSelector } from "@/components/common/language-selector"
import { Navigation } from "@/components/nav/navigation"
import { NavigationMobile } from "@/components/nav/navigation-mobile"
import { ComponentWithLocaleType } from "@/types"
import LinkWrapper from "@/components/common/link-wrapper"


export const Header : ComponentWithLocaleType = async ({locale})  => {
  const session = await auth()
  console.log("Header",locale)
  const siteConfig = await getSiteConfig(locale)
  return (
    <header className="fixed top-0 z-[50] w-full border-b border-neutral-200 bg-white/[0.8] backdrop-blur-sm dark:border-white/[0.1] dark:bg-black/[0.6]">
      <div className="container flex items-center justify-between p-4">
        <LinkWrapper
          locale={locale}
          href={"/" }
          className="flex items-center justify-center gap-2 text-lg font-bold tracking-wide transition-all duration-300 ease-in-out"
        >
          <Image src="/images/logo.png" width={200} height={24.22} alt="logo" />
        </LinkWrapper>
        <Navigation locale={locale} navItems={siteConfig.navItems} />
        <div className="flex items-center justify-center">
          {/* <ThemeToggle /> */}
          <NavigationMobile siteConfig={siteConfig} />
          <nav className="space-x-1">
           {/* <LinkWrapper
              locale={locale}
              aria-label="Get started"
              href="/getstarted"
              className={cn(buttonVariants({ size: "sm" }), "ml-3")}
            >
              Contact Us
              <span className="sr-only">Go to Dashboard</span>
            </LinkWrapper>*/}
            {session && session?.user ? (
              <LinkWrapper
                locale={locale}
                aria-label="Get started"
                href="/dashboard"
                className={cn(buttonVariants({ size: "sm" }), "ml-3")}
              >
                Go to Dashboard
                <span className="sr-only">Go to Dashboard</span>
              </LinkWrapper>
            ) : (
              <div className="flex">
                <LinkWrapper
                  locale={locale}
                  aria-label="Get started"
                  href="/signup"
                  className={cn(buttonVariants({ size: "sm" }), "ml-2")}
                >
                  Sign Up
                  <span className="sr-only">Sign Up</span>
                </LinkWrapper>
                <LinkWrapper
                  locale={locale}
                  aria-label="Sign In"
                  href="/signin"
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" }),
                    "ml-2"
                  )}
                >
                  Sign In
                  <span className="sr-only">Sign In</span>
                </LinkWrapper>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}