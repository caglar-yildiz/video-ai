"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import LinkWrapper from "@/components/common/link-wrapper"
import { Lang } from "@/i18n-config"
import { useState } from "react"
import { Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


const InvitationDialog = ({
      adminName, organizationName, token, lang
    }: {
        adminName: string;
        organizationName: string;
        token : string;
        lang : Lang;
      }) => {

  const [joinState, setJoinState] = useState(false)
  const {toast} = useToast()

  const handleJoin = () => {
    // Replace this with your actual API call
    fetch('/api/organization/use-invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    })
      .then(response =>
        response.json().then(data => ({
          status: response.status,
          body: data
        }))
      )
      .then(data => {
        if (data.body.error) {
          toast({
            title: 'Error',
            description: data.body.error,
            variant: 'destructive',
          })
        } else if(data.status === 200){
          setJoinState(true)
        }
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: 'An error occurred. Please try again later.',
          variant: 'destructive',
        })
      });
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        className="max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        {joinState ? (
         <CardHeader>
           <CardTitle>
             You have successfully joined {organizationName}
           </CardTitle>
           <CardContent className={"flex justify-center"}>
             <Check className="w-8 h-8 text-green-500"/>
           </CardContent>
         </CardHeader>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Do You want to join {organizationName}</CardTitle>
              <CardDescription>
                {adminName} has invited you to join the platform
              </CardDescription>
            </CardHeader>
            <CardContent className={"flex justify-end"}>
              <Button
                className={buttonVariants()}
                onClick={handleJoin}
              >
                Join
              </Button>
              <LinkWrapper
                aria-label="Cancel"
                href="/dashboard"
                locale={lang}
                className={buttonVariants({ variant: "destructive" })}
              >
                <span className="sr-only">Go to Sign In page</span>
                Cancel
              </LinkWrapper>
            </CardContent>
          </>
          )}
      </Card>
    </div>
  )
}

export default InvitationDialog
