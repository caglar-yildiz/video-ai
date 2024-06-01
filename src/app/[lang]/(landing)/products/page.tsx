import React from "react"
import { LangPageProps } from "@/types"

import { getSiteConfig } from "@/config/site"

const Products = async ({ params: { lang } }: LangPageProps) => {
  const siteConfig = await getSiteConfig("en")
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export default Products
