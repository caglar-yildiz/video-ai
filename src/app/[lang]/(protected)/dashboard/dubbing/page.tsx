"use client"

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal,
  useEffect,
  useState,
} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CircleAlert, FileVideo2 } from "lucide-react"
import Dropzone from "react-dropzone"
import { useForm } from "react-hook-form"
import ReactPlayer from "react-player"
import { z } from "zod"

import { numOfSpeakers } from "@/data/dashboard"
import { customFetch } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BeatLoader } from "react-spinners"
import { useRouter } from "next/navigation"

interface FileWithPreview extends File {
  preview: string
}

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

const formSchema = z.object({
  projectName: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  fileSubmit: z.any().optional(),
  videoUrl: z.string().optional(), // Unified field for any video URL
  numOfSpeakers: z.string().optional(),
  dubbingType: z.enum(["1", "2", "3"]),
})

export default function Dubbing() {
  const [file, setFile] = useState<any>([])
  const [uploadStatus, setUploadStatus] = useState("")
  const [videoDuration, setVideoDuration] = useState(null) // State to store video duration

  const [videoUrl, setVideoUrl] = useState("")
  const [youtubeurlcik, setYoutubeUrlcik] = useState("")
  const [showVideo, setShowVideo] = useState(false)
  const [languages, setLanguages] = useState<any>([])
  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState("")
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState("")
  const [calculateCost, setCalculateCost] = useState("")
  const [uploading, setUploading] = useState(false)
  const [apiResponse, setApiResponse] = useState("")
  const [videoSource, setVideoSource] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "all", // Validate form on each input change
    defaultValues: {
      projectName: "",
      sourceLanguage: "",
      targetLanguage: "",
      dubbingType: "",
      numOfSpeakers: "",
      videoUrl: "",
    },
  })

  const {
    formState,
    getValues,
    resetField,
    getFieldState,
    handleSubmit,
    watch,
  } = form
  const { isValid } = formState
  // @ts-ignore
  const fileValues = getValues("fileSubmit")
  // @ts-ignore
  const fileSubmitState = getFieldState("fileSubmit")
  let fileSize = file[0] ? `${(file[0].size / 1048576).toFixed(1)} mb` : ""
  let fileName = file[0] ? `${file[0].name}` : ""
  const youtubeUrl = watch("videoUrl") // Watch YouTube URL from the form
  const dubbingType = watch("dubbingType")

  console.log(videoUrl)


  const apiSendData = async (data: any) => {
    try {
      const response = await customFetch("http://0.0.0.0:8000/dubbings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const responseData = await response.json()
      if (response.ok) {
        console.log("API Response:", responseData.dubbing_id)
        setApiResponse(responseData.dubbing_id)
        localStorage.setItem("dubbingId", responseData.dubbing_id)
        const savedDubbingId = localStorage.getItem("dubbingId")
        console.log("Saved Dubbing ID:", savedDubbingId)
      } else {
        throw new Error(`Failed to submit data: ${responseData.message}`)
      }
    } catch (error: any) {
      setApiResponse(`Error: ${error.message}`)
    }
  }

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Original Form Data:", data)

    // Transforming data to match API requirements
    const apiData = {
      project_name: data.projectName,
      input_url: videoUrl, // Assuming videoUrl is the direct URL of the video
      credits_cost: parseInt(calculateCost), // Convert cost to integer, make sure to calculate this value during the form processes
      input_language_id: parseInt(languages.find((lang: { language_code: string }) => lang.language_code === selectedSourceLanguage)?.language_id),
      output_language_id: parseInt(languages.find((lang: { language_code: string }) => lang.language_code === selectedTargetLanguage)?.language_id),
      dubbing_type: parseInt(data.dubbingType), // Assuming dubbingType is already an integer in string form, convert it
      video_source: parseInt(videoSource), // Assuming videoSource determines the type of video (e.g., '0' for local, '1' for YouTube)
      number_speaker: data.numOfSpeakers ? parseInt(data.numOfSpeakers) : 0,
      token: "2133234", // Assuming there is a session or context where the token is managed
    }

    console.log("Transformed Data for API:", apiData)
    apiSendData(apiData) // Send the transformed data
    router.push("/dashboard/dubbing2")
  }


  const fetchVideoDuration = async (url: any) => {
    try {
      const response = await customFetch(`http://0.0.0.0:8000/video_length/?video_url=${encodeURIComponent(url)}`)
      const data = await response.json()
      if (response.ok) {

        setVideoDuration(data.video_length) // Update video duration state
      } else {
        console.error("Error fetching video duration:", data)
      }
    } catch (error) {
      console.error("Network error:", error)
    }
  }


  const handleUpload = async (acceptedFiles: any) => {
    const file = acceptedFiles[0]
    file.preview = URL.createObjectURL(file)
    setFile([file]) // Setting the file with preview URL
    const formData = new FormData()
    formData.append("video", file)

    setUploading(true) // Start uploading indicator
    try {
      const response = await customFetch("http://0.0.0.0:8000/upload-video/", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        setVideoSource("0") // Set video source to '0' for local file
        setVideoUrl(data.url) // Store the URL in videoUrl instead of uploadUrlcik
        setShowVideo(true) // Show video player
      } else {
        setUploadStatus("Upload failed: " + data.message)
      }
    } catch (error: any) {
      setUploadStatus("Upload error: " + error.message)
    } finally {
      setUploading(false) // Stop uploading indicator
    }
  }


  const calculateCostAPI = async () => {
    if (!videoDuration || !dubbingType) return // Ensure we have all required data
    try {
      console.log("Calculating cost...", dubbingType, videoDuration)
      const response = await customFetch("http://0.0.0.0:8000/calculate_cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dubbing_type: dubbingType,
          duration_seconds: Math.floor(videoDuration),
        }),
      })
      const result = await response.json()
      if (response.ok) {
        setCalculateCost(result.total_cost)
      } else {
        console.error("Failed to calculate cost:", result.message)
      }
    } catch (error) {
      console.error("Error calculating cost:", error)
    }
  }

  useEffect(() => {
    calculateCostAPI() // Call API whenever dubbingType changes and conditions are met
  }, [dubbingType, videoDuration]) // Dependency array includes dubbingType and videoDuration


  useEffect(() => {
    // Function to fetch language data
    const fetchLanguages = async () => {
      try {
        const response = await customFetch("http://0.0.0.0:8000/languages/")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLanguages(data) // Update state with fetched languages
      } catch (error) {
        console.error("Failed to fetch languages:", error)
      }
    }

    fetchLanguages()
  }, [])

  const handleTabChange = (value: any) => {
    setActiveTab(value)
    if (value === "upload") {
      console.log("Switching to upload")
      setYoutubeUrlcik("") // Clear YouTube URL when switching to upload
      setVideoUrl("") // Clear the video URL
      form.resetField("videoUrl")
    } else if (value === "youtube-link") {
      console.log("Switching to YouTube")
      setYoutubeUrlcik(youtubeUrl) // Set youtubeUrlcik to the current form value
      setFile([]) // Clear uploaded file when switching to YouTube
    }
  }
  useEffect(() => {
    if (youtubeUrl) { // Check if there is a YouTube URL
      fetchVideoDuration(youtubeUrl) // Call function to fetch video duration
      setVideoUrl(youtubeUrl) // Store the URL
      setVideoSource("1") // Set video source to '1' for YouTube

    }
  }, [youtubeUrl]) // Dependency array includes youtubeUrl to trigger effect on change

  useEffect(() => {
    if (!fileValues) {
      return
    } else if (
      !(fileSubmitState?.invalid ?? false) &&
      !(fileSubmitState?.isValidating ?? false)
    ) {
      setShowVideo(true)
    }
  }, [fileSubmitState?.invalid, fileSubmitState?.isValidating, fileValues])


  const handleSourceChange = (value: any) => {
    setSelectedSourceLanguage(value)
  }

  const handleTargetChange = (value: any) => {
    setSelectedTargetLanguage(value)
  }

  const onDuration = (duration: any) => {
    setVideoDuration(duration) // Set video duration when available
  }

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div className="flex flex-col px-8 py-10">
      <span className="mb-3 text-3xl font-bold">Dubbing</span>
      <span className="mb-6 text-slate-600">
        Enhance your content's accessibility with our swift translation across
        languages.
      </span>
      <div className="rounded-lg border border-slate-200 p-3">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-1 text-slate-800">
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your project name" {...field} />
                  </FormControl>
                  <FormMessage className="pl-1" />
                </FormItem>
              )}
            />
            <div className="flex w-full flex-row items-center gap-3 md:flex-row">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="sourceLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pl-1 text-slate-800">
                        Source Language
                      </FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value)
                        handleSourceChange(value)
                      }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Detect the language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language: { language_code: string; language_id: Key | null | undefined; language_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }) => (
                                            language.language_code !== selectedTargetLanguage && (
                                                <SelectItem key={language.language_id} value={language.language_code}>
                                                    {language.language_name}
                                                </SelectItem>
                                            )
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="pl-1">
                                    Select the language of the video
                                </FormDescription>
                                <FormMessage className="pl-1" />
                            </FormItem>
                        )}
                    />
                </div>
                <ArrowRight color="grey" />
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="targetLanguage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="pl-1 text-slate-800">
                                    Target Language
                                </FormLabel>
                                <Select onValueChange={(value) => { field.onChange(value); handleTargetChange(value); }}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {languages.map((language: { language_code: string; language_id: Key | null | undefined; language_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }) => (
                                            language.language_code !== selectedSourceLanguage && (
                                                <SelectItem key={language.language_id} value={language.language_code}>
                                                    {language.language_name}
                                                </SelectItem>
                                            )
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="pl-1">
                                    Select the language you want to dub the video into
                                </FormDescription>
                                <FormMessage className="pl-1" />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="pl-1 text-sm font-medium leading-none text-slate-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select a way to dub a video
            </div>
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="youtube-link">Youtube</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
              {activeTab === "upload" && (
              <div>
              <FormField control={form.control} render={({ field }) => (

                    <FormItem className="w-full">

                      <Dropzone  onDrop={handleUpload}>
                          {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            acceptedFiles,
                          }) => (
                            <div
                              className={`flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 pb-6 pt-9 hover:border-slate-400 ${isDragActive ? "bg-slate-300" : "bg-slate-100"}`}
                              {...getRootProps()}
                            >
                              <div>
                                <input {...getInputProps()} />

                                <p>In order to add or change the video please choose a file or drag and drop</p>
                                <span className="text-sm text-slate-600 flex items-center justify-center">
                                  {acceptedFiles.length
                                    ? ""
                                    : "No file selected."}
                                </span>
                              </div>
                            </div>
                          )}
                        </Dropzone>


                      {uploading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <BeatLoader color="#123abc" loading={uploading} size={5} />
                          <p className="text-white">Uploading...</p>
                        </div>
                      )}

                      <FormMessage className="pl-1" />
                    </FormItem>
                  )}
                 name={"videoUrl"}/>
                {/*todo burası video url değil, fileSubmit olacak*/}
                </div>
              )}
                {showVideo && (
                  <div className="relative flex flex-col items-center justify-center gap-3 p-4">
                    <ReactPlayer
                      url={file[0]?.preview}
                      controls={true}
                      loop={true}
                      playing={false}
                      muted={true}
                      onDuration={onDuration}
                    />
                    <div className="flex flex-row gap-1 text-sm font-medium text-slate-800">
                      <FileVideo2 size={18} color="#1e293b" />
                      <p>{fileName}</p>
                      <p className="text-slate-600">({fileSize})</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="youtube-link">
                <Card className="justify-center rounded-lg border-2 border-slate-300 bg-secondary">
                  <CardContent className="pt-3">
                    <FormField
                      control={form.control}
                      name="videoUrl"  // Changed to match the form state
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pl-1 text-slate-800">
                            Youtube URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste the Youtube URL here"
                              {...field}  // This now correctly ties this input to the form state
                            />
                          </FormControl>
                          <FormMessage className="pl-1" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>


            <FormField
                    control={form.control}
                    name="numOfSpeakers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row justify-between">
                        <FormLabel className="flex flex-row items-center justify-center gap-4 text-slate-800">
                          Number of Speakers
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleAlert size={22} />
                              </TooltipTrigger>
                              <TooltipContent className="w-48">
                                <p className="text-slate-800">
                                  0 is autodetect.
                                  Please provide the total number of different
                                  speakers in the video. If uncertain, we can
                                  detect them for you. While not mandatory, this
                                  information enhances the dubbing quality.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <div className="w-540 pb-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={"0"}
                                  placeholder="Auto Detect"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {numOfSpeakers.map((speaker) => (
                                <SelectItem
                                  key={speaker.index}
                                  value={speaker.num}
                                >
                                  {speaker.num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage className="pl-1" />
                      </FormItem>
                    )}
                  />

          <FormField
          control={form.control}
          name="dubbingType" // This is the new form field
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row items-center gap-4 text-slate-800">
                Dubbing Type
                <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleAlert size={22} />
                              </TooltipTrigger>
                              <TooltipContent className="w-48">
                                <p className="text-slate-800">
                                  <strong>HD Voice</strong> - Standard voice dubbing. It dubbs the voice with a standard male and female speaker.<br />
                                  <strong>FullHD Voice</strong> - High quality voice dubbing. It dubbs the voice with a high quality male and female speaker.<br />
                                  <strong>Advanced AI Voice Cloning</strong> - AI voice dubbing. It clones the voice of every actor and dubbs the video with AI.<br />
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
              </FormLabel>

              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">HD Voice</SelectItem>
                  <SelectItem value="2">FullHD Voice</SelectItem>
                  <SelectItem value="3">Advanced AI Voice Cloning</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="pl-1" />
            </FormItem>
          )}
        />

        {/*   <Accordion type="multiple">
              <AccordionItem
                value="advanced-settings"
                className="border-none px-2"
              >
                <AccordionTrigger className="text-sm font-medium text-slate-800">
                  <div>
                    Advanced Settings{" "}
                    <span className="font-normal text-slate-500">
                      (optional)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pr-1">


                  <div className="flex flex-row justify-between">
                    <FormLabel className="flex flex-row items-center justify-center text-slate-800">
                      Extract a time range for dubbing:
                    </FormLabel>
                    <div className="flex flex-row items-center justify-center gap-3">
                      <FormField
                        control={form.control}
                        name="rangeStart"
                        render={({ field }) => (
                          <FormItem className="flex flex-row justify-between">
                            <div className="w-[88px] pb-2">
                              <Input
                                placeholder="hh:mm:ss"
                                {...field}
                                onBlur={(e) => {
                                  const timeString = convertToTime(
                                    e.target.value
                                  )
                                  field.onChange(timeString)
                                }}
                              />
                            </div>
                            <FormMessage className="pl-1" />
                          </FormItem>
                        )}
                      />
                      -
                      <FormField
                        control={form.control}
                        name="rangeEnd"
                        render={({ field }) => (
                          <FormItem className="flex flex-row justify-between">
                            <div className="w-[88px] pb-2">
                              <Input
                                placeholder="hh:mm:ss"
                                {...field}
                                onBlur={(e) => {
                                  const timeString = convertToTime(
                                    e.target.value
                                  )
                                  field.onChange(timeString)
                                }}
                              />
                            </div>
                            <FormMessage className="pl-1" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion> */}
            <div className="font-medium items-center gap-4 text-slate-800" style={{textAlign: 'center'}}>
          <p>Credits needed to dub this video: {calculateCost}</p>
        </div>
            <Button
              type="submit"
              variant={"default"}
              className="w-full"
              disabled={!isValid}
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
