"use client"

import { useToast } from "@/components/ui/use-toast"
import * as React from "react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BillingInfo } from "@prisma/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UpdateBillingInfo, updateBillingInfoSchema } from "@/validations/billing"
import { updateBillingInfo } from "@/actions/user"
import { Icons } from "@/components/icons/icons"
import { allCountries } from "country-telephone-data"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { FormMessages } from "@/config/site"

const BillingInfoPage = ({ billingInfo, formMessages }:
                           {
                             billingInfo: BillingInfo | undefined | null ,
                              formMessages: FormMessages
                           }) => {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [editable, setEditable] = useState<boolean>(false)
  const [phone, setPhone] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<UpdateBillingInfo>({
    resolver: zodResolver(updateBillingInfoSchema),
    defaultValues: {
      firstName : billingInfo?.firstName || "",
      lastName : billingInfo?.lastName || "",
      email : billingInfo?.email || "",
      phoneNumber : billingInfo?.phoneNumber || "",
      billingAddress  : billingInfo?.billingAddress || "",
      billingCity : billingInfo?.billingCity || "",
      billingState : billingInfo?.billingState || "",
      billingPostalCode : billingInfo?.billingPostalCode || "",
      billingCountry  : billingInfo?.billingCountry || "",
    },
  })

  console.log(allCountries)

  useEffect(() => {
    if (!billingInfo) {
      setEditable(true)
    }
    setPhone(billingInfo?.phoneNumber || "")
  }, [])

  const onSubmit = (data: UpdateBillingInfo) => {
    startTransition(async () => {
      try {
        const result = await updateBillingInfo(data)
        if (result) {
          toast({
            title: formMessages.billingInfoPage.messages.billingInformationUpdated,
            description: formMessages.billingInfoPage.messages.yourBillingInformationHasBeenUpdated,
          })
          setEditable(false)
        }

      } catch (e) {
        toast({
          title: formMessages.billingInfoPage.messages.somethingWentWrong,
          description: formMessages.billingInfoPage.messages.pleaseTryAgain,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className={"text-xs gap-3"}>
      {!billingInfo &&
        <p className={"pb-4"}>{}</p>}
      <div className={"flex justify-end"}>
        {!editable && <Button className="ml-auto" onClick={() => setEditable(true)}>{formMessages.billingInfoPage.messages.edit}</Button>}
      </div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <div className="grid gap-1">
          <Label htmlFor="title">{formMessages.billingInfoPage.messages.title}</Label>

          <Input defaultValue={billingInfo?.title || ""} {...register("title")} disabled={!editable} id="title" />
          {errors.title && (
            <div className="text-xs text-red-600">
              {errors.title.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="phoneNumber">{formMessages.billingInfoPage.messages.phoneNumber}</Label>
          <Controller
            name="phoneNumber"
            control={control} // control from useForm()
            defaultValue={billingInfo?.phoneNumber || ""}
            render={({ field }) => (
              <PhoneInput
                disabled={!editable}
                defaultCountry="tr"
                value={field.value}
                className={"border border-gray-100 rounded-md p-2"}
                onChange={(phone) => field.onChange(phone)}
              />
            )}
          />
          {errors.phoneNumber && (
            <div className="text-xs text-red-600">
              {errors.phoneNumber.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="email">{formMessages.billingInfoPage.messages.email}</Label>
          <Input defaultValue={billingInfo?.email || ""} {...register("email")} disabled={!editable} id="email" />
          {errors.email && (
            <div className="text-xs text-red-600">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="first-name">{formMessages.billingInfoPage.messages.firstName}</Label>
          <Input defaultValue={billingInfo?.firstName || ""} {...register("firstName")} disabled={!editable}
                 id="first-name" />
          {errors.email && (
            <div className="text-xs text-red-600">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="last-name">{formMessages.billingInfoPage.messages.lastName}</Label>
          <Input defaultValue={billingInfo?.lastName || ""} {...register("lastName")} disabled={!editable}
                 id="last-name" />
          {errors.email && (
            <div className="text-xs text-red-600">
              {errors.email.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="country">{formMessages.billingInfoPage.messages.country}</Label>
          <Input defaultValue={billingInfo?.billingCountry || ""} {...register("billingCountry")} disabled={!editable}
                 id="country" />
          {errors.billingCountry && (
            <div className="text-xs text-red-600">
              {errors.billingCountry.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="city">{formMessages.billingInfoPage.messages.city}</Label>
          <Input defaultValue={billingInfo?.billingCity || ""} {...register("billingCity")} disabled={!editable}
                 id="city" />
          {errors.billingCity && (
            <div className="text-xs text-red-600">
              {errors.billingCity.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="state">{formMessages.billingInfoPage.messages.state}</Label>
          <Input defaultValue={billingInfo?.billingState || ""} {...register("billingState")} disabled={!editable}
                 id="state" />
          {errors.billingState && (
            <div className="text-xs text-red-600">
              {errors.billingState.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="address">{formMessages.billingInfoPage.messages.address}</Label>
          <Input defaultValue={billingInfo?.billingAddress || ""} {...register("billingAddress")} disabled={!editable}
                 id="address" />
          {errors.billingAddress && (
            <div className="text-xs text-red-600">
              {errors.billingAddress.message}
            </div>
          )}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="postal_code">{formMessages.billingInfoPage.messages.postalCode}</Label>
          <Input defaultValue={billingInfo?.billingPostalCode || ""} {...register("billingPostalCode")}
                 disabled={!editable} id="postal_code" />
          {errors.billingPostalCode && (
            <div className="text-xs text-red-600">
              {errors.billingPostalCode.message}
            </div>
          )}
        </div>
        <div className={"flex justify-end"}>
          <div>
            {editable &&
              (<>
                <Button disabled={isPending} className="ml-auto" type="submit">
                  {isPending ? (
                    <Icons.spinner className="size-2 animate-spin" aria-hidden="true" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button className="ml-auto" variant={"destructive"} onClick={() => setEditable(false)}>{formMessages.billingInfoPage.messages.cancel}</Button>
              </>)
            }
          </div>
        </div>
      </form>
    </div>
  )
}


export default BillingInfoPage
