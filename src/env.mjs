import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string(),
    AUTH_SECRET: z.string(),
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    RESEND_EMAIL_FROM: z.string().email(),
    RESEND_EMAIL_TO: z.string().email(),
    RESEND_HOST: z.string(),
    RESEND_USERNAME: z.string(),
    RESEND_PORT: z.string(),
    PARAMPOS_CLIENT_CODE: z.string(),
    PARAMPOS_CLIENT_USERNAME: z.string(),
    PARAMPOS_CLIENT_PASSWORD: z.string(),
    PARAMPOS_MODE: z.string(),
    PARAMPOS_GUID: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side, so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    RESEND_EMAIL_TO: process.env.RESEND_EMAIL_TO,
    RESEND_HOST: process.env.RESEND_HOST,
    RESEND_USERNAME: process.env.RESEND_USERNAME,
    RESEND_PORT: process.env.RESEND_PORT,
    PARAMPOS_CLIENT_CODE: process.env.PARAMPOS_CLIENT_CODE,
    PARAMPOS_CLIENT_USERNAME: process.env.PARAMPOS_CLIENT_USERNAME,
    PARAMPOS_CLIENT_PASSWORD: process.env.PARAMPOS_CLIENT_PASSWORD,
    PARAMPOS_MODE: process.env.PARAMPOS_MODE,
    PARAMPOS_GUID: process.env.PARAMPOS_GUID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
