import { LangPageProps } from "@/types"

import { BenefitsSection } from "@/components/app/landing/sections/benefits-section"
import { ContactSection } from "@/components/app/landing/sections/contact-section"
import { HeroSection } from "@/components/app/landing/sections/hero-section"
import { NewsletterSection } from "@/components/app/landing/sections/newsletter-section"
import { TestimonialsSection } from "@/components/app/landing/sections/testimonials-section"
import { VideoSection } from "@/components/app/landing/sections/video-section"
import SampleAudioPage from "@/components/app/landing/sections/audio-section"
import { dummySounds2 } from "@/data/landing"

const LandingPage = ({ params: { lang } }: LangPageProps) => {

  return (
    <div className="grid w-full grid-cols-1 items-center justify-center gap-16 md:gap-32">
      <HeroSection locale={lang} />
      <VideoSection locale={lang} />
      <div className={"flex items-center justify-center mx-auto"}>
        <SampleAudioPage soundsGrid={dummySounds2} />
      </div>
      <BenefitsSection locale={lang} />
      <NewsletterSection locale={lang} />
      {/*<TestimonialsSection locale={lang} />*/}
      <ContactSection locale={lang} />
    </div>
  )
}

export default LandingPage
