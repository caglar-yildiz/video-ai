import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

import { i18n } from "./i18n-config"
import { getCookie, setCookie } from "cookies-next"
import { cookies } from "next/headers"
import { auth } from "@/auth"
import { prisma } from "@/db"

const locales = i18n.locales

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  )

  return matchLocale(languages, locales, i18n.defaultLocale)
}

export async function middleware(request: NextRequest) {

  const pathname = request.nextUrl.pathname
  const res = NextResponse.next();

  if (cookies().get('authjs.session-token')?.value){
    setCookie('X-AUTH-TOKEN', cookies().get('authjs.session-token')?.value, { res, req: request });
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getCookie("X-LOCALE", { req: request })
      ? getCookie("X-LOCALE", { req: request }) : getLocale(request)
    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${request.nextUrl.search || ""}`,
        request.url
      )
    )
  }

  const session = await auth()
  const locale = pathname.split('/')[1];

  if (!session &&  restrictedUrls.some(restrictedUrl => pathname.includes(restrictedUrl))) {
    return NextResponse.redirect(new URL(`/${locale}/signin?callbackUrl=` + encodeURIComponent(pathname), request.url));
  }
  setCookie("X-LOCALE", locale || i18n.defaultLocale, { res, req: request })
  return res
}

const restrictedUrls = ['/invite', '/dashboard', '/payment'];

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next|favicon.ico|images|videos|mp3).*)"],
}
