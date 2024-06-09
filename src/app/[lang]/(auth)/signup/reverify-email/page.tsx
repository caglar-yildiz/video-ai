import { type Metadata } from "next"
import Link from "next/link"
import { env } from "@/env.mjs"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmailVerificationForm } from "@/components/forms/email-verification-form"
import { VerifyEmailPageProps } from "@/app/[lang]/(auth)/signup/verify-email/page"
import { getSiteConfig } from "@/config/site"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Email Verification",
  description: "Provide your email address to receive the verification link",
}

const ReverifyEmailPage =async ({
                                            params,
                                            searchParams,
                                          }: Readonly<VerifyEmailPageProps>) =>{
  const emailVerificationToken = searchParams.token as string
  const siteConfig = await getSiteConfig(params.lang)


  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{siteConfig.pages.reverifyEmail.messages.emailVerification}</CardTitle>
          <CardDescription>
            {siteConfig.pages.reverifyEmail.messages.enterEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <EmailVerificationForm />
          <Link
            aria-label={siteConfig.pages.reverifyEmail.messages.cancelEmailReverification}
            href="/signin"
            className={buttonVariants({ variant: "outline" })}
          >
            <span className="sr-only">{siteConfig.pages.reverifyEmail.messages.cancelEmailReverification}</span>
            {siteConfig.pages.reverifyEmail.messages.cancel}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReverifyEmailPage
