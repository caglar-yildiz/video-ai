import React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import Sidebar from "@/components/nav/sidebar"

const Layout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await auth()
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)

  return (
    <div className="overflow flex">
      <Sidebar />
      <main className="w-full overflow-y-auto pl-72">{children}</main>
    </div>
  )
}

export default Layout
