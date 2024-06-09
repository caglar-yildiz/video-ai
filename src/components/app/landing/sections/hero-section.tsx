import Link from "next/link"
import { ComponentWithLocaleType } from "@/types"
import Balancer from "react-wrap-balancer"

import { getSiteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/auth"

export const HeroSection: ComponentWithLocaleType = async ({ locale }) => {
  const siteConfig = await getSiteConfig(locale)

  const session = await auth()

  return (
    <section
      id="hero-section"
      aria-label="hero section"
      className="mt-16 w-full md:mt-48"
    >
      <div className="container flex flex-col items-center gap-6 text-center">
        <h1 className="animate-fade-up font-urbanist text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <Balancer>
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-extrabold text-transparent">
              {siteConfig.name}: {" "}
            </span>
            {siteConfig.pages.landingPage.messages.bridgingLanguageBarriers}
          </Balancer>
        </h1>

        <h3 className="max-w-[42rem] animate-fade-up text-muted-foreground sm:text-xl sm:leading-8">
          <Balancer>
            {siteConfig.pages.landingPage.messages.connectWithGlobalAudience}
          </Balancer>
        </h3>
        {!session && (
          <div className="z-10 flex animate-fade-up flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "transition-all duration-1000 ease-out md:hover:-translate-y-2"
              )}
            >
              {siteConfig.buttons.getStarted}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
