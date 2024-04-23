import React, { useEffect, useState } from "react"
import ReactPlayer from "react-player"

function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState<null | string>(null)

  useEffect(() => {
    // Assuming you have the video file imported or fetched
    const videoFile = require("../../../public/videos/anladim.mp4")
    const objectUrl = URL.createObjectURL(videoFile)
    setVideoUrl(objectUrl)

    // Clean up the object URL when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return <div>{videoUrl && <ReactPlayer url={videoUrl} controls />}</div>
}

export default VideoPlayer
