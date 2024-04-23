import React from "react"

import { FAQSection } from "@/components/app/landing/sections/faq-section"
import { LangPageProps } from "@/types"
import { getSiteConfig } from "@/config/site"


const Faq = async ({ params: { lang } } : LangPageProps ) =>{
  const siteConfig = await getSiteConfig('en')
  return (
    <div className="pb-5 pt-12 lg:pb-12 lg:pt-24">
      <FAQSection />
    </div>
  )
}

export default Faq
