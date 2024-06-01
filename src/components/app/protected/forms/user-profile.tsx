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


const UserProfile = ({ user }: { user: User }) => {
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
            title: "Profile update",
            description: "Your information has been updated",
          })
          setEditable(false)
        }

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
    <>
      <div className={"flex justify-end"}>
        {!editable && <Button className="ml-auto" onClick={() => setEditable(true)}>Edit</Button>}
      </div>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input defaultValue={user?.email || ''} disabled={true} id="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Name</Label>
          <Input defaultValue={user?.name || ''} {...register("name")} disabled={!editable} id="email" />
          {errors.name && (
            <div className="text-xs text-red-600">
              {errors.name.message}
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Surname</Label>
          <Input defaultValue={user?.surname || ''} {...register("lastName")} disabled={!editable} id="email" />
          {errors.lastName && (
            <div className="text-xs text-red-600">
              {errors.lastName.message}
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">User Name</Label>
          <Input defaultValue={user?.username || ''} {...register("userName")} disabled={!editable} id="email" />
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
                <Button className="ml-auto" variant={"destructive"} onClick={() => setEditable(false)}>Cancel</Button>
              </>)
            }
          </div>
        </div>
      </form>

    </>
  )
}

export default UserProfile
