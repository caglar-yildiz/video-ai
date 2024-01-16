import { Metadata } from "next";
import { getDictionary } from "./dictionaries";
import { locales, Lang } from "@/middleware";
import ScrollUp from "@/components/common/ScrollUp";
import Hero from "@/components/Hero";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import TabsDemo from "@/components/tabs";

export default async function Home({ params }: any) {
  // use session to determine if user is logged in
  const session = await getServerSession(authOptions);
  const { lang } = params;
  console.log(lang);
  const dict = await getDictionary(lang);
  return (
    <div>
      <ScrollUp />
      <Hero dict={dict} />
      {session ? (
        <div className="flex-1 items-center">
          <TabsDemo />
        </div>
      ) : (
        <>
          <h1>Not logged in</h1>
        </>
      )}
    </div>
  ); // Add to Cart
}

export const metadata: Metadata = {
  title: "Play Next.js - SaaS Starter Kit and Boilerplate for Next.js",
  description:
    "Free Next.js SaaS Boilerplate and Starter Kit designed and built for SaaS startups. It comes with all necessary integrations, pages, and components you need to launch a feature-rich SaaS websites.",
};

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const langs: Lang[] = locales;
  return langs;
}
