import React from "react"
import { LangPageProps } from "@/types"

import { getSiteConfig } from "@/config/site"
import FeaturesSection from "@/components/app/landing/sections/features-section"

const Features = async ({ params: { lang } }: LangPageProps) => {
  const siteConfig = await getSiteConfig(lang)
  return (
    <div className="pb-5 pt-12 lg:pb-12 lg:pt-24">
      <FeaturesSection siteConfig={siteConfig}/>
    </div>
  )
}

export default Features
