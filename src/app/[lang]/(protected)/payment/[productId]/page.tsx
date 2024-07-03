import { Lang } from "@/i18n-config"
import CreditCard from "@/components/CreditCard"
import { auth } from "@/auth"
import { prisma } from "@/db"
import { Icons } from "@/components/icons/icons"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { redirect } from "next/navigation"
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults"
import React from "react"
import BillingInfoPage from "@/components/app/protected/forms/billing"
import Image from "next/image"
import LinkWrapper from "@/components/common/link-wrapper"
import { getSiteConfig } from "@/config/site"

type PayProductProps  = {
  params: {
    productId: string
    lang : Lang
  }
}

const PayProduct =  async ({ params: { lang , productId} }:  PayProductProps )  => {

  // Handle the form data from the CreditCard component.
  function handleCreditCardData(data : any) {
    // Here, you can use the form data and the productId to send the data.
    // ...
    console.log("I am working")
  }

  const session = await auth()
  const user = session?.user.email ?
    await prisma.user.findUnique({
    where : {
      email : session?.user.email
    }
  })  : undefined

  if(!user) {
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT)
  }

  const billingInfo = await prisma.billingInfo.findUnique({
    where : {
      userId : user.id
    }
  })

  const product = await prisma.product.findUnique({
    where : {
      id : parseInt(String(productId))
    }
  })

  if(!product) redirect("/dashboard")
  const CurrencySymbol = Icons.currencySymbol[lang]

  const siteConfig = await getSiteConfig(lang)

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 bg-gray-100 dark:bg-gray-950">
      <div className="bg-gray-50 dark:bg-gray-900 p-6 md:p-8 lg:p-10 flex flex-col">
        <div className="mx-auto max-w-md space-y-6 flex-1">
          <div className="flex flex-col space-y-6">
            <div className="flex-1">
              <LinkWrapper locale={lang} href={"/dashboard"}>
                <Image
                  src="/images/logo.png"
                  alt="Hero top right corner radial light effect"
                  className=""
                  height={160}
                  width={360}
                />
              </LinkWrapper>
            </div>
            <Separator />
            <LinkWrapper locale={lang} href={"/dashboard"}>
              <div className="flex gap-1 items-center justify-self-start text-xs">
                <div className={"italic underline font-bold"}>{siteConfig.pages.payProduct.messages.goBack}</div>
                <div><Icons.back></Icons.back></div>
              </div>
            </LinkWrapper>
            <h2 className="text-2xl font-bold tracking-tight">{siteConfig.pages.payProduct.messages.orderSummary}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {siteConfig.pages.payProduct.messages.reviewOrder}
            </p>
          </div>
          <Card>
            <CardContent className="grid gap-4 font-bold">
              <Separator />
              <div className="flex items-center justify-between">
              <div>{siteConfig.pages.payProduct.messages.product}</div>
                <div>{product?.name}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>{siteConfig.pages.payProduct.messages.creditsToBeGranted}</div>
                <div>{product?.credits_amount + " " + siteConfig.pages.payProduct.messages.credits}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>{siteConfig.pages.payProduct.messages.total}</div>
                <span className={"flex items-center text-lg"}>
                  <CurrencySymbol
                    className={"max-h-4 font-bold"} />
                  {product?.price}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-md space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{siteConfig.pages.payProduct.messages.checkout}</h1>
              <p className="text-gray-500 dark:text-gray-400">{siteConfig.pages.payProduct.messages.reviewAndPurchase}</p>
            </div>
            <Accordion type="single" defaultValue={!billingInfo ? "billing-info" : "credit-card"} collapsible
                       className="w-full">
              <AccordionItem value="billing-info">
                <AccordionTrigger>{siteConfig.pages.payProduct.messages.billingInformation}</AccordionTrigger>
                <AccordionContent>
                  <BillingInfoPage formMessages={siteConfig.formMessages} billingInfo={billingInfo} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="credit-card">
                <AccordionTrigger>{siteConfig.pages.payProduct.messages.paymentMethod}</AccordionTrigger>
                <AccordionContent>
                  <CreditCard formMessages={siteConfig.formMessages} productId={productId} price={product?.price} userId={user?.id}/>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}


export default PayProduct
