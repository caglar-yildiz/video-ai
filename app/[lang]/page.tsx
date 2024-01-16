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
		<div className='flex flex-col justify-center items-center'>
			<ScrollUp />
			<Hero dict={dict} />
			{session ? (
				<div className=''>
					<TabsDemo />
				</div>
			) : (
				<div>
					<h1>Not logged in</h1>
				</div>
			)}
		</div>
	); // Add to Cart
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
	const langs: Lang[] = locales;
	return langs;
}
