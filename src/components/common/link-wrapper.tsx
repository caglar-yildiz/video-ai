import { Lang } from "@/i18n-config"
import Link, { LinkProps } from "next/link"
import React, { ReactNode } from "react"


interface LinkWrapperProps extends LinkProps {
  locale: Lang;
  children?: ReactNode;
  target?: string;
  rel?: string;
  as?: string;
  className?: string;
}

const LinkWrapper = ({locale,children , ...props}: LinkWrapperProps) => {
  props.href = `/${locale}${props.href}`
  return <Link { ...props}> {children} </Link>
}

export default LinkWrapper
