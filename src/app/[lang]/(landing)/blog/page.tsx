import React from "react"
import { LangPageProps } from "@/types"

// import { getSiteConfig } from '@/config/site'

const Blog = ({ params: { lang } }: LangPageProps) => {
  // const siteConfig = await getSiteConfig('en')
  return (
    <div>
      <h1>Blog</h1>
    </div>
  )
}

export default Blog
