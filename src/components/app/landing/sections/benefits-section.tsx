import { ComponentWithLocaleType } from "@/types"
import Balancer from "react-wrap-balancer"

import { getSiteConfig } from "@/config/site"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const BenefitsSection: ComponentWithLocaleType = async ({ locale }) => {
  const siteConfig = await getSiteConfig(locale)
  return (
    <section id="about-section" aria-label="about section" className="w-full">
      <div className="container grid max-w-6xl justify-center gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-extrabold text-transparent">
                {siteConfig.pages.landingPage.messages.unlockGlobalAudiences}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {siteConfig.pages.landingPage.messages.fromLocalToGlobal}
            </Balancer>
          </h3>
        </div>

        <div className="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="space-y-4 md:mt-20 md:space-y-6">
            {/*<Card
              id="1"
              className="h-fit bg-gradient-to-br from-blue-600/10 to-purple-600/10 transition-all duration-1000 ease-out md:hover:-translate-y-3"
            >
              <CardHeader>
                <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                  {siteConfig.messages[4]}
                </CardDescription>
                <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                  <Balancer>
                    {siteConfig.messages[5]}
                  </Balancer>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base leading-8 tracking-wide text-muted-foreground">
                  <Balancer>
                    {siteConfig.messages[6]}
                  </Balancer>
                </p>
                <div>
                  <div className="pr-8">
                    <div className="relative z-10 flex flex-col gap-3 rounded-xl bg-background p-4 text-center shadow-xl">
                      <p className="text-3xl font-bold text-pink-800 dark:text-blue-600">
                        162.9k
                      </p>
                      <p className="text-xs font-bold tracking-wide text-purple-600 dark:text-purple-300">
                        Last 7 Days Website Visits
                      </p>
                      <p className="text-xs text-muted-foreground">
                        23% Increase from Last Week
                      </p>
                    </div>
                  </div>
                  <div className="-mt-14 pl-8">
                    <div className="flex flex-col gap-3 rounded-xl bg-background p-4 text-center opacity-30 shadow-xl">
                      <p className="text-3xl font-bold">132.7k</p>
                      <p className="text-xs font-bold tracking-wide">
                        Last 14 Days Website Visits
                      </p>
                      <p className="text-xs text-muted-foreground">
                        17% Increase from Last Week
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>*/}

            <Card
              id="2"
              className="h-fit bg-gradient-to-br from-blue-600/10 to-purple-600/10 transition-all duration-1000 ease-out md:hover:-translate-y-3"
            >
              <CardHeader>
                <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                  {siteConfig.pages.landingPage.messages.speakerDetection}
                </CardDescription>
                <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                  {siteConfig.pages.landingPage.messages.automaticallyIdentifySpeakers}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                  <Balancer>
                    {siteConfig.pages.landingPage.messages.smartAlgorithms}
                  </Balancer>
                </p>
                <video
                  loop
                  preload="none"
                  autoPlay
                  className="rounded-xl shadow-2xl"
                  muted
                >
                  <source src="/videos/kek.mp4" type="video/mp4" />
                  <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 md:space-y-6">
            <Card
              id="3"
              className="h-fit bg-gradient-to-br from-blue-600/10 to-purple-600/10 transition-all duration-1000 ease-out md:hover:-translate-y-3"
            >
              <CardHeader>
                <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                  {siteConfig.pages.landingPage.messages.highQualityImplementation}
                </CardDescription>
                <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                  {siteConfig.pages.landingPage.messages.perfectSounds}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                  <Balancer>
                    {siteConfig.pages.landingPage.messages.aiGeneratedDesigns}
                  </Balancer>
                </p>
                <video
                  loop
                  preload="none"
                  autoPlay
                  className="rounded-xl shadow-2xl"
                  muted
                >
                  <source src="/videos/kek.mp4" type="video/mp4" />
                  <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>

            {/*<Card
              id="4"
              className="h-fit w-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 transition-all duration-1000 ease-out md:hover:-translate-y-3"
            >
              <CardHeader>
                <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                  Time-Saving Copywriting
                </CardDescription>
                <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                  <Balancer>No Learning Curve</Balancer>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                  <Balancer>
                    Need compelling copy? Our AI-powered tools create engaging
                    text for landing pages, marketing materials, and more.
                  </Balancer>
                </p>
                <video
                  loop
                  preload="none"
                  autoPlay
                  className="rounded-xl shadow-2xl"
                  muted
                >
                  <source src="/videos/kek.mp4" type="video/mp4" />
                  <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>*/}
          </div>
        </div>
      </div>
    </section>
  )
}
