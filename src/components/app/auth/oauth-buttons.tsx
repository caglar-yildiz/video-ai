"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons/icons"
import { Lang } from "@/i18n-config"
import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"
import { useSearchParams } from "next/navigation"

export function OAuthButtons( {lang} : {lang :Lang}): JSX.Element {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get("callbackUrl");

  async function handleOAuthSignIn(provider: string): Promise<void> {
    try {
      await signIn(provider, {
        callbackUrl: callbackUrl ? callbackUrl : DEFAULT_SIGNIN_REDIRECT
      })

      toast({
        title: "Success!",
        description: "You are now signed in",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      })

      console.error(error)
      throw new Error(`Error signing in with ${provider}`)
    }
  }

  return (
    <div className="grid gap-1 sm:grid-cols-1 sm:gap-4">
      <Button
        aria-label="Sign in with Google"
        variant="outline"
        onClick={() => void handleOAuthSignIn("google")}
        className="w-full sm:w-auto"
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  )
}
