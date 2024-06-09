import { prisma } from "@/db"
import * as React from "react"
import ProductUI from "@/components/common/product"
import { LangPageProps } from "@/types"
import { getSiteConfig } from "@/config/site"
import Balancer from "react-wrap-balancer"


const Credit = async ({ params: { lang } }: LangPageProps) => {
  const siteConfig = await getSiteConfig(lang)

  const productList = await prisma.product.findMany({
    where: {
      country: {
        code: lang === "tr" ? lang : "en",
      },
    },
    include: {
      descriptions: true,
    },
  })

  const bestValuedProduct = productList.reduce((max, product) =>
    (max?.price ?? 0) / (max?.credits_amount ?? 1) > product.price / product.credits_amount ? max : product, productList[0],
  )

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen py-2">
      <div className="flex flex-col space-y-8 items-center justify-center text-center">
        <h2 className="font-urbanist  text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <Balancer>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {siteConfig.pages.pricing.messages.ourPlans}
              </span>
          </Balancer>
        </h2>
        <h3 className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
          <Balancer>
            {siteConfig.pages.pricing.messages.experience}
          </Balancer>
        </h3>
        <div className="grid gap-4 md:grid-cols-3 md:max-w-4/5 lg:gap-6 lg:max-w-3xl sm:grid-cols-1">
          {productList && productList.map((product) => (
            <ProductUI product={product} lang={lang}
                       key={product.id}
                       className={bestValuedProduct?.id === product.id ?
                         "border-blue-600/60 bg-gradient-to-r from-blue-600/10 to-purple-600/10" : ""
                       }
                       message={bestValuedProduct?.id === product.id ? siteConfig.pages.pricing.messages.bestValue : undefined}
                       buttonContents={siteConfig.buttons}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Credit
