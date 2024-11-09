import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/buildfy.png";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import PlausibleProvider from "next-plausible";
import { Sparkles } from "lucide-react";
import { Github, Twitter } from "lucide-react";

let title = "Buildfy – Screenshot to code";
let description = "Generate your next app with a screenshot";
let url = "https://www.buildfy.dev/";
let ogimage = "https://www.buildfy.dev/og-image.png";
let sitename = "buildfy.dev";
let favicon = "/buildfy.png";

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
        <meta name="description" content={description} />
        <meta name="keywords" content="screenshot to code, ai code generation, react components, web development, buildfy" />
        <meta name="author" content="Buildfy Team" />
        <meta name="creator" content="Buildfy" />
        <meta name="publisher" content="Buildfy" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        
        <meta property="og:image" content={ogimage} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={sitename} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogimage} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@buildfy" />
        <meta name="twitter:creator" content="@buildfy" />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="google-site-verification" content="google-site-verification-code" />
        <meta name="yandex-verification" content="yandex-verification-code" />
        <meta name="msvalidate.01" content="microsoft-verification-code" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col font-sans bg-white text-gray-800`}
      >
             <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Sparkles className="h-8 w-8 text-sky-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">Buildfy</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
         
            <Link href="/pricing">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Pricing</Button>
            </Link>
           
            <Link href="/buildfy">
              <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-sky-200 font-medium rounded-full px-6">
                Try Now
              </Button>
            </Link>
          </nav>
        </div>
      </header>

        <main className="grow flex flex-col">{children}</main>

        <footer className="flex flex-col sm:flex-row items-center justify-between sm:px-10 px-4 pt-20 pb-6 gap-4 sm:gap-0 sm:py-3 text-gray-500 text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://omtunlabs.com"
              target="_blank"
              className="font-bold hover:underline underline-offset-4 text-blue-500"
            >
              Omtunlabs
            </a>
          </p>
          <div className="flex gap-4">
            <Button asChild variant="ghost" className="gap-2 text-gray-700 hover:bg-gray-50">
              <Link href="https://github.com/OmTun-Labs" target="_blank">
                <GitHubLogoIcon className="size-4" />
                GitHub
              </Link>
            </Button>
            <Button asChild variant="ghost" className="gap-2 text-gray-700 hover:bg-gray-50">
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
