import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import EstimateProvider from "@/components/estimate/EstimateProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: { default: "One Percent", template: "%s | One Percent" },
  description: "A small senior team designing, building and running AI products, automations and web platforms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScroll>
            <EstimateProvider>
              <Navbar />
              <Preloader />
              {children}
              <Footer />
            </EstimateProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}

