"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { languages } from "@/i18n-config"

import { buttonVariants } from "@/components/ui/button"
import FlagIcon from "@/components/icons/flag-icon"

function getLanguageFromPath(url: string | null) {
  if (url) {
    let startIndex = url.indexOf("/") + 1
    return url.substring(startIndex, startIndex + 2)
  }
  return null
}

const LANGUAGE_SELECTOR_ID = "select button"

export function LanguageSelector() {
  const pathName = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  let lang = getLanguageFromPath(pathName)
  const langObj = languages.find((language) => language.key === lang)

  useEffect(() => {
    const handleWindowClick = (event: any) => {
      const target = event.target.closest("button")
      if (target && target.id === LANGUAGE_SELECTOR_ID) {
        return
      }
      setIsOpen(false)
    }
    window.addEventListener("click", handleWindowClick)
    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  }, [])

  function handleLangSelect(currentUrl: string, targetLang: string) {
    const currentLang = getLanguageFromPath(currentUrl)
    if (currentUrl && currentLang && targetLang) {
      if (targetLang === currentLang) {
        setIsOpen(false)
        return
      }
      currentUrl = currentUrl.replace(currentLang, targetLang)
      router.push(currentUrl)
    }
  }

  if (!langObj || !lang) return ""
  return (
    <div className="z-40 flex items-center">
      <div className="relative inline-block text-left">
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className={
              buttonVariants({ size: "sm", variant: "outline" }) +
              "inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs  font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            }
            id={LANGUAGE_SELECTOR_ID}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <FlagIcon countryCode={lang} />
            {langObj.name}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-selector"
          >
            <div className="grid gap-2 py-1" role="none">
              {languages.map((language, index) => {
                return (
                  <button
                    key={language.key}
                    onClick={() => handleLangSelect(pathName, language.key)}
                    className={`${
                      language.key === langObj.key
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } inline-flex items-center px-4 py-2 text-left text-sm hover:bg-gray-100 ${index % 2 === 0 ? "rounded-r" : "rounded-l"}`}
                    role="menuitem"
                  >
                    <FlagIcon countryCode={language.key} />
                    <span className="truncate">{language.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
