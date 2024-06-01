import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/db"
import { inviteSchema } from "@/validations/organizaion"
import { createUUID } from "@/providers/payment-provider"
import { z } from "zod"
import { auth } from "@/auth"


export async function POST(request: NextRequest) {

  try {
    const body = await request.json()
    const { email } = inviteSchema.parse(body);

    const authorizedUser = await checkAuthorizationOverOrganization()
    if(!authorizedUser) {
      return NextResponse.json({ error : "Unauthorized" }, { status: 401 })
    }

    if(!authorizedUser.organizationId) {
      return NextResponse.json({ error : "Organization not found" }, { status: 400 })
    }


    const token = createUUID()

    await prisma.invite.create({
      data: {
        email : email || "",
        organizationId :authorizedUser.organizationId,
        token
      }
    })

    console.log("invite token", token)

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invite/${token}`
    return NextResponse.json({ inviteLink }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error : error.errors }, { status: 400 })
    } else {
      console.error("error", error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}


export const checkAuthorizationOverOrganization = async () => {


  const session = await auth()

  return session?.user.email ? await prisma.user.findUnique({
    where : {
      email : session?.user.email,
      role :"ADMIN"
    }
  }) : undefined

}
