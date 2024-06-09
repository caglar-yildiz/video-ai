import { auth } from "@/auth"

import { getSiteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/app/auth/signout-button"
import { Icons } from "@/components/icons/icons"
import { DashboardNav } from "@/components/nav/dashboard-nav"
import { prisma } from "@/db"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import LinkWrapper from "@/components/common/link-wrapper"
import {  Lang } from "@/i18n-config"
import { cookies } from "next/headers"
import * as React from "react"
import { getCookie } from "cookies-next"

const Sidebar = async () => {
  const locale = getCookie("X-LOCALE", { cookies })
  const siteConfig = await getSiteConfig(locale as Lang)
  const side_bar = siteConfig.side_nav_items
  const session = await auth()
  let user = undefined;
  if(session?.user && session?.user.email){
    user = await prisma.user.findUnique({
      where : {
        email : session?.user.email
      }
    })
  }

  return (
    <nav
      className={cn(
        `fixed h-screen w-72 gap-2 overflow-x-hidden border-r bg-muted px-4 py-5`
      )}
    >
      <div className="flex h-full flex-1 flex-col justify-between gap-y-4">
        <div className="gap-3 py-2">
          <div className="mb-8 flex justify-between">
            <h2 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text px-4 text-2xl font-bold tracking-tight text-transparent">
              ITRANSL8
            </h2>
            {/* <ThemeToggle /> */}
          </div>
          <DashboardNav items={side_bar} />
        </div>
        <div className="py-3">
          {session?.user && user && (
            <>
              <Card className={"bg-transparent"}>
                <CardContent>
                  <p className={"font-bold"}>{siteConfig.profile.credits}</p>
                  <p className="flex items-center">{siteConfig.profile.creditsLeft}  {" "} { user.credit + " "} </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <LinkWrapper locale={locale as Lang} href={"/dashboard/credit"}>{siteConfig.profile.buyMore}</LinkWrapper>
                  </Button>
                </CardFooter>
              </Card>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-0 transition-all duration-300 ease-in-out hover:opacity-70">
                <div className="flex items-center">
                  <Avatar
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    {session?.user.image && (
                      <>
                        <AvatarImage
                          src={session?.user.image}
                          alt={session?.user.name ?? "user's profile picture"}
                          className="size-7 rounded-full"
                        />
                        <AvatarFallback className={"size-7 rounded-full bg-pink-600"}>{session?.user.name?.substring(0,1)}</AvatarFallback>
                      </>
                    ) }
                  </Avatar>
                  {session?.user.name ? (
                    <p className="ml-2 text-sm font-medium leading-none">
                      {session?.user.name}
                    </p>
                  ) : (
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="ml-6 w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <LinkWrapper locale={locale as Lang} href="/dashboard/account">
                      <Icons.avatar
                        className="mr-2 size-4"
                        aria-hidden="true"
                      />
                      {siteConfig.profile.account}
                    </LinkWrapper>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOutButton buttonText={siteConfig.profile.signOut} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
