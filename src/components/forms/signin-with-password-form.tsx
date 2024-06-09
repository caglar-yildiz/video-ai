"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithPassword } from "@/actions/auth"
import {
  signInWithPasswordSchema,
  type SignInWithPasswordFormInput,
} from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"
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

type SigninWithPasswordForm = {
  formMessages : FormMessages
}

export function SignInWithPasswordForm({formMessages } :  SigninWithPasswordForm): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()


  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<SignInWithPasswordFormInput>({
    resolver: zodResolver(signInWithPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(formData: SignInWithPasswordFormInput) {
    startTransition(async () => {
      try {
        const message = await signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        switch (message) {
          case "not-registered":
            toast({
              title: formMessages.signinForm.messages.firstThingsFirst,
              description: formMessages.signinForm.messages.pleaseSignUp,
            })
            break
          case "incorrect-provider":
            toast({
              title: formMessages.signinForm.messages.emailInUse,
              description: formMessages.signinForm.messages.differentMethod,
            })
            break
          case "unverified-email":
            toast({
              title: formMessages.signinForm.messages.firstThingsFirst,
              description: formMessages.signinForm.messages.verifyEmail,
            })
            break
          case "invalid-credentials":
            toast({
              title: formMessages.signinForm.messages.invalidCredentials,
              description: formMessages.signinForm.messages.doubleCheck,
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: formMessages.signinForm.messages.success,
              description: formMessages.signinForm.messages.nowSignedIn,
            })
            router.push(searchParams.get("callbackUrl") || DEFAULT_SIGNIN_REDIRECT)
            break
          default:
            toast({
              title: formMessages.signinForm.messages.errorSignIn,
              description: formMessages.signinForm.messages.tryAgain,
              variant: "destructive",
            })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: formMessages.signinForm.messages.somethingWrong,
          description: formMessages.signinForm.messages.tryAgain,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{formMessages.email}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="johnsmith@gmail.com"
                  {...field}
                />
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
              <FormLabel>{formMessages.password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
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
              <span>{formMessages.signin}...</span>
            </>
          ) : (
            <span>{formMessages.signin}</span>
          )}
          <span className="sr-only">{formMessages.signinForm.messages.continueWithPassword}</span>
        </Button>
      </form>
    </Form>
  )
}
