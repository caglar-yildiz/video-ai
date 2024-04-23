"use server"

import crypto from "crypto"

import { AuthError } from "next-auth"
import { getUserByEmail, getUserByResetPasswordToken } from "@/actions/user"
import { signIn } from "@/auth"
import { prisma } from "@/db"
import { env } from "@/env.mjs"
import {
  linkOAuthAccountSchema,
  passwordResetSchema,
  passwordUpdateSchemaExtended,
  signInWithPasswordSchema,
  signUpWithPasswordSchema,
  type LinkOAuthAccountInput,
  type PasswordResetFormInput,
  type PasswordUpdateFormInputExtended,
  type SignInWithPasswordFormInput,
  type SignUpWithPasswordFormInput,
} from "@/validations/auth"
import bcryptjs from "bcryptjs"

import { resend } from "@/config/email"
import { withValidation } from "@/lib/utils"
import { EmailVerificationEmail } from "@/components/emails/email-verification-email"
import { ResetPasswordEmail } from "@/components/emails/reset-password-email"

async function signUpWithPasswordImpl(
  rawInput: SignUpWithPasswordFormInput
): Promise<"invalid-input" | "exists" | "error" | "success"> {
  try {
    const user = await getUserByEmail({ email: rawInput.email })
    if (user) return "exists"

    const passwordHash = await bcryptjs.hash(rawInput.password, 10)
    const emailVerificationToken = crypto.randomBytes(32).toString("base64url")

    const newUser = await prisma.user.create({
      data: {
        email: rawInput.email,
        passwordHash,
        emailVerificationToken,
      },
    })

    const emailSent = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: [rawInput.email],
      subject: "Verify your email address",
      react: EmailVerificationEmail({
        email: rawInput.email,
        emailVerificationToken,
      }),
    })

    return newUser && emailSent ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error signing up with password")
  }
}

async function signInWithPasswordImpl(
  rawInput: SignInWithPasswordFormInput
): Promise<
  | "invalid-input"
  | "invalid-credentials"
  | "not-registered"
  | "unverified-email"
  | "incorrect-provider"
  | "success"
> {
  try {
    const existingUser = await getUserByEmail({
      email: rawInput.email,
    })
    if (!existingUser) return "not-registered"

    if (!existingUser.email || !existingUser.passwordHash)
      return "incorrect-provider"

    if (!existingUser.emailVerified) return "unverified-email"

    await signIn("credentials", {
      email: rawInput.email,
      password: rawInput.password,
      redirect: true,
      redirectTo: "/dashboard",
    })

    return "success"
  } catch (error) {
    console.error(error)
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return "invalid-credentials"
      } else {
        throw error
      }
    } else {
      throw new Error("Error signing in with password")
    }
  }
}

async function resetPasswordImpl(
  rawInput: PasswordResetFormInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const user = await getUserByEmail({ email: rawInput.email })
    if (!user) return "not-found"

    const today = new Date()
    const resetPasswordToken = crypto.randomBytes(32).toString("base64url")
    const resetPasswordTokenExpiry = new Date(
      today.setDate(today.getDate() + 1)
    ) // 24 hours from now

    const userUpdated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpiry,
      },
    })

    const emailSent = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM,
      to: [rawInput.email],
      subject: "Reset your password",
      react: ResetPasswordEmail({
        email: rawInput.email,
        resetPasswordToken,
      }),
    })

    return userUpdated && emailSent ? "success" : "error"
  } catch (error) {
    console.error(error)
    return "error"
  }
}

async function updatePasswordImpl(
  rawInput: PasswordUpdateFormInputExtended
): Promise<"invalid-input" | "not-found" | "expired" | "error" | "success"> {
  try {
    if (rawInput.password !== rawInput.confirmPassword) return "invalid-input"

    const user = await getUserByResetPasswordToken({
      token: rawInput.resetPasswordToken,
    })
    if (!user) return "not-found"

    const resetPasswordExpiry = user.resetPasswordTokenExpiry
    if (!resetPasswordExpiry || resetPasswordExpiry < new Date())
      return "expired"

    const passwordHash = await bcryptjs.hash(rawInput.password, 10)

    const userUpdated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    })

    return userUpdated ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating password")
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

export const signUpWithPassword = withValidation(
  signUpWithPasswordSchema,
  signUpWithPasswordImpl
)
export const signInWithPassword = withValidation(
  signInWithPasswordSchema,
  signInWithPasswordImpl
)
export const resetPassword = withValidation(
  passwordResetSchema,
  resetPasswordImpl
)
export const updatePassword = withValidation(
  passwordUpdateSchemaExtended,
  updatePasswordImpl
)
export const linkOAuthAccount = withValidation(
  linkOAuthAccountSchema,
  linkOAuthAccountImpl
)
