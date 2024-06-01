import { NavItem } from "@/types"
import { Lang } from "@/i18n-config"
import { getDictionary } from "@/dictionaries"

export const getNavItems = async (lang : Lang) : Promise<NavItem[]> => {
  const dictionary = await getDictionary(lang)
  return [
    {
      title: dictionary.navItems.title.products + "",
      href: "/products",
      children: [
        {
          title: dictionary.navItems.title.dubbing + "",
          href: "/dubbing",
          description: "Video generation with voice",
        },
        {
          title: dictionary.navItems.title.speech + "",
          href: "/speech",
          description: "Upcoming feature",
        },
      ],
    },
    {
      title: dictionary?.navItems.title.pricing + "",
      href: "/pricing",
    },
    {
      title: dictionary?.navItems.title.faq + "",
      href: "/faq",
    },
    {
      title: dictionary?.navItems.title.about + "",
      href: "/about",
    },
  ]
}
