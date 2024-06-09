import { ComponentWithLocaleType } from "@/types"
import Balancer from "react-wrap-balancer"

import { ContactForm } from "@/components/forms/contact-form"
import { getSiteConfig } from "@/config/site"

export const ContactSection: ComponentWithLocaleType =  async ({ locale }) => {
  const siteConfig = await getSiteConfig(locale)
  return (
    <section
      id="contact-section"
      aria-label="contact section"
      className="w-full pb-8 sm:pb-16 md:pb-32"
    >
      <div className="container grid max-w-4xl grid-cols-1 justify-center gap-8 md:gap-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               {siteConfig.pages.landingPage.messages.letUsGetInTouch}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-[84rem] text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {siteConfig.pages.landingPage.messages.feelFreeToEmailUs}
            </Balancer>
          </h3>
        </div>

        <ContactForm formMessages={siteConfig.formMessages}/>
      </div>
    </section>
  )
}
