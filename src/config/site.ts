import React from "react"
import { getDictionary } from "@/dictionaries"
import { Lang } from "@/i18n-config"
import { type NavItem, type NavItemFooter } from "@/types"


import DubbingIcon from "@/components/icons/dubbing"
import PeopleIcon from "@/components/icons/people"
import DashboardIcon from "@/components/icons/projects"

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
        title: dictionary?.siteConfig.footerItems.company.title,
        items: [
          {
            title: dictionary?.siteConfig.footerItems.company.about,
            href: "/about",
            external: false,
          },
           {
             title: dictionary?.siteConfig.footerItems.support.privacy,
             href: "/privacy",
             external: false,
           },
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
        title: dictionary?.siteConfig.footerItems.support.title,
        items: [
          {
            title: dictionary?.siteConfig.footerItems.support.faq,
            href: "/faq",
            external: false,
          },
        ],
      },
    ] satisfies NavItemFooter[],
    side_nav_items: [
      {
        title: dictionary?.sideNavItems.dashboard,
        href: "/dashboard",
        icon: React.createElement(DashboardIcon),
      },

      {
        title: dictionary?.sideNavItems.createDubbing,
        href: "/dashboard/dubbing",
        icon: React.createElement(DubbingIcon),
      },
      {
        title: dictionary?.sideNavItems.dubbing2,
        href: "/dashboard/dubbing2",
        icon: React.createElement(DubbingIcon),
      },
      {
        title: dictionary?.sideNavItems.myDubbings,
        href: "/dashboard/mydubbings",
        icon: React.createElement(DubbingIcon),
      },
      {
        title: dictionary?.sideNavItems.speech,
        href: "/dashboard/speech",
        icon: React.createElement(PeopleIcon),
        disabled: (() => {
          return process.env.NODE_ENV === "production"
        })(),
      },
    ] satisfies NavItem[],
    buttons: dictionary?.siteConfig.buttons,
    profile: dictionary?.profile,
    features :  dictionary?.features.map((feature,index) => {
      return {...feature, image: `/images/features/${index + 1}.jpg`}
    }),
    formMessages: dictionary?.formMessages,
    pages : dictionary?.pages,
  }
}

// return type of getSiteConfig
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type SiteConfig = ThenArg<ReturnType<typeof getSiteConfig>>

export type FormMessages = ThenArg<ReturnType<typeof getSiteConfig>>['formMessages'];

export type SiteMessages = ThenArg<ReturnType<typeof getSiteConfig>>['pages']['pricing']['messages'];

export type ButtonContents = ThenArg<ReturnType<typeof getSiteConfig>>['buttons'];

export type FrequentlyAskedQuestions = ThenArg<ReturnType<typeof getSiteConfig>>["pages"]["faqPage"]

export type NewsLetterMessages = ThenArg<ReturnType<typeof getSiteConfig>>["formMessages"]["newsletter"]

export type FeaturesSection = ThenArg<ReturnType<typeof getSiteConfig>>["pages"]

