import React from "react"

import { getSiteConfig } from '@/config/site'
import { LangPageProps } from "@/types"

const Products = async ({ params: { lang } } : LangPageProps ) => {
  const siteConfig =  await getSiteConfig('en')
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export default Products
