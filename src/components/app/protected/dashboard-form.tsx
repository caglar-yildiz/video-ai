"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { File } from "lucide-react"
import Dropzone from "react-dropzone"
import { useForm } from "react-hook-form"
import ReactPlayer from "react-player"
import { z } from "zod"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
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
import { Slider } from "@/components/ui/slider"

interface FileWithPreview extends File {
  preview: string
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  username1: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  dropdown: z.string(),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  limit: z.number(),
  file: z.any(),
  // .refine((file: File) => file?.size !== 0, "File is required")
  // .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB")
  // .refine(
  //   (file) => checkFileType(file),
  //   "Only .mp3 and .mp4 formats are supported"
  // ),
})

export default function ProfileForm() {
  const [file, setFile] = useState<FileWithPreview[]>([])

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      username1: "",
      dropdown: "",
    },
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  // console.log("useState get preview? outside of return", file)
  // console.log("getValues outside of return", form.getValues("file"))
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="dubbing" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username1"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="voice" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="asdfasdf">dsfasf</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion type="multiple">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger>Select Voice</AccordionTrigger>
            <FormField
              control={form.control}
              name="limit"
              defaultValue={50}
              render={({ field }) => (
                <FormItem className="grid items-center">
                  <FormControl>
                    <AccordionContent>
                      <div>
                        <Slider
                          onValueChange={(v) => field.onChange(v[0])}
                          defaultValue={[50]}
                          max={100}
                          step={1}
                        />
                        <span>{field.value}</span>
                      </div>
                    </AccordionContent>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AccordionItem>
        </Accordion>
        <FormField
          control={form.control}
          name="file"
          render={(field) => (
            <FormItem className="w-full">
              <FormControl>
                <Dropzone
                  // noClick
                  onDrop={(acceptedFiles) => {
                    form.setValue("file", acceptedFiles as unknown as File, {
                      shouldValidate: true,
                    })
                    setFile(
                      acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                      )
                    )
                    console.log("getValues", form.getValues("file")[0])
                  }}
                  onDropRejected={(files) => {
                    console.log("onDropRejected ==> ", files)
                  }}
                  {...field}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    open,
                    isDragActive,
                    acceptedFiles,
                  }) => (
                    <div>
                      <div
                        style={{
                          borderStyle: "dashed",
                          backgroundColor: isDragActive
                            ? `#808080`
                            : "transparent",
                        }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />

                        <p>
                          <button type="button" onClick={open}>
                            Choose a file
                          </button>{" "}
                          or drag and drop
                        </p>

                        {acceptedFiles.length ? "" : "No file selected."}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues("file") && (
          <div className="relative flex items-center justify-center gap-3 p-4">
            <File className="h-4 w-4" />
            <p className="text-sm font-medium">{form.watch("file")?.name}</p>
            <ReactPlayer
              url={file[0]?.preview}
              controls={true}
              loop={true}
              playing={true}
              muted={true}
            />
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
