"use client"

import { useEffect, useRef } from "react"
import { AISound } from "@/types"

import PlayPause from "@/components/button/play-pause"
import FlagIcon  from "@/components/icons/flag-icon"

export type SoundCardProp = {
  isPlaying: boolean
  sound: AISound
  onClick: () => void
}
const SoundCard = ({ sound, isPlaying, onClick }: SoundCardProp) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleClick = () => {
    const audioElements = Array.from(document.querySelectorAll("audio"))
    for (const audioElement of audioElements) {
      if (audioElement !== audioRef.current) {
        audioElement.pause()
        audioElement.currentTime = 0 // Reset playback position
      }
    }
    onClick()
  }

  useEffect(() => {
    const audioElement = audioRef.current

    if (isPlaying && audioElement !== null) {
      audioElement
        .play()
        .then()
        .catch(() => {
          console.warn("Failed to play audio:", sound.url)
        })
    } else if (audioElement !== null) {
      audioElement.pause()
    }

    // Clean up event listener on component unmount to prevent memory leaks
    return () => {
      if (audioElement !== null) {
        audioElement.pause()
      }
    }
  }, [isPlaying, sound.url])

  return (
    <div className="mb-2 flex w-full flex-row items-center rounded-2xl bg-transparent/10 px-4 py-2 hover:bg-transparent/20">
      <div className="relative flex flex-1 flex-row items-center justify-start">
        <img
          src={sound.imageURL}
          alt={sound.name}
          className="h-20 w-20 rounded-full"
        />
        <div className={"absolute top-0 left-0"}>
          <FlagIcon countryCode={sound.lang} />
        </div>

        <div className="mx-3 flex flex-col items-start justify-start">
          <p className="text-xl font-bold text-white">{sound?.title}</p>
          <p className="mt-1 text-base text-slate-300">{sound?.name}</p>
        </div>
      </div>
      <PlayPause
        className="cursor-pointer"
        isPlaying={isPlaying}
        handleAudio={handleClick}
      />
      <audio
        ref={audioRef}
        src={sound.url}
        autoPlay={false}
        onEnded={onClick}
      />
    </div>
  )
}

export default SoundCard
