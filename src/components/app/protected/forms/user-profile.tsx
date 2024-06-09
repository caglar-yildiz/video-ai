"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { UpdateUserInfo, updateUserInfoSchema } from "@/validations/user"
import { User } from "@prisma/client"
import { useState } from "react"
import { Icons } from "@/components/icons/icons"
import { updateUserInfo } from "@/actions/user"
import { FormMessages } from "@/config/site"


const UserProfile = ({ user , formMessages } :
                       {
                         user: User
                         formMessages : FormMessages
                       }) => {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()
  const [editable, setEditable] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInfo>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues : {
      name: user.name || '',
      lastName: user.surname || '',
      userName: user.username || ''
    }
  })

  const onSubmit =  (data : UpdateUserInfo) => {
    console.log(data)
    startTransition( async () => {
      try {
        const result = await updateUserInfo(data)
        if (result) {
          toast({
            title: formMessages.userProfile.messages.profileUpdate,
            description: formMessages.userProfile.messages.yourInformationHasBeenUpdated,
          })
          setEditable(false)
        }

      } catch (e) {
        toast({
          title: formMessages.userProfile.messages.somethingWentWrong,
          description: formMessages.userProfile.messages.pleaseTryAgain,
          variant: "destructive",
        })
      }
    } )
  };

  return (
    <>
      <div className={"flex justify-end"}>
        {!editable && <Button className="ml-auto" onClick={() => setEditable(true)}>{formMessages.userProfile.messages.edit}</Button>}
      </div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <div className="grid gap-2">
          <Label htmlFor="email">{formMessages.userProfile.messages.email}</Label>
          <Input defaultValue={user?.email || ''} disabled={true} id="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">{formMessages.userProfile.messages.name}</Label>
          <Input defaultValue={user?.name || ''} {...register("name")} disabled={!editable} id="email" />
          {errors.name && (
            <div className="text-xs text-red-600">
              {errors.name.message}
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="surname">{formMessages.userProfile.messages.surname}</Label>
          <Input defaultValue={user?.surname || ''} {...register("lastName")} disabled={!editable} id="surname" />
          {errors.lastName && (
            <div className="text-xs text-red-600">
              {errors.lastName.message}
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="user-name">{formMessages.userProfile.messages.userName}</Label>
          <Input defaultValue={user?.username || ''} {...register("userName")} disabled={!editable} id="user-name" />
          {errors.userName && (
            <div className="text-xs text-red-600">
              {errors.userName.message}
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
                <Button className="ml-auto" variant={"destructive"} onClick={() => setEditable(false)}>{formMessages.userProfile.messages.save}</Button>
              </>)
            }
          </div>
        </div>
      </form>

    </>
  )
}

export default UserProfile
