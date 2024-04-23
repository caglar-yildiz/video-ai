import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

// To handle a GET request to /api
type ValidRequest = NextRequest & { body: { token: string } }

// To handle a POST request to /api
export async function POST(request: ValidRequest) {
  const body = await request.json()
  const token = body.token
  console.log(body)
  if (!token) {
    return NextResponse.json(
      { success: false, error: "No token provided" },
      { status: 400 }
    )
  }
  console.log(token)
  request.headers.set("Cookie", "authjs.session-token=" + token)

  try {
    // validate the token
    // const session = await getSession({ req: { headers: { cookie: `next-auth.session-token=${token}` } } });
    const session = await auth()
    if (!session) {
      throw new Error("Invalid token sad")
    }
    console.log(session.user)

    // return user info
    return NextResponse.json(
      {
        success: true,
        user: session.user,
      },
      { status: 200 }
    )
  } catch (error: any) {
    // handle error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 })
}
