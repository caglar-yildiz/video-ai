import React from "react"
import { LangPageProps } from "@/types"

import SpeechToSpeech from "@/components/app/protected/forms/speech-to-speech-form"

const Speech = ({ params: { lang } }: LangPageProps) => {
  return (
    <section className="py-24">
      <div className="container">
        <SpeechToSpeech />
      </div>
    </section>
  )
}

export default Speech
