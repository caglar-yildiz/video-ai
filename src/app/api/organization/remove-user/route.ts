import { NextRequest, NextResponse } from "next/server"
import { removeUserSchema } from "@/validations/organizaion"
import { checkAuthorizationOverOrganization } from "@/app/api/organization/invite/route"
import { prisma } from "@/db"
import { z } from "zod"

export async function POST(request: NextRequest) {

  const body = await request.json()
  const { userId } = removeUserSchema.parse(body);

  const authorizedUser = await checkAuthorizationOverOrganization()
  if(!authorizedUser) {
    return NextResponse.json({ error : "Unauthorized" }, { status: 401 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where : {
        id : userId,
        organizationId : authorizedUser.organizationId
      },
      data : {
        organizationId : null
      }
    })
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    return NextResponse.json({ message: 'User removed' }, { status: 200 })
  }catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error : error.errors[0]?.message }, { status: 400 })
    } else {
      console.error("error", error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}


export type RemoveUserResponse = {
  message?: string;
  error?: "Unauthorized" | "User not found" | "Internal Server Error" | string;
};
