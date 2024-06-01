import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/db"

export async function GET(request: NextRequest) {
  // @ts-ignore
  const countryCode = request.nextUrl.searchParams.get("countryCode")
  if (!countryCode){
    return NextResponse.json({ message: "Country Code is mandatory" }, { status: 400 })
  }
  const subs = await prisma.subscription.findMany({
    where : {
      country : {
        code : {
          equals : countryCode
        }
      }
    }
  })
  return NextResponse.json({ subs }, { status: 200 })
}
