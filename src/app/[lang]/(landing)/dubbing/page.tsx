import React from "react"

import { FeaturesSection } from "@/components/app/landing/sections/features-section"
import { LangPageProps } from "@/types"
import { getSiteConfig } from "@/config/site"


const Features = async ({ params: { lang } } : LangPageProps ) => {
   const siteConfig = await getSiteConfig(lang)
  return (
    <div className="pb-5 pt-12 lg:pb-12 lg:pt-24">
      <FeaturesSection />
    </div>
  )
}

export default Features
