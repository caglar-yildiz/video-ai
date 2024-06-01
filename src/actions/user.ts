"use server"

import { prisma } from "@/db"
import {
  getUserByEmailSchema,
  getUserByEmailVerificationTokenSchema,
  getUserByIdSchema,
  getUserByResetPasswordTokenSchema,
  type GetUserByEmailInput,
  type GetUserByEmailVerificationTokenInput,
  type GetUserByIdInput,
  type GetUserByResetPasswordTokenInput, UpdateUserInfo, updateUserInfoSchema,
} from "@/validations/user"
import { type User } from "@prisma/client"

import { withValidation } from "@/lib/utils"
import { auth } from "@/auth"
import { UpdateBillingInfo, updateBillingInfoSchema } from "@/validations/billing"
import { LinkOAuthAccountInput, linkOAuthAccountSchema } from "@/validations/auth"

async function saveUserInfoImpl(
  rawInput : UpdateUserInfo
): Promise<boolean>{

  const session = await auth()
  const user = session?.user && session?.user.email ? await prisma.user.findUnique({
    where : {
      email : session?.user.email
    }
  }) : undefined

  if (!user || !user.email) {
    throw new Error('You must be signed in to perform this action')
  }

  const result = await prisma.user.update({
    data : {
      username : rawInput.userName,
      name : rawInput.name,
      surname : rawInput.lastName,
    },
    where : {
      email : user.email
    }
  })

  return !!result;

}

async function updateBillingInfoImpl (
  rawInput : UpdateBillingInfo
) :Promise<boolean>{
  const session = await auth()
  const user = session?.user && session?.user.email ? await prisma.user.findUnique({
    where : {
      email : session?.user.email
    }
  }) : undefined


  if (!user) {
    throw new Error('You must be signed in to perform this action')
  }


  // Query for the user's billing info
  let billingInfo = await prisma.billingInfo.findUnique({
    where: { userId: user.id },
  })
  let result = undefined
  if (billingInfo) {
    // If billingInfo exists, update it
    result = await prisma.billingInfo.update({
      where: { id: billingInfo.id },
      data: rawInput // Use rawInput to update data
    })
  } else {
    // If billingInfo doesn't exist, create it
    result = await prisma.billingInfo.create({
      data: {
        ...rawInput, // Use rawInput to create data
        userId: user.id, // Connect this billingInfo to the user
      }
    })
  }

  return !!result
}

async function getUserByIdImpl(
  rawInput: GetUserByIdInput
): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        id: rawInput.id,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by Id")
  }
}

async function getUserByEmailImpl(
  rawInput: GetUserByEmailInput
): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        email: rawInput.email,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by email")
  }
}

async function getUserByResetPasswordTokenImpl(
  rawInput: GetUserByResetPasswordTokenInput
): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        resetPasswordToken: rawInput.token,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by reset password token")
  }
}

async function getUserByEmailVerificationTokenImpl(
  rawInput: GetUserByEmailVerificationTokenInput
): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        emailVerificationToken: rawInput.token,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Error getting user by email verification token")
  }
}

async function linkOAuthAccountImpl(
  rawInput: LinkOAuthAccountInput
): Promise<void> {
  try {
    await prisma.user.update({
      where: {
        id: rawInput.userId,
      },
      data: {
        emailVerified: new Date(),
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Error linking OAuth account")
  }
}

export const linkOAuthAccount = withValidation(
  linkOAuthAccountSchema,
  linkOAuthAccountImpl
)

export const getUserById = withValidation(getUserByIdSchema, getUserByIdImpl)
export const getUserByEmail = withValidation(
  getUserByEmailSchema,
  getUserByEmailImpl
)
export const getUserByResetPasswordToken = withValidation(
  getUserByEmailVerificationTokenSchema,
  getUserByResetPasswordTokenImpl
)
export const getUserByEmailVerificationToken = withValidation(
  getUserByResetPasswordTokenSchema,
  getUserByEmailVerificationTokenImpl
)

export const updateUserInfo = withValidation(
  updateUserInfoSchema,
  saveUserInfoImpl
)


export const updateBillingInfo = withValidation(
  updateBillingInfoSchema,
  updateBillingInfoImpl
)
