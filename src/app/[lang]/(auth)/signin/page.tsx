import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { env } from "@/env.mjs"

import { DEFAULT_SIGNIN_REDIRECT } from "@/config/defaults"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OAuthButtons } from "@/components/app/auth/oauth-buttons"
import { SignInWithPasswordForm } from "@/components/forms/signin-with-password-form"
import { Icons } from "@/components/icons/icons"
import { Lang } from "@/i18n-config"
import { getSiteConfig } from "@/config/site"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign In",
  description: "Sign in to your account",
}


export default async function SignInPage({ params, searchParams }: {
  params: {
    lang : Lang
  }
  searchParams?: { [key: string]: string | string[] | undefined };
} ): Promise<JSX.Element> {

  const session = await auth()
  if (session) redirect(DEFAULT_SIGNIN_REDIRECT)

  const siteConfig = await getSiteConfig(params.lang)

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center">
      <Card className="max-sm:flex  max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{siteConfig.pages.login.messages.signIn}</CardTitle>
            <Link href="/">
              <Icons.close className="h-4 w-4" />
            </Link>
          </div>
          <CardDescription>
            {siteConfig.pages.login.messages.welcomeBack}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
          <OAuthButtons lang={params.lang}/>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
              <span className="bg-background px-2">
                {siteConfig.pages.login.messages.continueWithPassword}
              </span>
            </div>
          </div>
          <SignInWithPasswordForm formMessages={siteConfig.formMessages} />
        </CardContent>

        <CardFooter className="grid w-full text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
          <div>
            <span>{siteConfig.pages.login.messages.noAccount}</span>
            <Link
              aria-label="Sign up"
              href="/signup"
              className="font-bold tracking-wide text-primary underline-offset-4 transition-colors hover:underline"
            >
              {siteConfig.pages.login.messages.signUp}
              <span className="sr-only">{siteConfig.pages.login.messages.signIn}</span>
            </Link>
            .
          </div>
          <div>
            <span>{siteConfig.pages.login.messages.forgotPassword}</span>
            <Link
              aria-label="Reset password"
              href="/signin/password-reset"
              className="text-sm font-normal text-primary underline-offset-4 transition-colors hover:underline"
            >
              {siteConfig.pages.login.messages.resetNow}
              <span className="sr-only">{siteConfig.pages.login.messages.resetNow}</span>
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
