import type { Metadata } from "next"
import Link from "next/link"
import { getUserByResetPasswordToken } from "@/actions/user"
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
import { PasswordUpdateForm } from "@/components/forms/password-update-form"
import { Icons } from "@/components/icons/icons"
import { Lang } from "@/i18n-config"
import { getSiteConfig } from "@/config/site" // Add this line

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Password Update",
  description: "Set your new password",
}

interface PasswordUpdatePageProps {
  params: {
    lang : Lang
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PasswordUpdatePage({
                                                   params,
                                                   searchParams,
                                                 }: Readonly<PasswordUpdatePageProps>): Promise<JSX.Element> {
  const siteConfig = await getSiteConfig(params.lang)

  if (searchParams.token) {
    const user = await getUserByResetPasswordToken({
      token: String(searchParams.token),
    })

    if (!user) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center">
          <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
            <CardHeader>
              <CardTitle>{siteConfig.pages.passwordUpdate.messages.invalidResetPasswordToken}</CardTitle>
              <CardDescription>
                {siteConfig.pages.passwordUpdate.messages.returnToSignIn}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                aria-label="Go back to sign in page"
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full"
                )}
              >
                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                <span className="sr-only">{siteConfig.pages.passwordUpdate.messages.tryAgain}</span>
                {siteConfig.pages.passwordUpdate.messages.tryAgain}
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Card className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
          <CardHeader>
            <CardTitle>{siteConfig.pages.passwordUpdate.messages.passwordUpdate}</CardTitle>
            <CardDescription>
              {siteConfig.pages.passwordUpdate.messages.setNewPassword}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <PasswordUpdateForm
              resetPasswordToken={String(searchParams.token)}
            />
            <Link
              aria-label={siteConfig.pages.passwordUpdate.messages.cancelPasswordUpdate}
              href="/signin"
              className={buttonVariants({ variant: "outline" })}
            >
              <span className="sr-only">{siteConfig.pages.passwordUpdate.messages.cancelPasswordUpdate}</span>
              {siteConfig.pages.passwordUpdate.messages.cancel}
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
            <CardTitle>{siteConfig.pages.passwordUpdate.messages.missingResetPasswordToken}</CardTitle>
            <CardDescription>
              {siteConfig.pages.passwordUpdate.messages.returnToSignIn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              aria-label="Go back to sign in page"
              href="/signin"
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              <span className="sr-only">{siteConfig.pages.passwordUpdate.messages.tryAgain}</span>
              {siteConfig.pages.passwordUpdate.messages.tryAgain}
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
