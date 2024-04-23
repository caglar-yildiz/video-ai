import Balancer from "react-wrap-balancer"

import { getFrequentlyAskedQuestions } from "@/data/frequently-asked-questions"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export async function FAQSection() {
  const frequentlyAskedQuestions = await getFrequentlyAskedQuestions("en")
  return (
    <section id="faq-section" aria-label="faq section" className="w-full">
      <div className="container grid max-w-6xl gap-8 md:gap-16">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              Look no further! Our comprehensive FAQ section covers a wide range
              of topics related to our product. We're here to assist you!
            </Balancer>
          </h3>
        </div>

        <div className="grid gap-4 sm:gap-6 md:gap-8">
          {frequentlyAskedQuestions.map((item) => (
            <Accordion key={item.question} type="single" collapsible>
              <AccordionItem value={item.question}>
                <AccordionTrigger className="sm:text-xl sm:leading-8">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground sm:text-lg sm:leading-8">
                  <Balancer>{item.answer}</Balancer>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}
