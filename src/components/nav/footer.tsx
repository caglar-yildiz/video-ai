import Balancer from "react-wrap-balancer"

import { getSiteConfig } from "@/config/site"
import { NewsletterSignUpForm } from "@/components/forms/newsletter-signup-form"
import LinkWrapper from "@/components/common/link-wrapper"
import { ComponentWithLocaleType } from "@/types"

export const Footer : ComponentWithLocaleType = async ({locale}) =>  {
  const siteConfig = await getSiteConfig(locale)
  return (
    <footer
      id="footer"
      aria-label="footer"
      className="grid gap-8 bg-background pb-8 pt-16"
    >
      <div className="container flex flex-col gap-8 sm:flex-row">
        <div className="grid flex-1 grid-cols-3 gap-4 md:gap-8">
          {siteConfig.navItemsFooter.map((item) => (
            <div
              key={item.title}
              className="space-y-1 text-center sm:text-start md:space-y-2 md:text-start"
            >
              <h4 className="text-sm font-semibold md:text-base lg:text-lg">
                <Balancer>{item.title}</Balancer>
              </h4>
              <ul className="space-y-1 md:space-y-2">
                {item.items.map((link) => (
                  <li key={link.title}>
                    <LinkWrapper
                      locale={"en"}
                      href={link.href}
                      target={link?.external ? "_blank" : undefined}
                      rel={link?.external ? "noreferrer" : undefined}
                      className="text-xs text-muted-foreground underline-offset-8 transition-all hover:underline hover:opacity-70 md:text-sm lg:text-lg"
                    >
                      {link.title}
                      <span className="sr-only">{link.title}</span>
                    </LinkWrapper>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hidden flex-col gap-4 sm:flex sm:w-1/3 xl:pl-24">
          <p className="text-sm font-medium leading-5 tracking-wide lg:text-base 2xl:text-lg">
            <Balancer>Ready to stay informed? Subscribe now! 🚀</Balancer>
          </p>

          <NewsletterSignUpForm locale={locale} />
        </div>
      </div>
    </footer>
  )
}
