import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ComponentWithLocaleType } from "@/types"
import { getSiteConfig } from "@/config/site"
import LinkWrapper from "@/components/common/link-wrapper"

export const HeroSection : ComponentWithLocaleType  = async ({ locale }) =>  {
   const siteConfig = await getSiteConfig(locale)

  return (
    <section
      id="hero-section"
      aria-label="hero section"
      className="mt-16 w-full md:mt-48"
    >
      <div className="container flex flex-col items-center gap-6 text-center">
        <h1 className="animate-fade-up font-urbanist text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <Balancer>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-extrabold text-transparent">
              ITRANSL8:
            </span>
            Bridging Language Barriers in Videos Globally

          </Balancer>
        </h1>

        <h3 className="max-w-[42rem] animate-fade-up text-muted-foreground sm:text-xl sm:leading-8">
          <Balancer>
            Connect with a Global Audience: Translate Video to another language Instantly at Unbeatable Prices
          </Balancer>
        </h3>

        <div className="z-10 flex animate-fade-up flex-col justify-center gap-4 sm:flex-row">
          <Link
            locale={locale}
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "transition-all duration-1000 ease-out md:hover:-translate-y-2"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  )
}
