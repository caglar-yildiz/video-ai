import React from "react"
import { LangPageProps } from "@/types"

const DashboardPage = ({ params: { lang } }: LangPageProps) => {
  return (
    <section className="py-24">
      <div className="container">
        <span className="mb-3 text-3xl font-bold">Your Projects</span>
      </div>
    </section>
  )
}

export default DashboardPage
