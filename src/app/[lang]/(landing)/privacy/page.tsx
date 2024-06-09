import { LangPageProps } from "@/types"
import { getSiteConfig } from "@/config/site"

const PrivacyPolicy = async ({ params: { lang } }: LangPageProps) =>{
  const siteConfig = await getSiteConfig(lang)

  const privacyPolicyHtml = siteConfig.pages.privacyPolicyHtml

  return (
    <div className="my-32 flex flex-col items-center min-h-screen py-2">
      <div className="w-4/5 mx-auto bg-white p-5 rounded shadow-md">
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />
      </div>
    </div>
  );
}

export default PrivacyPolicy;
