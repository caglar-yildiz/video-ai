import { env } from "@/env.mjs"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as z from "zod"
import { getCookie } from "cookies-next"
import { getToken } from "@auth/core/jwt"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function withValidation<T, U>(
  schema: z.ZodType<T>,
  fn: (validatedInput: T) => Promise<U | null>
) {
  return async (rawInput: T): Promise<U | null> => {
    const validatedInput = schema.safeParse(rawInput)
    if (!validatedInput.success) return null

    return await fn(validatedInput.data)
  }
}

export function convertToTime(number: any) {
  let hours = Math.floor(number / 3600)
  let minutes = Math.floor((number % 3600) / 60)
  let seconds = number % 60

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function checkFileType(file: File | undefined) {
  if (file?.name) {
    const fileType = file.name.split(".").pop()
    if (fileType === "mp3" || fileType === "mp4") {
      return true
    }
  }
  return false
}

export const customFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  // Set your custom headers here
  const authToken = getCookie('X-AUTH-TOKEN')?.toString()
  const headers :[string, string][] | Record<string, string> | Headers | undefined = {
    ...init?.headers,
    'X-AUTH-TOKEN': authToken ? authToken :  "",
  };

  // Make the fetch request with the updated headers
  return fetch(input, { ...init, headers });
}
