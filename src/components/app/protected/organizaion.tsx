"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AddUserButton from "@/components/app/protected/diologs/add-user-diaog-button"
import OrganizationUserList from "@/components/app/protected/datatable/user-list"
import { Button } from "@/components/ui/button"
import * as React from "react"
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Organization } from "@prisma/client"
import { useState } from "react"
import CreateUpdateOrganizationPage from "@/components/app/protected/forms/create-update-organization"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Icons } from "@/components/icons/icons"
import { DeleteOrganizationResponse } from "@/app/api/organization/route"
import { useToast } from "@/components/ui/use-toast"
import { FormMessages } from "@/config/site"

const OrganizationPage = ({ organization, isAdmin , formMessages }: {
  organization: Organization | undefined | null;
  isAdmin: boolean
  formMessages: FormMessages
}) => {
  const [showCreateOrganization, setShowCreateOrganization] = useState(false)
  const [isPending, startTransition] = React.useTransition()
  const { toast } = useToast()

  const handleCancel = () => {
    setShowCreateOrganization(false)
  }

  const handleOrganizationDelete = () => {
    startTransition(async () => {
      try {
        const result = await fetch("/api/organization", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: organization?.id }),
        })
        if (result.ok) {
          const data : DeleteOrganizationResponse = await result.json()
          toast({
            title: formMessages.organizationPage.messages.organization,
            description: data.message,
          })
           window.location.reload()
        }else {
          const data : DeleteOrganizationResponse = await result.json()
          toast({
            title: formMessages.organizationPage.messages.organization,
            description: data.error,
            variant: "destructive",
          })
        }
      } catch (e) {
        console.error(e)
      }
    })
  }


  return (
    <div className="grid gap-4">
      {isAdmin && organization && (
        <Card>
          <CardHeader>
            <CardTitle>{organization.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <p>{formMessages.organizationPage.messages.members}</p>
                <AddUserButton />
              </div>
              {isAdmin && <OrganizationUserList />}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setShowCreateOrganization(true)}>{formMessages.organizationPage.messages.manageOrganization}</Button>
          </CardFooter>
        </Card>
      )}
      {!isAdmin &&
        (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{formMessages.organizationPage.messages.joinOrCreateOrganization}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {formMessages.organizationPage.messages.joinOrganization}
                </p>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>{formMessages.organizationPage.messages.joinOrganization}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {formMessages.organizationPage.messages.cannotJoinWithoutInvitation}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {formMessages.organizationPage.messages.askForInvitation}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{formMessages.organizationPage.messages.cancel}</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button className="ml-auto" onClick={() => setShowCreateOrganization(true)}>
                  {formMessages.organizationPage.messages.createOrganization}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      <div>
        <Separator className={"mb-2"} />
        {showCreateOrganization && <CreateUpdateOrganizationPage organization={organization} onCancel={handleCancel} />}
        {showCreateOrganization && organization && (
          <Alert className={"mt-6 flex justify-between items-center"} variant="destructive">
            <div><AlertCircle className="h-4 w-4" />
              <AlertTitle>{formMessages.organizationPage.messages.caution}</AlertTitle>
              <AlertDescription>
                {formMessages.organizationPage.messages.deleteCaution}
              </AlertDescription>
            </div>
            <Button disabled={isPending} variant="outline" className="ml-4 justify-end" onClick={handleOrganizationDelete}>
              {isPending ? (
                <Icons.spinner className="size-2 animate-spin" aria-hidden="true" />
              ) : (
                formMessages.organizationPage.messages.delete
              )}
            </Button>
          </Alert>
        )
        }
      </div>
    </div>
  )
}

export default OrganizationPage
