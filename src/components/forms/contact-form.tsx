"use client"

import * as React from "react"
import { submitContactForm } from "@/actions/email"
import { contactFormSchema, type ContactFormInput } from "@/validations/email"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons/icons"
import { FormMessages } from "@/config/site"

type ContactFormProps = {
  formMessages : FormMessages
}

export function ContactForm({formMessages } : ContactFormProps): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(formData: ContactFormInput): void {
    startTransition(async () => {
      try {
        const message = await submitContactForm(formData)

        if (message === "success") {
          toast({
            title: formMessages.contactForm.success.title,
            description: formMessages.contactForm.success.description,
          })
          form.reset()
        } else {
          toast({
            title: formMessages.contactForm.error.title,
            description: formMessages.contactForm.error.description,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          description: formMessages.contactForm.error.description,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-8"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid w-full gap-8 md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formMessages.name}</FormLabel>

                <FormControl className="h-12">
                  <Input type="text" placeholder="John" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formMessages.email}</FormLabel>
                <FormControl className="h-12">
                  <Input type="email" placeholder="john@smith.com" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>{formMessages.message}</FormLabel>
              <FormControl className="min-h-[180px] md:min-h-[240px]">
                <Textarea
                  {...field}
                  placeholder={formMessages.contactForm.placeholder}
                  className="text-base"
                />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <Button
          variant="default"
          className="mx-auto h-14 w-1/4 text-lg font-bold tracking-wide hover:opacity-70"
        >
          {isPending && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          {isPending ? formMessages.sending : formMessages.submit}
          <span className="sr-only">{formMessages.submit}</span>
        </Button>
      </form>
    </Form>
  )
}
