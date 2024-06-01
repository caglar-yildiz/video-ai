import * as React from "react"

import styles from "@/components/common/LanguageSelector.module.css"

interface FlagIconProps {
  countryCode: string
}

function FlagIcon({ countryCode = "" }: Readonly<FlagIconProps>) {
  if (countryCode === "en") {
    countryCode = "gb"
  }

  return (
    <span
      className={`fi fis ${styles.fiCircle} mr-2 inline-block fi-${countryCode}`}
    />
  )
}

export default FlagIcon
