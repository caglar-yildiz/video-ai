"use client"
import { useState } from 'react'
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const AddUserButton = () => {
  const [token, setToken] = useState('')
  const { toast } = useToast()

  const fetchToken = () => {
    // Replace this with your actual API call
    fetch('/api/organization/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the response data
        setToken(data.inviteLink);
      })
      .catch((error) => {
        toast({
          title: "Something went wrong",
          description: "Please try again",
          variant: "destructive",
        })
      });
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(token)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={fetchToken}>Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={token}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default AddUserButton
