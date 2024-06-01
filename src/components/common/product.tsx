"use client"

import { Product, ProductDescription } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Balancer from "react-wrap-balancer"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Lang } from "@/i18n-config"
import { Icons } from "@/components/icons/icons"
import LinkWrapper from "@/components/common/link-wrapper"
import { ButtonContents } from "@/config/site"

type ProductWithDesc = Product & {
  descriptions: ProductDescription[];
};

const ProductUI = ({ product, lang, message, className, buttonContents } : {
  product: ProductWithDesc
  className? : string
  lang : Lang
  message? : string
  buttonContents? : ButtonContents
}) => {

  const CurrencySymbol = Icons.currencySymbol[lang]

  return(
    <Card className={cn(
      "flex flex-col transition-all duration-1000 ease-out hover:opacity-80 md:hover:-translate-y-3", className
    )}>
      <CardHeader className="overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <CardTitle className="font-urbanist text-2xl tracking-wide">
          <Balancer>
            <span className="text-2xl font-extrabold ">
              {product.name}
            </span>
          </Balancer>
        </CardTitle>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex gap-2 text-4xl font-semibold md:gap-1 md:text-2xl lg:gap-2 lg:text-4xl">
              <div>
                 <span className="text-2xl">
                  {product.credits_amount} Credits
                </span>
                <span className={"flex items-center text-lg "}>
                  <span className="text-xl">{product.price}</span>
                  <CurrencySymbol className={"max-h-5 font-bold"} />

                </span>
              </div>
            </div>
            {message}
          </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between text-sm lg:text-base">
        <div className="grid gap-3 py-8">
          <ul className="flex flex-col gap-3">
            {product.descriptions.map((item) => (
              <li className="flex items-center gap-2" key={item.id}>
                <Icons.check className="h-4 w-4" />
                <Balancer>{item.description}</Balancer>
              </li>
            ))}
          </ul>
        </div>
        <LinkWrapper locale={lang} href={"/payment/" + product.id}>
          <Button
            variant="outline"
            className="h-10 w-full border bg-gradient-to-br from-blue-600/20 to-purple-600/20 font-bold tracking-wide"
          >
            {buttonContents?.buyNow ?? "Buy Now"}
          </Button>
        </LinkWrapper>
      </CardContent>
    </Card>
  )
}

export default ProductUI
