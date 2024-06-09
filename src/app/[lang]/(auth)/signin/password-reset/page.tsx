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
import { PasswordResetForm } from "@/components/forms/password-reset-form"
import { getSiteConfig } from "@/config/site"
import { Lang } from "@/i18n-config"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Password Reset",
  description: "Provide your email address to receive a reset link",
}
interface PasswordResetPageProps {
  params: {
    lang : Lang
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PasswordReset({
                                        params,
                                        searchParams,
                                      }: Readonly<PasswordResetPageProps>) {
  const siteConfig = await getSiteConfig(params.lang)

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{siteConfig.pages.passwordReset.messages.passwordReset}</CardTitle>
          <CardDescription>
            {siteConfig.pages.passwordReset.messages.enterEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <PasswordResetForm />
          <Link
            aria-label={siteConfig.pages.passwordReset.messages.cancelPasswordReset}
            href="/signin"
            className={buttonVariants({ variant: "outline" })}
          >
            <span className="sr-only">{siteConfig.pages.passwordReset.messages.cancelPasswordReset}</span>
            {siteConfig.pages.passwordReset.messages.cancel}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
