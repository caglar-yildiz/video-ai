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
  type GetUserByResetPasswordTokenInput,
} from "@/validations/user"
import { type User } from "@prisma/client"

import { withValidation } from "@/lib/utils"

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
