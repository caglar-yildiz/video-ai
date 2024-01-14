import { NextRequest } from "next/server"

export type Lang = "en" | "tr";
 
export const locales :Lang[] = ['en', "tr"]
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  // Get the preferred locale,
  // similar to the above or using a library
  const acceptLanguage = request.headers.get('Accept-Language')
  if (!acceptLanguage) return locales[0]
  const locale = acceptLanguage.split(',')[0]

  if (!locales.includes(locale as Lang)) return locales[0]
  return locale as Lang
}
 
export function middleware(request :NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  console.log(request.nextUrl.pathname)
  return Response.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|images).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}