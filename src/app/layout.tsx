import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SanityLive } from "../../sanity/lib/live";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${franchise.variable} ${bungee.variable} ${richardsonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
