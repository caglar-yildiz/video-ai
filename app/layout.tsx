import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { DM_Sans as dmSansFont } from "next/font/google";

const dmSans = dmSansFont({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Play Next.js - SaaS Starter Kit and Boilerplate for Next.js",
	description:
		"Free Next.js SaaS Boilerplate and Starter Kit designed and built for SaaS startups. It comes with all necessary integrations, pages, and components you need to launch a feature-rich SaaS websites.",
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang='en'>
			<body className={`${dmSans.className} !scroll-smooth`} suppressHydrationWarning={true}>
				{children}
			</body>
		</html>
	);
}
