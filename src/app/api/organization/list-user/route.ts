import { NextRequest, NextResponse } from "next/server"
import { checkAuthorizationOverOrganization } from "@/app/api/organization/invite/route"
import { prisma } from "@/db"


export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const count = parseInt(request.nextUrl.searchParams.get("count") || "10")

  const authorizedUser = await checkAuthorizationOverOrganization()
  if(!authorizedUser) {
    return NextResponse.json({ error : "Unauthorized" }, { status: 401 })
  }

  const skip = (page - 1) * count

  const userList = await prisma.user.findMany({
    where : {
      organizationId : authorizedUser.organizationId,
      role : "USER"
    },
    skip: skip,
    take: count,
    select: {
      email: true,
      name: true,
      image: true,
      id : true
    }
  })

  return NextResponse.json(
    {
      page: page,
      perPage: count,
      userList: userList
    }
    , { status: 200 })
}

export interface UserListResponse {
  page?: number;
  perPage?: number;
  userList?: UserListUserType[];
  error?: "Unauthorized" | string;
}

export type UserListUserType = {
  email: string;
  name: string;
  image: string;
  id: string;
};
