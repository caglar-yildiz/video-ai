import * as React from "react"
import Image from "next/image"
import { LangPageProps } from "@/types"

import { Footer } from "@/components/nav/footer"
import { Header } from "@/components/nav/header"
import ScrollToTop from "@/components/scroll-to-top"

interface LandingLayoutProps extends LangPageProps {
  readonly children: React.ReactNode
}

const LandingLayout = ({
  children,
  params: { lang },
}: LandingLayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col overflow-visible">
      <Image
        fill
        src="/images/radial_1.svg"
        alt="Hero top right corner radial light effect"
        className="-z-10 opacity-10 lg:opacity-20"
      />
      <Header locale={lang} />
      <main className="flex-1">{children}</main>
      <ScrollToTop />
      <Footer locale={lang} />
    </div>
  )
}

export default LandingLayout
