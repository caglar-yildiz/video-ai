"use client"

import React from "react"
import { Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"

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
        <Pause color="white" size={36} className={className} />
      ) : (
        <Play color="white" size={36} className={className} />
      )}
    </Button>
  )
}

export default PlayPause
