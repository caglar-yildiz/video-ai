"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CircleAlert, FileVideo2 } from "lucide-react"
import Dropzone from "react-dropzone"
import { useForm } from "react-hook-form"
import ReactPlayer from "react-player"
import { z } from "zod"

import { countries, numOfSpeakers, videoResolution } from "@/data/dashboard"
import { checkFileType, convertToTime } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

interface FileWithPreview extends File {
  preview: string
}

const MAX_FILE_SIZE = 10485760 // 10MB

const formSchema = z.object({
  projectName: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  fileSubmit: z
    .any()
    .refine((file: File[]) => file, "File is required")
    .refine(
      (file: File[]) => file?.[0] && checkFileType(file[0]),
      "Only .mp3 and .mp4 formats are supported"
    )
    .refine(
      (file: File[]) => file?.[0] && file[0].size < MAX_FILE_SIZE,
      "Max size is 10MB"
    )
    .optional(),
  youtube: z.string().optional(),
  numOfSpeakers: z.string().optional(),
  videoResolution: z.string().optional(),
  rangeStart: z.string().optional(),
  rangeEnd: z.string().optional(),
})

export default function Dubbing() {
  const [file, setFile] = useState<FileWithPreview[]>([])
  const [showVideo, setShowVideo] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      sourceLanguage: "",
      targetLanguage: "",
      numOfSpeakers: "",
      rangeEnd: "",
      rangeStart: "",
      videoResolution: "",
    },
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  })

  const { formState, getValues, resetField, getFieldState, handleSubmit } = form
  const { isValid } = formState
  const fileValues = getValues("fileSubmit")
  const fileSubmitState = getFieldState("fileSubmit")
  let fileSize = file[0] ? `${(file[0].size / 1048576).toFixed(1)} mb` : ""
  let fileName = file[0] ? `${file[0].name}` : ""

  console.log(formState.errors)

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("onSubmit", values)
  }

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

  const watchYoutube = getValues("youtube")
  const watchFileSubmit = getValues("fileSubmit")

  useEffect(() => {
    if (watchYoutube) {
      resetField("fileSubmit")
      setShowVideo(false)
    }

    if (watchFileSubmit) {
      resetField("youtube")
      setShowVideo(true)
    }
  }, [watchYoutube, watchFileSubmit, resetField])

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
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Detect the language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.index}
                              value={country.name}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="pl-1">
                        Select the language your file currently have
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
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.slice(1).map((country) => (
                            <SelectItem
                              key={country.index}
                              value={country.name}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="pl-1">
                        Select the language you want to convert to
                      </FormDescription>
                      <FormMessage className="pl-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="pl-1 text-sm font-medium leading-none text-slate-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select a way to upload a video
            </div>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="youtube-link">Youtube</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <FormField
                  control={form.control}
                  name="fileSubmit"
                  render={(field) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            form.setValue(
                              "fileSubmit",
                              acceptedFiles as unknown as File,
                              {
                                shouldValidate: true,
                              }
                            )
                            setFile(
                              acceptedFiles.map((file) =>
                                Object.assign(file, {
                                  preview: URL.createObjectURL(file),
                                })
                              )
                            )
                          }}
                          accept={{
                            "video/mp4": [".mp4", ".MP4"],
                            "video/mpeg": [".mpeg"],
                            "video/webm": [".webm"],
                            "video/wav": [".wav"],
                            "video/m4a": [".m4a"],
                          }}
                          {...field}
                        >
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

                                <p>Choose a file or drag and drop</p>
                                <span className="text-sm text-slate-600">
                                  {acceptedFiles.length
                                    ? ""
                                    : "No file selected."}
                                </span>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      </FormControl>
                      <FormMessage className="pl-1" />
                    </FormItem>
                  )}
                />
                {/* <VideoPreview form={form} file={file} /> */}
                {showVideo && (
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
                )}
              </TabsContent>
              <TabsContent value="youtube-link">
                <Card className="justify-center rounded-lg border-2 border-slate-300 bg-secondary">
                  <CardContent className="pt-3">
                    <FormField
                      control={form.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pl-1 text-slate-800">
                            Youtube URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                              {...field}
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
            <Accordion type="multiple">
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
                                  Please provide the total number of different
                                  speakers in the video. If uncertain, we can
                                  detect them for you. While not mandatory, this
                                  information enhances the dubbing quality.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <div className="w-24 pb-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={"Detect"}
                                  placeholder="Detect"
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
                    name="videoResolution"
                    render={({ field }) => (
                      <FormItem className="flex flex-row justify-between">
                        <FormLabel className="flex flex-row items-center justify-center gap-4 text-slate-800">
                          Video Resolution
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleAlert size={22} />
                              </TooltipTrigger>
                              <TooltipContent className="w-48">
                                <p className="text-slate-800">
                                  Please provide the total number of different
                                  speakers in the video. If uncertain, we can
                                  detect them for you. While not mandatory, this
                                  information enhances the dubbing quality.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <div className="w-24 pb-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={"medium"}
                                  placeholder="Medium"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {videoResolution.map((video) => (
                                <SelectItem key={video.index} value={video.res}>
                                  {video.res}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage className="pl-1" />
                      </FormItem>
                    )}
                  />
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
            </Accordion>
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
