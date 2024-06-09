import { Lang } from "@/i18n-config"


const dictionaries = {
  en: async () => (await import("./dictionaries/en.json")).default,
  tr: async () => (await import("./dictionaries/tr.json")).default,
  de: async () => (await import("./dictionaries/en.json")).default,
}
export const getDictionary = async (locale: Lang) => {
  try {
    return await dictionaries[locale]()
  } catch (error) {
    console.error("locale failed", locale,error)
    try {
      return await dictionaries["en"]()
    } catch (error) {
      throw new Error("Failed to load dictionary")
    }
  }
}
