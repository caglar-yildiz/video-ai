import React from "react"
import { getDictionary } from "@/dictionaries"
import { Lang } from "@/i18n-config"
import { type NavItem, type NavItemFooter } from "@/types"

import DubbingIcon from "@/components/icons/dubbing"
import PeopleIcon from "@/components/icons/people"
import DashboardIcon from "@/components/icons/projects"

export const getSiteConfig = async (lang: Lang) => {
  console.log(lang)
  const dictionary = await getDictionary(lang)
  return {
    name: dictionary?.siteConfig.name,
    description: dictionary?.siteConfig.description,
    url: "https://dubbing-ai.vercel.app/",
    keywords: dictionary?.siteConfig.keywords,
    navItems: [
      {
        title : dictionary.siteConfig?.navItems.title.dubbing + "",
        href : "/dubbing",
        description : "Video generation with voice"
      },
      {
        title : dictionary.siteConfig?.navItems.title.speech + "",
        href : "/speech",
        description : "Upcoming feature"
      },
      /*{
        title : dictionary.siteConfig?.navItems.title.products + "",
        href : "/products",
        children : [
          {
            title : dictionary.siteConfig?.navItems.title.dubbing + "",
            href : "/dubbing",
            description : "Video generation with voice"
          },
          {
            title : dictionary.siteConfig?.navItems.title.speech + "",
            href : "/speech",
            description : "Upcoming feature"
          },
        ]
      },*/
/*      {
        title: dictionary?.siteConfig?.navItems.title.pricing + "",
        href: "/pricing",
      },*/
      {
        title: dictionary?.siteConfig?.navItems.title.faq + "",
        href: "/faq",
      },
/*      {
        title: dictionary?.siteConfig?.navItems.title.about + "",
        href: "/about",
      },*/
      // {
      //   title: dictionary?.siteConfig?.navItems.title.blog + "",
      //   href: "/blog",
      // },
    ] satisfies NavItem[],
    navItemsMobile: [],
    navItemsFooter: [
      {
        title: "Company",
        items: [
          {
            title: "Speech",
            href: "/speech",
            external: false,
          },
           {
             title: "Dubbing",
             href: "/dubbing",
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
        title: "Support",
        items: [
          {
            title: "FAQ",
            href: "/faq",
            external: false,
          },
          /*{
            title: "API Reference",
            href: "/api",
            external: false,
          },
          {
            title: "Guides",
            href: "/guides",
            external: false,
          },*/
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
        title: "Dubbing",
        href: "/dashboard/dubbing",
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
    ] satisfies NavItem[],
    buttons : {
      goToDashboard : dictionary?.siteConfig.buttons.gotoDashboard,
      /*getStarted : dictionary.siteConfig.buttons.getStarted*/
    },
 /*   landing : {
      about : {
        why : dictionary.siteConfig.about.whyQuestion,
        answerOne : dictionary.siteConfig.about.answerOne,
        answerTwo : dictionary.siteConfig.about.answerTwo
        },
      dubbing : {},
      faq : {},
      pricing : {},
      speech : {}
      }*/
    }
  }


// return type of getSiteConfig
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type SiteConfig = ThenArg<ReturnType<typeof getSiteConfig>>
