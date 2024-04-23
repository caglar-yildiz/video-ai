export type Lang = "en" /*| "tr" | "de"*/

interface Language {
  key: Lang
  name: string
}

export const languages: Language[] = [
  {
    key: "en",
    name: "English",
  },
/*  {
    key: "tr",
    name: "Türkçe",
  },
  {
    key: "de",
    name: "Deutsch",
  },*/
]
const locales: string[] = languages.map((lang) => lang.key)

export const i18n = {
  defaultLocale: "en",
  locales,
} as const

export type Locale = (typeof i18n)["locales"]
