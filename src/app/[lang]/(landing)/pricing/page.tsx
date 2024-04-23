import React from "react"

import { getSiteConfig } from "@/config/site"
import { PricingSection } from "@/components/app/landing/sections/pricing-section"
import { LangPageProps } from "@/types"

const Pricing = async ({ params: { lang } } : LangPageProps ) => {
  const siteConfig = await getSiteConfig("en")
  return (
    <div className="pb-5 pt-12 lg:pb-12 lg:pt-24">
      <PricingSection siteConfig={siteConfig} />
    </div>
  )
}


export default Pricing
