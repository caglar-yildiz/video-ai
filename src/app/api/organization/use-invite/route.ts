import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/db"
import { useInviteSchema } from "@/validations/organizaion"
import { z } from "zod"
import { auth } from "@/auth"


export async function POST(request: NextRequest) {

  try {
    const body = await request.json()
    const { token } = useInviteSchema.parse(body);
    const session = await auth()

    const inviteLink = await prisma.invite.findUnique({
      where: {
        token,
        used : false
      },
      include: {
        organization: true,
      }
    })
    if (!inviteLink) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 400 })
    }

    const user =session?.user.email ?  await prisma.user.update({
      where: {
        email: session?.user.email,
      },
      data : {
        organizationId : inviteLink.organization.id
      }
    }) : undefined

    if(!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
     await prisma.invite.update({
      where: {
        token,
      },
      data: {
        used: true,
      },
    })

    return NextResponse.json({ message: 'Invite used' }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error : error.errors }, { status: 400 })
    } else {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}

export type UseInviteResponse = {
  message?: string;
  error?: "Invalid Token" | "User not found" | "Internal Server Error" | string;
};
