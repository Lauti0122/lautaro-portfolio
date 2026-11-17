import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, JetBrains_Mono } from "next/font/google";
import { site, siteUrl } from "../site";
import "./globals.css";

const display = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

const sans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  keywords: [
    "software a medida",
    "desarrollo de software Mendoza",
    "desarrollador full stack",
    "sistemas de gestión",
    "tiendas online",
    "e-commerce",
    "chatbot de WhatsApp",
    "automatizaciones",
    "inteligencia artificial para empresas",
    "integraciones",
    "Next.js",
    "Lautaro Bua",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.shortDescription,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
