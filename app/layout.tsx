import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/buildfy.png";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import PlausibleProvider from "next-plausible";

let title = "Buildfy – Screenshot to code";
let description = "Generate your next app with a screenshot";
let url = "https://www.buildfy.dev/";
let ogimage = "https://www.buildfy.dev/og-image.png";
let sitename = "buildfy.dev";
let favicon = "/buildfy.png";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: favicon,
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <PlausibleProvider domain="buildfy.dev" />
        <link rel="icon" href={favicon} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col font-sans bg-[#011627] text-[#d6deeb]`}
      >
        <header className="sm:mx-10 mx-4 mt-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="Logo" width={50} height={50} />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-[#82AAFF] to-[#C792EA] bg-clip-text text-transparent">Buildfy</span>
            </Link>
            <Button
              asChild
              variant="outline"
              className="hidden sm:inline-flex gap-2 border-[#5f7e97] text-[#d6deeb] hover:bg-[#1d3b53]"
            >
              <Link href="https://github.com/OmTun-Labs" target="_blank">
                <GitHubLogoIcon className="size-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </header>

        <main className="grow flex flex-col">{children}</main>

        <footer className="flex flex-col sm:flex-row items-center justify-between sm:px-10 px-4 pt-20 pb-6 gap-4 sm:gap-0 sm:py-3 text-[#637777] text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://omtunlabs.com"
              target="_blank"
              className="font-bold hover:underline underline-offset-4 text-[#82AAFF]"
            >
              Omtunlabs
            </a>
          </p>
          <div className="flex gap-4">
            <Button asChild variant="ghost" className="gap-2 text-[#d6deeb] hover:bg-[#1d3b53]">
              <Link href="https://github.com/OmTun-Labs" target="_blank">
                <GitHubLogoIcon className="size-4" />
                GitHub
              </Link>
            </Button>
            <Button asChild variant="ghost" className="gap-2 text-[#d6deeb] hover:bg-[#1d3b53]">
              <Link href="https://twitter.com/nutlope" target="_blank">
                <TwitterLogoIcon className="size-4" />
                Twitter
              </Link>
            </Button>
          </div>
        </footer>
      </body>
    </html>
  );
}
