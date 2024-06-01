"use client"

import React from "react"
import { ComponentWithLocaleType } from "@/types"

export const VideoSection: ComponentWithLocaleType = ({ locale }) => {
  return (
    <section
      id="tech-section"
      aria-label="tech section"
      className="w-full py-8 sm:grid"
    >
      <div
        className="container flex w-full max-w-[56rem] animate-fade-up flex-wrap place-items-center items-center justify-center gap-6 rounded-xl opacity-0 sm:gap-[38px] md:gap-[36px] lg:gap-x-12"
        style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
      >
        <video
          className="rounded-3xl shadow-2xl"
          width="530"
          muted
          height="300"
          loop
          preload="none"
          autoPlay
        >
          <source src="/videos/kek.mp4" type="video/mp4" />
          <track
            src="/path/to/captions.vtt"
            kind="subtitles"
            srcLang="en"
            label="English"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  )
}
