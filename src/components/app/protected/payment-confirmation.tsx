"use client"


import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { CircleCheckIcon, CircleXIcon } from "lucide-react"
import { ConfirmPaymentPage } from "@/config/site"


const PaymentConfirmationPage = ({ status, message, messages }: {
  status: "success" | "failed"
  message?:  "somethingWentWrong" | "verificationFailed" | string
  messages : ConfirmPaymentPage
}) => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="flex items-center justify-center">
          {status === "success" ? (
            <CircleCheckIcon className="h-20 w-20 text-green-500" />
          ) : (
            <CircleXIcon className="h-20 w-20 text-red-500" />
          )}
        </div>
        {status === "failed" ? (
          <>
            <h1
              className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{messages.paymentFailed}</h1>
            <p className="mt-4 text-red-500">{
              message && (message === "somethingWentWrong" ||  message === "verificationFailed") ? messages[message] : messages.somethingWentWrong
            }</p>
          </>
        ) : (
          <>
            <h1
              className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{messages.paymentSucceeded}</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">{messages.paymentSuccessfullyMade}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentConfirmationPage
