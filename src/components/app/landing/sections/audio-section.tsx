"use client"

import React, { useState } from "react"
import { AISound } from "@/types"

import { BackgroundGradient } from "@/components/ui/background-gradient"
import SoundCard from "@/components/common/sound-card"

interface SampleAudioPageProps {
  soundsGrid: AISound[]; // Assuming soundsGrid is an array of AISound
}

function SampleAudioPage({ soundsGrid }: SampleAudioPageProps) {
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(-1)

  const handlePlay = (index: number) => {
    if (currentlyPlayingIndex === index) {
      setCurrentlyPlayingIndex(-1)
      return
    }

    setCurrentlyPlayingIndex(index)
  }

  return (
    <BackgroundGradient >
      <div className={"grid grid-cols-1 gap-6 p-8 lg:grid-cols-2"}>
        {soundsGrid.map((sound: any, index: any) => {
          return (
            <SoundCard
              sound={sound}
              key={sound.key}
              onClick={() => handlePlay(index)}
              isPlaying={currentlyPlayingIndex === index}
            />
          )
        })}
      </div>
    </BackgroundGradient>
  )
}

export default SampleAudioPage
