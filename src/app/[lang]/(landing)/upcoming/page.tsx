import { LangPageProps } from "@/types"
import { getSiteConfig } from "@/config/site"

const Upcoming = async ({ params: { lang } }: LangPageProps) => {
  const siteConfig =await getSiteConfig(lang)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl mb-4">{siteConfig.pages.landingPage.messages.thankYouForSigningUp}</h1>
        <p className="text-xl mb-4">{siteConfig.pages.landingPage.messages.weWillBeContactingYou}</p>
      </div>
    </div>
  );
};

export default Upcoming;
