import { LangPageProps } from "@/types"
import { FAQSection } from "@/components/app/landing/sections/faq-section"
import { getFrequentlyAskedQuestions } from "@/data/frequently-asked-questions"
import { getSiteConfig } from "@/config/site"

const Faq = async ({ params: { lang } }: LangPageProps) => {
  const frequentlyAskedQuestions = await getFrequentlyAskedQuestions(lang)
  const siteConfig = await getSiteConfig(lang)

  return (
    <div className="pb-5 pt-12 lg:pb-12 lg:pt-24">
      <FAQSection frequentlyAskedQuestions={frequentlyAskedQuestions} faqPageMessages={siteConfig.pages.faqPage} />
    </div>
  )
}

export default Faq
