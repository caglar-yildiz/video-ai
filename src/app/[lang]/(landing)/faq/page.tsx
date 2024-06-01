import { LangPageProps } from "@/types"
import { FAQSection } from "@/components/app/landing/sections/faq-section"
import { getFrequentlyAskedQuestions } from "@/data/frequently-asked-questions"

const Faq = async ({ params: { lang } }: LangPageProps) => {
  const frequentlyAskedQuestions = await getFrequentlyAskedQuestions(lang)
  return (
    <div className="pb-5 pt-12 lg:pb-12 lg:pt-24">
      <FAQSection frequentlyAskedQuestions={frequentlyAskedQuestions} />
    </div>
  )
}

export default Faq
