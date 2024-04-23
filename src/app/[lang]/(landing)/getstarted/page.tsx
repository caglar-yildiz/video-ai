import React from "react"
import Image from "next/image"
import { LangPageProps } from "@/types"
import { getSiteConfig } from "@/config/site"
import Balancer from "react-wrap-balancer"
import { ContactForm } from "@/components/forms/contact-form"
import { ContactSection } from "@/components/app/landing/sections/contact-section"

const GetStarted = async ({ params: { lang } }: LangPageProps) => {
  return (
    <div className=" w-full pt-24 items-center justify-center">
      <ContactSection locale={lang}/>
    </div>
  )
}


export default GetStarted
