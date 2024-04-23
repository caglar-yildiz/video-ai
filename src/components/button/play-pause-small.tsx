"use client"

import React from "react"
import { CirclePause, CirclePlay } from "lucide-react"

import { Button } from "../ui/button"

export type PlayPauseProp = {
  isPlaying: boolean
  handleAudio: () => void
  className: string
}

function PlayPause({
                     isPlaying,
                     handleAudio,
                     className,
                   }: Readonly<PlayPauseProp>) {
  return (
    <Button variant={"link"} onClick={handleAudio}>
      {isPlaying ? (
        <CirclePause color="white"  className={className} />
      ) : (
        <CirclePlay color="white"  className={className} />
      )}
    </Button>
  )
}

export default PlayPause
