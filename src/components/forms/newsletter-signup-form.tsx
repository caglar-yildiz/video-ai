"use client"

import * as React from "react"
import { subscribeToNewsletter } from "@/actions/newsletter"
import { ComponentWithLocaleType } from "@/types"
import {
  newsletterSignUpSchema,
  type NewsletterSignUpFormInput,
} from "@/validations/newsletter"
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
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons/icons"

export type NewsletterSignUpFormProps = {
  messages : string[]
}

export const NewsletterSignUpForm = ({ messages } : NewsletterSignUpFormProps) => {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<NewsletterSignUpFormInput>({
    resolver: zodResolver(newsletterSignUpSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(formData: NewsletterSignUpFormInput): void {
    startTransition(async () => {
      try {
        const message = await subscribeToNewsletter({ email: formData.email })

        switch (message) {
          case "exists":
            toast({
              title: messages[0],
              variant: "destructive",
            })
            form.reset()
            break
          case "success":
            toast({
              title: "Thank you!",
              description: messages[1],
            })
            form.reset()
            break
          default:
            toast({
              title: messages[3],
              description: messages[4],
              variant: "destructive",
            })
        }
      } catch (error) {
        toast({
          title: messages[3],
          description: messages[4],
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex h-10 w-full  items-center justify-center md:h-12"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative h-10 w-full space-y-0 md:h-12">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl className="rounded-r-none">
                <Input
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  className="h-10 placeholder:text-xs md:h-12 md:placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <Button
          className="size-10 rounded-l-none md:size-12"
          disabled={isPending}
        >
          {isPending ? (
            <Icons.spinner className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.paperPlane className="size-4" aria-hidden="true" />
          )}
          <span className="sr-only">Join newsletter</span>
        </Button>
      </form>
    </Form>
  )
}
