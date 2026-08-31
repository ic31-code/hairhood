import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SanityLive } from "../../sanity/lib/live";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { StickyBookBar } from "../components/sticky-book-bar";

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const franchise = localFont({
  src: "../../public/fonts/Franchise.ttf",
  variable: "--font-display",
  display: "swap",
});

const bungee = localFont({
  src: "../../public/fonts/Bungee-Regular.ttf",
  variable: "--font-ui",
  display: "swap",
});

const richardsonScript = localFont({
  src: "../../public/fonts/RichardsonScript-DEMO.otf",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hair Hood — Barbershop, Whiteladies Road, Bristol",
  description:
    "Sharp, every time. Hair Hood is a barbershop on Whiteladies Road, Clifton, Bristol — cuts, fades, beards and hot towel shaves.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const cookieYesId = process.env.NEXT_PUBLIC_COOKIEYES_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${franchise.variable} ${bungee.variable} ${richardsonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          CookieYes owns consent, script-blocking, and the banner UI once the account exists —
          set NEXT_PUBLIC_COOKIEYES_ID to switch it on. GA4 / Google Ads tags aren't in this
          codebase yet; add them behind CookieYes's own gating when they land, not before.
        */}
        {cookieYesId && (
          <Script
            id="cookieyes"
            strategy="beforeInteractive"
            src={`https://cdn-cookieyes.com/client_data/${cookieYesId}/script.js`}
          />
        )}
        <SiteHeader />
        {children}
        <SiteFooter />
        <StickyBookBar />
        <SanityLive />
      </body>
    </html>
  );
}
