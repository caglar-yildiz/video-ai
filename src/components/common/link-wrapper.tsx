import React, { ReactNode } from "react"
import Link, { LinkProps } from "next/link"
import { Lang } from "@/i18n-config"

interface LinkWrapperProps extends LinkProps {
  locale: Lang
  children?: ReactNode
  target?: string
  rel?: string
  as?: string
  className?: string
}

const LinkWrapper = ({ locale, children, ...props }: LinkWrapperProps) => {
  props.href = `/${locale}${props.href}`
  return <Link {...props}> {children} </Link>
}

export default LinkWrapper
