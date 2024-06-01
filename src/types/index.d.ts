import { PropsWithChildren } from "react"
import * as React from "react"
import type { Account, Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { Lang } from "@/i18n-config"

export type LangPageProps = {
  params: {
    lang: Lang
  }
}

export interface AISound {
  key: string
  name: string
  title: string
  imageURL: string
  url: string
  lang: string
}

export interface NavItem {
  title: string
  href: string
  icon?: FunctionComponentElement<Props>
  disabled?: boolean
  children?: NavItem[]
  description?: string
}

export interface NavItemFooter {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export interface SessionCallbackParams {
  session: Session
  token: JWT
  user: User
}

export interface JWTCallbackParams {
  token: JWT
  user?: User | undefined
  account?: Account | null | undefined
  profile?: Profile | undefined
  isNewUser?: boolean | undefined
}

export interface BlogPostParamsProps {
  params: {
    slug: string[]
  }
}

export interface PricingPlan {
  id: "basic" | "standard" | "premium" | "enterprise"
  name: string
  description: string
  features: string[]
  limitations: string[]
  stripePriceId: string
  prices: {
    monthly: number
    yearly: number
  }
  stripeIds: {
    monthly?: string
    yearly?: string
  }
  getPricing: string
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeSubscriptionId?: string | null
  stripeCurrentPeriodEnd?: string | null
  stripeCustomerId?: string | null
  isSubscribed: boolean
  isCanceled: boolean
  isActive: boolean
}

export interface FrequentlyAskedQuestion {
  question: string
  answer: string
}

export interface Feature {
  title: string
  description: string
  image: string
}

export interface Testimonial {
  title: string
  body: string
  name: string
  role: string
  avatar: string
}

type ComponentWithLocaleType<T = {}> = (
  props: PropsWithChildren<T & { locale: Lang }>
) => React.ReactElement | Promise<React.ReactElement> | null
