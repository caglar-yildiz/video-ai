"use client"

import * as React from "react"
import { LangPageProps } from "@/types"
import Balancer from "react-wrap-balancer"

import SampleAudioPage from "@/components/app/landing/sections/audio-section"
import { dummySounds } from "@/data/landing"
import { getSiteConfig } from "@/config/site"

const Speech = async ({ params: { lang } }: LangPageProps) => {
  const siteConfig = await getSiteConfig(lang)
  return (
    <div className="my-32 flex w-full flex-col items-center gap-12 text-center">
      <div className="grid grid-cols-1 gap-8">
        <Balancer>
          <span
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-urbanist text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            {siteConfig.pages.speech.messages.upcomingFeature}
          </span>
        </Balancer>
        <h3 className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          <Balancer>
            {siteConfig.pages.speech.messages.advantage}
          </Balancer>
        </h3>
      </div>
      <div>
        <SampleAudioPage soundsGrid={dummySounds} />
      </div>
    </div>
  )
}

export default Speech
