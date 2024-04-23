import React from "react"
import Image from "next/image"
import { LangPageProps } from "@/types"
import Balancer from "react-wrap-balancer"

import { getSiteConfig } from "@/config/site"
import { dummySounds2 } from "@/data/landing"
import SampleAudioPage from "@/components/app/landing/sections/audio-section"
import { BenefitsSection } from "@/components/app/landing/sections/benefits-section"
import { ContactSection } from "@/components/app/landing/sections/contact-section"
import { HeroSection } from "@/components/app/landing/sections/hero-section"
import { NewsletterSection } from "@/components/app/landing/sections/newsletter-section"
import { TestimonialsSection } from "@/components/app/landing/sections/testimonials-section"
import { VideoSection } from "@/components/app/landing/sections/video-section"
import About from "@/app/[lang]/(landing)/about/page"

// import CookieConsent from "react-cookie-consent"

const LandingPage = async ({ params: { lang } }: LangPageProps) => {
  const siteConfig = await getSiteConfig(lang)
  return (
    <div className="grid w-full grid-cols-1 items-center justify-center gap-16 md:gap-32">
      <HeroSection locale={lang} />

      <div className={"mx-auto rounded-2xl border-4 border-slate-400"}>
        <Image
          className={"rounded-2xl"}
          src="/images/landing-pic.png"
          width={1100}
          height={500}
          alt="landing-pic"
        />
      </div>
      {/*      <VideoSection locale={lang}/>
      <BenefitsSection locale={lang} />*/}
      <section id="about" className="pb-8 pt-20 lg:pb-[70px] lg:pt-[120px]">
        <div className="container">
          <div className="wow fadeInUp" data-wow-delay=".2s">
            <div className="-mx-4 flex flex-wrap items-center">
              <div className="w-full px-4 lg:w-1/2">
                <div className="mb-12 max-w-[540px] lg:mb-0">
                  <h2 className="mb-5 text-3xl font-bold leading-tight  sm:text-[40px] sm:leading-[1.2]">
                    Why use{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {siteConfig.name}?
                    </span>
                  </h2>
                  <p className="mb-10">
                    Content creators who want to expand their reach and
                    engagement with a multilingual audience. Influencers who
                    want to connect and interact with their fans and followers
                    in their native languages.
                    <br />
                    <br />
                    Educators who want to make their courses and lessons more
                    accessible and inclusive for learners of different
                    backgrounds and abilities.
                  </p>
                </div>
              </div>

              <div className="w-full px-4 lg:w-1/2">
                <div className="-mx-2 flex flex-wrap sm:-mx-4 lg:-mx-2 xl:-mx-4">
                  <div className="w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4">
                    <div
                      className={`relative mb-4 sm:mb-8 sm:h-[400px] md:h-[540px] lg:h-[400px] xl:h-[500px] `}
                    >
                      <Image
                        src="/images/about/about-image-3.jpg"
                        alt="about image"
                        fill
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </div>

                  <div className="w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4">
                    <div className="relative mb-4 sm:mb-8 sm:h-[220px] md:h-[346px] lg:mb-4 lg:h-[225px] xl:mb-8 xl:h-[310px]">
                      <Image
                        src="/images/about/about-image-02.jpg"
                        alt="about image"
                        fill
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="relative z-10 mb-4 flex items-center justify-center overflow-hidden bg-primary px-6 py-12 sm:mb-8 sm:h-[160px] sm:p-5 lg:mb-4 xl:mb-8">
                      <div>
                        <span className="block text-5xl font-extrabold text-white"></span>
                        <span className="block text-base font-semibold text-white">
                          21 Languages, 1 Solution:
                        </span>
                        <span className="block text-base font-medium text-white text-opacity-70">
                          Translate anything, effortlessly
                        </span>
                      </div>
                      <div>
                        <span className="absolute left-0 top-0 -z-10">
                          <svg
                            width="106"
                            height="144"
                            viewBox="0 0 106 144"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              opacity="0.1"
                              x="-67"
                              y="47.127"
                              width="113.378"
                              height="131.304"
                              transform="rotate(-42.8643 -67 47.127)"
                              fill="url(#paint0_linear_1416_214)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_1416_214"
                                x1="-10.3111"
                                y1="47.127"
                                x2="-10.3111"
                                y2="178.431"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="white" />
                                <stop
                                  offset="1"
                                  stopColor="white"
                                  stopOpacity="0"
                                />
                              </linearGradient>
                            </defs>
                          </svg>
                        </span>
                        <span className="absolute right-0 top-0 -z-10">
                          <svg
                            width="130"
                            height="97"
                            viewBox="0 0 130 97"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              opacity="0.1"
                              x="0.86792"
                              y="-6.67725"
                              width="155.563"
                              height="140.614"
                              transform="rotate(-42.8643 0.86792 -6.67725)"
                              fill="url(#paint0_linear_1416_215)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_1416_215"
                                x1="78.6495"
                                y1="-6.67725"
                                x2="78.6495"
                                y2="133.937"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="white" />
                                <stop
                                  offset="1"
                                  stopColor="white"
                                  stopOpacity="0"
                                />
                              </linearGradient>
                            </defs>
                          </svg>
                        </span>
                        <span className="absolute bottom-0 right-0 -z-10">
                          <svg
                            width="175"
                            height="104"
                            viewBox="0 0 175 104"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              opacity="0.1"
                              x="175.011"
                              y="108.611"
                              width="101.246"
                              height="148.179"
                              transform="rotate(137.136 175.011 108.611)"
                              fill="url(#paint0_linear_1416_216)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_1416_216"
                                x1="225.634"
                                y1="108.611"
                                x2="225.634"
                                y2="256.79"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="white" />
                                <stop
                                  offset="1"
                                  stopColor="white"
                                  stopOpacity="0"
                                />
                              </linearGradient>
                            </defs>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto px-36">
        <h1 className="pb-16 text-center font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <Balancer>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hear the Future of Voice
            </span>
          </Balancer>
        </h1>
        <SampleAudioPage soundsGrid={dummySounds2} />
      </div>
      <NewsletterSection locale={lang} />
      {/*      <TestimonialsSection locale={lang} />
      <ContactSection locale={lang} />*/}
    </div>
  )
}

export default LandingPage
