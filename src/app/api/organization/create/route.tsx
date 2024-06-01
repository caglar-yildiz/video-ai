import { NextRequest, NextResponse } from "next/server"
import { createOrganizationSchema } from "@/validations/organizaion"
import { auth } from "@/auth"
import { prisma } from "@/db"
import { z } from "zod"
import { checkAuthorizationOverOrganization } from "@/app/api/organization/invite/route"

/**
 * POST method for creating an organization.
 *
 * @async
 * @function POST
 * @param {NextRequest} request - The incoming request object provided by Next.js.
 * @returns {Promise<NextResponse>} The response object.
 *
 * @throws {Error} Will throw an error if the user is unauthorized.
 * @throws {Error} Will throw an error if the user already belongs to an organization.
 * @throws {Error} Will throw an error if there is an issue creating the organization.
 *
 * @description
 * This method is responsible for creating a new organization. It first validates the request body
 * using the `createOrganizationSchema`. Then, it checks if the user is authenticated and does not
 * belong to any other organization. If the user is authenticated and does not belong to an
 * organization, it creates a new organization and assigns the user as an admin of the newly created
 * organization. If the organization is successfully created, it returns the organization data in
 * the response.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {

  try {
    const body = await request.json()
    const { name, email } = createOrganizationSchema.parse(body)

    const session = await auth()
    const user = session?.user.email ? await prisma.user.findUnique({
      where: {
        email: session?.user.email,
      },
    }) : undefined

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user && user.organizationId) {
      return NextResponse.json({
          error: "User already has an organization or belong to one. After you exit or delete organization, you can create one",
        },
        { status: 400 })
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        email
      },
    })
    if (!organization) {
      return NextResponse.json({ error: "Error while creating organization" }, { status: 500 })
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        organizationId: organization.id,
        role: "ADMIN",
      },
    })

    return NextResponse.json(organization, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
  }
}


export async function DELETE (request: NextRequest): Promise<NextResponse> {
  try {
    const user = await checkAuthorizationOverOrganization()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user.organizationId) {
      return NextResponse.json({ error: "User does not belong to any organization" }, { status: 400 })
    }

    await prisma.user.updateMany({
      where: {
        organizationId: user.organizationId,
        role: "USER",
      },
      data: {
        organizationId: null,
      },
    })
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        organizationId: null,
        role: "USER",
      },
    })
    await prisma.organization.delete({
      where: {
        id: user.organizationId,
      },
    })

    return NextResponse.json({ message: "Organization deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export type PostOrganizationResponse = {
  message?: string;
  organization?: {
    id: string;
    name: string;
    email: string;
  };
  error?: "Unauthorized" | "User already has an organization or belong to one. After you exit or delete organization, you can create one" | string;
};

export type DeleteOrganizationResponse = {
  success?: boolean;
  message?: string;
  status?: number;
  error?: "Unauthorized" | "User does not belong to any organization" | "Internal Server Error" | string;
};
