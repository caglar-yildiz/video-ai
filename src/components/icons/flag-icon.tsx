import styles from "@/components/common/LanguageSelector.module.css"
import * as React from "react"

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
