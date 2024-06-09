import { markEmailAsVerified } from "@/actions/email"
import { getUserByEmailVerificationToken } from "@/actions/user"
import { env } from "@/env.mjs"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons/icons"
import { Lang } from "@/i18n-config"
import { getSiteConfig } from "@/config/site"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Metadata } from "next" // Add this line

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Email Verification",
  description: "Verify your email address to continue",
}

export interface VerifyEmailPageProps {
  params: {
    lang : Lang
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function VerifyEmailPage({
                                                params,
                                                searchParams,
                                              }: Readonly<VerifyEmailPageProps>): Promise<JSX.Element> {
  const emailVerificationToken = searchParams.token as string
  const siteConfig = await getSiteConfig(params.lang)

  if (emailVerificationToken) {
    const user = await getUserByEmailVerificationToken({
      token: emailVerificationToken,
    })

    if (!user) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center">
          <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
            <CardHeader>
              <CardTitle>{siteConfig.pages.verifyEmail.messages.invalidEmailVerificationToken}</CardTitle>
              <CardDescription>
                {siteConfig.pages.verifyEmail.messages.returnToSignUp}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                aria-label="Go back to sign in page"
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full"
                )}
              >
                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                <span className="sr-only">{siteConfig.pages.verifyEmail.messages.tryAgain}</span>
                {siteConfig.pages.verifyEmail.messages.tryAgain}
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    const message = await markEmailAsVerified({ token: emailVerificationToken })
    if (message !== "success") redirect("/signup")

    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
          <CardHeader>
            <CardTitle>{siteConfig.pages.verifyEmail.messages.emailSuccessfullyVerified}</CardTitle>
            <CardDescription>
              {siteConfig.pages.verifyEmail.messages.canNowSignIn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              aria-label="Go back to sign in page"
              href="/signin"
              className={buttonVariants()}
            >
              <span className="sr-only">{siteConfig.pages.verifyEmail.messages.goToSignInPage}</span>
              {siteConfig.pages.verifyEmail.messages.goToSignInPage}
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  } else {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
          <CardHeader>
            <CardTitle>{siteConfig.pages.verifyEmail.messages.missingEmailVerificationToken}</CardTitle>
            <CardDescription>
              {siteConfig.pages.verifyEmail.messages.returnToSignUpAgain}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              aria-label="Go back to sign up page"
              href="/signup"
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              <span className="sr-only">{siteConfig.pages.verifyEmail.messages.tryAgain}</span>
              {siteConfig.pages.verifyEmail.messages.tryAgain}
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
