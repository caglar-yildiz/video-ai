import PaymentConfirmationPage from "@/components/app/protected/payment-confirmation"
import { getSiteConfig } from "@/config/site"
import { Lang } from "@/i18n-config"

const PaymentConfirmation = async ( {
                                params,
                                searchParams,
                              }: {
  params: { lang: string };
  searchParams: { [key: string]: string  | undefined };
}) => {
  const status = searchParams["status"] === "success" ? "success" : "failed"
  const message = searchParams["message"]

  const siteConfig = await getSiteConfig(params.lang as Lang)
  const paymentConfirmPage = siteConfig.pages.confirmPayment


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <PaymentConfirmationPage status={status} message={message} messages={paymentConfirmPage.messages}/>
    </div>
  );
};

export default PaymentConfirmation;
