import { Lang } from "@/i18n-config"
import { type FrequentlyAskedQuestion } from "@/types"

import { getSiteConfig } from "@/config/site"

export async function getFrequentlyAskedQuestions(
  lang: Lang
): Promise<FrequentlyAskedQuestion[]> {
  const siteConfig = await getSiteConfig(lang)
  const frequentlyAskedQuestions: FrequentlyAskedQuestion[] = [
    {
      question: `What is ${siteConfig.name}?`,
      answer: `${siteConfig.name} is a platform that specializes in creating natural AI voices in any language and style. Whether you're a content creator, an author, a game developer, or building chatbots, ElevenLabs provides advanced AI technology and intuitive tools to enhance your audio experiences. Here are some key features.`,
    },
    {
      question: `What is included ?`,
      answer: `${siteConfig.name} lets you generate high-quality spoken audio in any voice, style, and language. Their AI model renders human intonation and inflections with unrivaled fidelity, adjusting the delivery based on context. You can use it for videos, gaming, AI chat bots audio books.`,
    },
    {
      question: `Why would I want to use ${siteConfig.name}?`,
      answer: `Generate lifelike speech in any language and voice. Customize vocal clarity, stability, or animated delivery. Ideal for digital creators, it provides high-quality TTS streaming instantly. Adjust voice outputs effortlessly through an intuitive interface. Turn text into lifelike audio across various languages and accents.`,
    },
    {
      question: `I am confused with pricing`,
      answer: `Our product is completely free and with scaling usage price increases. The pricing section could be good place to start
                We have plans and intentions to make this better product for wide range of users.`,
    },
    {
      question: `Is it easy to use? How do I get started?`,
      answer: `${siteConfig.name} is extremely easy to use. You can get started by registering.`,
    },
    {
      question: `Is the product actively maintained?`,
      answer: `Yes! We're continuously enhancing our platform by adding exciting new features and refining existing ones. Our dedicated team is committed to delivering the best experience for our users. Stay tuned for regular updates! If you want to be the first to know about major releases, consider signing up for our newsletter. Don't worry—we won't spam you; we promise!`,
    },
  ]

  return frequentlyAskedQuestions
}
