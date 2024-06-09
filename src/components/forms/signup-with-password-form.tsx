"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signUpWithPassword } from "@/actions/auth"
import {
  signUpWithPasswordSchema,
  type SignUpWithPasswordFormInput,
} from "@/validations/auth"
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
import { PasswordInput } from "@/components/common/password-input"
import { Icons } from "@/components/icons/icons"
import { FormMessages } from "@/config/site"

type SignupWithPasswordForm = {
  formMessages : FormMessages
}

export function SignUpWithPasswordForm({formMessages } :  SignupWithPasswordForm): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<SignUpWithPasswordFormInput>({
    resolver: zodResolver(signUpWithPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(formData: SignUpWithPasswordFormInput): void {
    startTransition(async () => {
      try {
        const message = await signUpWithPassword({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })

        switch (message) {
          case "exists":
            toast({
              title: formMessages.signUpWithPasswordForm.messages.userExists,
              description: formMessages.signUpWithPasswordForm.messages.signInInstead,
              variant: "destructive",
            })
            form.reset()
            break
          case "success":
            toast({
              title: formMessages.signUpWithPasswordForm.messages.success,
              description: formMessages.signUpWithPasswordForm.messages.checkInbox,
            })
            router.push("/signin")
            break
          default:
            toast({
              title: formMessages.signUpWithPasswordForm.messages.somethingWrong,
              description: formMessages.signUpWithPasswordForm.messages.tryAgain,
              variant: "destructive",
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: formMessages.signUpWithPasswordForm.messages.somethingWrong,
          description: formMessages.signUpWithPasswordForm.messages.tryAgain,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formMessages.signUpWithPasswordForm.messages.email}</FormLabel>
              <FormControl>
                <Input placeholder="johnsmith@gmail.com" {...field} />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formMessages.signUpWithPasswordForm.messages.password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formMessages.signUpWithPasswordForm.messages.confirmPassword}</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <Button disabled={isPending}>
          {isPending ? (
            <>
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
              <span>{formMessages.signUpWithPasswordForm.messages.signingUp}</span>
            </>
          ) : (
            <span>{formMessages.signUpWithPasswordForm.messages.continue}</span>
          )}
          <span className="sr-only">
          {formMessages.signUpWithPasswordForm.messages.continueSigningUp}
        </span>
        </Button>
      </form>
    </Form>
  )
}
