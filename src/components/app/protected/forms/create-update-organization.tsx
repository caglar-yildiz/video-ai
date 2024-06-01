"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons/icons"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import {  useToast } from "@/components/ui/use-toast"
import { CreateOrganization, createOrganizationSchema } from "@/validations/organizaion"
import { Organization } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"



const CreateUpdateOrganizationPage = (
  { organization,  onCancel }:
    { organization: Organization |undefined | null ;
      onCancel: () => void }) => {

  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [editable, setEditable] = useState<boolean>(true)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrganization>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues : {
      email : organization?.email || "",
      name : organization?.name || ""
    }
  })

  const onSubmit =  (data : CreateOrganization) => {
    startTransition( async () => {
      try {
        const result = await fetch("/api/organization", {
          method: organization ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if (!result.ok) {
          const data = await result.json()
          toast({
            title: "Organization",
            description: data.error,
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Organization",
          description: "Organization has been created",
        })
        setEditable(false)
        window.location.reload();
      } catch (e) {
        toast({
          title: "Something went wrong",
          description: "Please try again",
          variant: "destructive",
        })
      }
    } )
  };

  return (
    <Card>
      <CardContent className={"mt-2"}>
        <div className="grid gap-4">
          <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input  {...register("email")} disabled={!editable} id="email" />
              {errors.email && (
                <div className="text-xs text-red-600">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input  {...register("name")} disabled={!editable} id="email" />
              {errors.name && (
                <div className="text-xs text-red-600">
                  {errors.name.message}
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
                    <Button className="ml-auto" variant={"destructive"} onClick={onCancel}>Cancel</Button>
                  </>)
                }
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}


export default CreateUpdateOrganizationPage
