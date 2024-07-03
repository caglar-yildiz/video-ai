"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { creditCardSchema } from "@/validations/payment"
import React from "react"
import { handleProductPurchase } from "@/actions/payment"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons/icons"
import { FormMessages } from "@/config/site"
import { useRouter } from "next/navigation"


interface CreditCardProps {
  productId : string;
  userId : string;
  price : number;
  formMessages : FormMessages;
}

export default function CreditCard({ productId, userId, price, formMessages }: CreditCardProps) {

  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [htmlContent, setHtmlContent] = React.useState<string | null>(null);
  const [htmlUrl, setHtmlUrl] = React.useState<string | null>(null);

  const router = useRouter()


  const handleRedirect = (htmlContent: string) => {
    // Create a Blob from the HTML string
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

    // Create an object URL from the Blob
    const url = URL.createObjectURL(htmlBlob);

    // Open the URL in a new tab
    window.open(url, '_blank');
  };

  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  })

  const handleSubmit = (values: z.infer<typeof creditCardSchema>) => {
    startTransition(async () => {
      console.log(values)
      try {
        const result = await handleProductPurchase(
          {
            price: price.toString(),
            productId: parseInt(productId),
            userId: userId,
            creditCardInfo: values
          }
        )
        if (result) {
          if(result.Sonuc === "3D" && result.UCD_HTML) {
            handleRedirect(result.UCD_HTML);
          } else if (result.Sonuc === "3D" && result.UCD_URL) {
            router.push(result.UCD_URL)
          }
          else if(result.Sonuc === "success") {
            toast({
              title: formMessages.creditCard.messages.payment,
              description: formMessages.creditCard.messages.paymentSuccessfullyMade,
            })
            router.push("/dashboard")
          } else {
            if (result.message === "priceMismatch" || result.message === "paymentFailed") {
              toast({
                title: formMessages.creditCard.messages[`${result.message}`] || formMessages.creditCard.messages.payment,
                description: formMessages.creditCard.messages.paymentFailed,
                variant: "destructive",
              })
            }else {
              toast({
                title: formMessages.creditCard.messages.payment,
                description: result.message,
                variant: "destructive",
              })
            }
          }
        }else {
          toast({
            title: formMessages.creditCard.messages.payment,
            description: formMessages.creditCard.messages.paymentFailed,
            variant: "destructive",
          })
        }

      } catch (e) {
        toast({
          title: formMessages.creditCard.messages.somethingWentWrong,
          description: formMessages.creditCard.messages.pleaseTryAgain,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="flex min-h-screen space-y-6 flex-col items-center justify-between bg-slate-100 p-6">
      { htmlUrl &&
        <iframe src={htmlUrl} title="Payment Redirect" />
      }
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mx-auto flex w-full max-w-3xl rounded-md bg-white px-6 py-8 shadow-md"
        >
          <div className="w-full pr-8">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="pl-1 text-slate-800">
                    {formMessages.creditCard.messages.cardNumber}:
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="1234 1234 1234 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mb-4 flex gap-x-2">
              <FormField
                control={form.control}
                name="expDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="pl-1 text-slate-800">
                      {formMessages.creditCard.messages.expDate}:
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="12/24" onChangeCapture={(e) => {
                        // @ts-ignore
                        if (e.currentTarget.value.length > 1 && e.currentTarget.value.indexOf("/") === -1 && e.nativeEvent.inputType !== 'deleteContentBackward') {

                          e.currentTarget.value = e.currentTarget.value.substring(0, 2) + "/" +
                            e.currentTarget.value.substring(2)
                        }
                      }} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CCV"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="pl-1 text-slate-800">CVC:</FormLabel>
                    <FormControl>
                      <Input placeholder="966" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-1 text-slate-800">
                    {formMessages.creditCard.messages.cardHolder}:
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex py-4 items-center ">
              <div>
                <input type="checkbox" {...form.register("is3DSecure")} id="is3DSecure" />
              </div>
              <label htmlFor="is3DSecure" className="pl-1 text-slate-800">
                {formMessages.creditCard.messages.use3DSecure}
              </label>
            </div>
            <Button disabled={isPending} className="w-full" type="submit">
              {isPending ? (
                <Icons.spinner className="size-2 animate-spin" aria-hidden="true" />
              ) : (
                formMessages.creditCard.messages.purchase
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
