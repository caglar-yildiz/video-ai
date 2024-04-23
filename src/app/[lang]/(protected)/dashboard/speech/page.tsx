import React from "react"

import SpeechToSpeech from "@/components/app/protected/forms/speech-to-speech-form"
import { LangPageProps } from "@/types"

const Speech = ({ params: { lang } } : LangPageProps ) => {
  return (
    <section className="py-24">
      <div className="container">
        <SpeechToSpeech />
      </div>
    </section>
  )
}

export default Speech
