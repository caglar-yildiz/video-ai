import React from "react"
import Sidebar from "@/components/nav/sidebar"
import { LangPageProps } from "@/types"
import { auth } from "@/auth"
import { prisma } from "@/db"
import { redirect } from "next/navigation"


interface LandingLayoutProps extends LangPageProps {
  readonly children: React.ReactNode
}
const Layout = async ({
                        children,
                        params: { lang },
                      }: LandingLayoutProps)   => {

  const session = await auth()
  const user = session?.user.email ? await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  }): undefined

  if(user && user.role !== "DEVELOPER"){
    redirect(`/upcoming`)
  }

  return (
    <>
      <main className="overflow flex ">
        <Sidebar />
        <div className="w-full overflow-y-auto pl-72">{children}</div>
      </main>
    </>
  )
}

export default Layout
