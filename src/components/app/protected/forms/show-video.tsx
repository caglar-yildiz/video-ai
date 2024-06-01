import React, { useEffect, useState } from "react"
import { FileVideo2 } from "lucide-react"
import ReactPlayer from "react-player"

export default function VideoPreview({ form, file }: any) {
  const [showVideo, setShowVideo] = useState(false)
  let fileSize = file[0] ? `${(file[0].size / 1048576).toFixed(1)} mb` : ""
  let fileName = file[0] ? `${file[0].name}` : ""
  console.log(form.getValues("fileSubmit"))
  useEffect(() => {
    // const fileSubmitState = form.getFieldState("fileSubmit")
    // console.log("Invalid: ", !(fileSubmitState?.invalid ?? false))
    console.log("getValues: ", form.watch("fileSubmit"))
    // console.log("isValidating: ", !(fileSubmitState?.isValidating ?? false))
    if (form.getValues("fileSubmit")) {
      // if (
      //   form.getValues("fileSubmit") &&
      //   !(fileSubmitState?.invalid ?? false) &&
      //   !(fileSubmitState?.isValidating ?? false)
      // ) {
      setShowVideo(true)
      // }
    }

    // return ()
  }, [form.getValues, form])
  return (
    showVideo && (
      <div className="relative flex flex-col items-center justify-center gap-3 p-4">
        <ReactPlayer
          url={file[0]?.preview}
          controls={true}
          loop={true}
          playing={true}
          muted={true}
        />
        <div className="flex flex-row gap-1 text-sm font-medium text-slate-800">
          <FileVideo2 size={18} color="#1e293b" />
          <p>{fileName}</p>
          <p className="text-slate-600">({fileSize})</p>
        </div>
      </div>
    )
  )
}
