"use client"

import Balancer from "react-wrap-balancer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FrequentlyAskedQuestion } from "@/types"
import { FrequentlyAskedQuestions } from "@/config/site"

export async function FAQSection(
  {
    frequentlyAskedQuestions,
    faqPageMessages
  } : {
    frequentlyAskedQuestions : FrequentlyAskedQuestion[]
    faqPageMessages : FrequentlyAskedQuestions
  }) {

  return (
    <section id="faq-section" aria-label="faq section" className="w-full">
      <div className="container grid max-w-6xl gap-8 md:gap-16">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {faqPageMessages.title}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {faqPageMessages.description}
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
