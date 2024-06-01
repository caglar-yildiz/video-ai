import { ComponentWithLocaleType } from "@/types"
import Balancer from "react-wrap-balancer"

import { NewsletterSignUpForm } from "@/components/forms/newsletter-signup-form"
import { getSiteConfig } from "@/config/site"

export const NewsletterSection: ComponentWithLocaleType = async ({ locale }) => {
  const siteConfig = await getSiteConfig(locale)

  return (
    <section
      id="newsletter-section"
      aria-label="newsletter section"
      className="w-full bg-background py-16"
    >
      <div className="container flex max-w-6xl flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {siteConfig.messages[10]}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {siteConfig.messages[11]}
            </Balancer>
          </h3>
        </div>

        <div className="w-full max-w-lg md:max-w-xl">
          <NewsletterSignUpForm messages={[siteConfig.messages[12],siteConfig.messages[13],siteConfig.messages[14],siteConfig.messages[15]]} />
        </div>
      </div>
    </section>
  )
}
