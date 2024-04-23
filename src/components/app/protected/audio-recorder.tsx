"use client"

import { useRef, useState } from "react"

const mimeType = "audio/webm"
export type AudioRecorderProps = {
  onAudioString: (value: string) => void
}

const AudioRecorder = ({ onAudioString }: AudioRecorderProps) => {
  const [permission, setPermission] = useState(false)

  const mediaRecorder = useRef<MediaRecorder>(null)

  const [recordingStatus, setRecordingStatus] = useState("inactive")

  const [stream, setStream] = useState<MediaStream | null>()

  const [audioURL, setAudioURL] = useState<string>()

  const [audioChunks, setAudioChunks] = useState<Blob[]>()

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        })
        setPermission(true)
        setStream(mediaStream)
      } catch (err: any) {
        alert(err.message)
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.")
    }
  }

  const startRecording = async () => {
    if (!stream) return
    setRecordingStatus("recording")
    // @ts-ignore
    mediaRecorder.current = new MediaRecorder(stream, { mimeType })

    mediaRecorder.current.start()

    let localAudioChunks: Blob[] = []

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return
      if (event.data.size === 0) return
      localAudioChunks.push(event.data)
      console.log(
        localAudioChunks,
        localAudioChunks.length,
        localAudioChunks[0]?.size,
        localAudioChunks[0]?.type
      )
    }

    setAudioChunks(localAudioChunks)
  }

  const stopRecording = () => {
    setRecordingStatus("inactive")
    if (mediaRecorder.current === null) return
    mediaRecorder.current.stop()

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType })
      let audioUrl = URL.createObjectURL(audioBlob)

      setAudioURL(audioUrl)
      console.log("audioUrl", audioUrl, audioBlob.size, audioBlob.type)

      setAudioChunks([])
    }
  }

  return (
    <div>
      <h2>Audio Recorder</h2>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button">
              Stop Recording
            </button>
          ) : null}
        </div>
        {audioURL ? (
          <div className="audio-player">
            <audio src={audioURL} controls></audio>
            <a download href={audioURL}>
              Download Recording
            </a>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default AudioRecorder
