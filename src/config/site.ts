import React from "react"
import { getDictionary } from "@/dictionaries"
import { Lang } from "@/i18n-config"
import { type NavItem, type NavItemFooter } from "@/types"


import DubbingIcon from "@/components/icons/dubbing"
import PeopleIcon from "@/components/icons/people"
import DashboardIcon from "@/components/icons/projects"
import { CoinsIcon } from "lucide-react"

export const getSiteConfig = async (lang: Lang) => {

  const dictionary = await getDictionary(lang)
  return {
    name: dictionary?.siteConfig.name,
    description: dictionary?.siteConfig.description,
    url: "https://dubbing-ai.vercel.app/",
    keywords: dictionary?.siteConfig.keywords,
    navItemsMobile: [],
    navItemsFooter: [
      {
        title: "Company",
        items: [
          {
            title: "About",
            href: "/about",
            external: false,
          },
          // {
          //   title: "Privacy",
          //   href: "/privacy",
          //   external: false,
          // },
          // {
          //   title: "Terms",
          //   href: "/tos",
          //   external: false,
          // },
          // {
          //   title: "Careers",
          //   href: "/careers",
          //   external: false,
          // },
        ],
      },
      {
        title: "Support",
        items: [
          {
            title: "FAQ",
            href: "/faq",
            external: false,
          },
          {
            title: "API Reference",
            href: "/api",
            external: false,
          },
          {
            title: "Guides",
            href: "/guides",
            external: false,
          },
        ],
      },
    ] satisfies NavItemFooter[],
    side_nav_items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: React.createElement(DashboardIcon),
      },

      {
        title: "Create Dubbing",
        href: "/dashboard/dubbing",
        icon: React.createElement(DubbingIcon),
      },
      {
        title: "Dubbing2",
        href: "/dashboard/dubbing2",
        icon: React.createElement(DubbingIcon),
      },
      {
        title: "My Dubbings",
        href: "/dashboard/mydubbings",
        icon: React.createElement(DubbingIcon),
      },
      {
        title: "Speech (Upcoming)",
        href: "/dashboard/speech",
        icon: React.createElement(PeopleIcon),
        disabled: (() => {
          return process.env.NODE_ENV === "production"
        })(),
      },
      {
        title: "Credits",
        href: "/dashboard/credit",
        icon: React.createElement(CoinsIcon),
        disabled: (() => {
          return process.env.NODE_ENV === "production"
        })(),
      },
    ] satisfies NavItem[],
    buttons: dictionary?.siteConfig.buttons,
    features :  dictionary?.features.map((feature,index) => {
      return {...feature, image: `/images/features/${index + 1}.jpg`}
    }),
    messages :{
      0 : dictionary?.messages[0] + "",
      1 : dictionary?.messages[1] + "",
      2 : dictionary?.messages[2] + "",
      3 : dictionary?.messages[3] + "",
      4 : dictionary?.messages[4] + "",
      5 : dictionary?.messages[5] + "",
      6 : dictionary?.messages[6] + "",
      7 : dictionary?.messages[7] + "",
      8 : dictionary?.messages[8] + "",
      9 : dictionary?.messages[9] + "",
      10 : dictionary?.messages[10] + "",
      11 : dictionary?.messages[11] + "",
      12 : dictionary?.messages[12] + "",
      13 : dictionary?.messages[13] + "",
      14 : dictionary?.messages[14] + "",
      15 : dictionary?.messages[15] + "",
      16 : dictionary?.messages[16] + "",
      17 : dictionary?.messages[17] + "",
      18 : dictionary?.messages[18] + "",
      19 : dictionary?.messages[19] + "",
      20 : dictionary?.messages[20] + "",
      21 : dictionary?.messages[21] + "",
    },
    formMessages: dictionary?.formMessages,
    pages : dictionary?.pages,
    frequentlyAskedQuestions: dictionary?.frequentlyAskedQuestions,
  }
}

// return type of getSiteConfig
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type SiteConfig = ThenArg<ReturnType<typeof getSiteConfig>>

export type FormMessages = ThenArg<ReturnType<typeof getSiteConfig>>['formMessages'];

export type SiteMessages = ThenArg<ReturnType<typeof getSiteConfig>>['pages']['pricing']['messages'];

export type ButtonContents = ThenArg<ReturnType<typeof getSiteConfig>>['buttons'];
