"use client";
import Header from "@/components/Header";
import ToasterContext from "@/components/context/ToasterContext";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeProvider attribute='class' enableSystem={false} defaultTheme='light'>
				<ToasterContext />
				<Header />
				{children}
				<Footer />
				<ScrollToTop />
			</ThemeProvider>
		</SessionProvider>
	);
}
