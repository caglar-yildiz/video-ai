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


interface CreditCardProps {
  productId : string;
  userId : string;
  price : number;
  formMessages : FormMessages
}

export default function CreditCard({ productId, userId, price, formMessages }: CreditCardProps) {

  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  // 1. Define your form.
  const form = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  })

  // Define a submit handler.
  const handleSubmit = (values: z.infer<typeof creditCardSchema>) => {
    startTransition(async () => {
      try {
        const result = await handleProductPurchase(
          {
            price: price,
            productId: parseInt(productId),
            userId: userId,
            creditCardInfo: values
          }
        )
        if (result) {
          toast({
            title: formMessages.creditCard.messages.payment,
            description: formMessages.creditCard.messages.paymentSuccessfullyMade,
          })
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
                      <Input placeholder="12/24" onChangeCapture={(e)=>{
                        // @ts-ignore
                        if(e.currentTarget.value.length > 1 && e.currentTarget.value.indexOf("/") === -1 && e.nativeEvent.inputType !== 'deleteContentBackward') {

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
