"use client";
import Header from "@/components/Header";
import ToasterContext from "@/components/context/ToasterContext";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "@/styles/index.css";
import "@/styles/prism-vsc-dark-plus.css";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScroolToTop";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="!scroll-smooth">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="light"
          >
            <ToasterContext/>
            <Header />
            {children}
            <Footer/>
            <ScrollToTop/>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
