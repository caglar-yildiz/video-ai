


import "./globals.css";
import "flag-icons/css/flag-icons.min.css";



import { Viewport } from "next";
import { env } from "@/env.mjs";
import { Lang } from "@/i18n-config";
import { LangPageProps } from "@/types";



import { fontHeading, fontInter, fontUrbanist } from "@/config/fonts";
import { getSiteConfig } from "@/config/site";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";





// import CookieConsent, { Cookies }  from "react-cookie-consent"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}


export async function generateMetadata({ params : {lang} }: LangPageProps) {
  const siteConfig = await getSiteConfig(lang)

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: {
      // @ts-ignore
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
    },
    icons: {
      icon: "/favicon.ico",
    },
    // manifest: `${siteConfig.url}/site.webmanifest`,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden overflow-y-scroll">
      <body
        className={cn(
          "w-full font-sans antialiased",
          fontInter.variable,
          fontUrbanist.variable,
          fontHeading.variable
        )}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
        <SmoothScrollProvider>
          {children}
          <TailwindIndicator />
          <Toaster />
        </SmoothScrollProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}