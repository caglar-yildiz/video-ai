import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import UserProfile from "@/components/app/protected/forms/user-profile"
import * as React from "react"
import { auth } from "@/auth"
import { prisma } from "@/db"
import BillingInfoPage from "@/components/app/protected/forms/billing"
import { LangPageProps } from "@/types"
import OrganizationPage from "@/components/app/protected/organizaion"
import { getSiteConfig } from "@/config/site"

const Account = async ({ params: { lang } }: LangPageProps) => {

  const session = await auth()
  const user = session?.user.email ? await prisma.user.findUnique({
    where : {
      email : session?.user.email
    }
  }) : undefined

  const billingInfo = await prisma.billingInfo.findUnique({
    where : {
      userId : user?.id
    }
  })
  let organization;
  if(user && user.role === "ADMIN" && user.organizationId){
    organization = await prisma.organization.findUnique({
      where : {
        id : user.organizationId
      }
    })
  }

  const  siteConfig = await getSiteConfig(lang)



  return (
    <div className="flex flex-col">
      <header className="bg-gray-100 py-8 dark:bg-gray-800">
        <div className="container mx-auto flex items-center gap-6 px-4 md:px-6">
          <Avatar className="h-16 w-16">
            <AvatarImage alt="user-photo" src={user?.image || ''} />
            <AvatarFallback className={"rounded-full bg-pink-600 text-xl font-bold"}>{session?.user.name?.substring(0,1)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="text-xl font-bold">{user?.name }</h1>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 md:px-6">

        <Tabs className="w-full" defaultValue="profile">
          <TabsList className="mb-4 flex w-full border-b">
            <TabsTrigger value="profile">{siteConfig.pages.account.messages.profile}</TabsTrigger>
            <TabsTrigger value="billing">{siteConfig.pages.account.messages.billingInformation}</TabsTrigger>
            <TabsTrigger value="organization">{siteConfig.pages.account.messages.organization}</TabsTrigger>
          </TabsList>
          <TabsContent className="grid gap-6" value="profile">
            {user && <UserProfile formMessages={siteConfig.formMessages} user={user} />}
          </TabsContent>
          <TabsContent value="organization">
           <OrganizationPage formMessages={siteConfig.formMessages} organization={organization} isAdmin={user?.role === "ADMIN"}/>
          </TabsContent>
          <TabsContent className="grid gap-6" value="billing">
            <BillingInfoPage formMessages={siteConfig.formMessages} billingInfo={billingInfo} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Account
