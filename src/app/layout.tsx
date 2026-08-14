import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fraunces, Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme";
import "./globals.css";

// Google Fonts are loaded through next/font (not a CSS @import) — Turbopack
// drops remote @imports, so they'd silently fall back to system fonts.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"], // optical sizing: legible text cut at body sizes, display cut for headings
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const collapse = localFont({
  src: [
    { path: "../../public/fonts/Collapse-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Collapse-Bold.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const courierPrime = localFont({
  src: [
    { path: "../../public/fonts/CourierPrime-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/CourierPrime-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/CourierPrime-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/CourierPrime-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const rulesCompressed = localFont({
  src: [
    { path: "../../public/fonts/RulesCompressed-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/RulesCompressed-Medium.woff2", weight: "600" },
  ],
  variable: "--font-rules-compressed",
  display: "swap",
});

const rulesExpanded = localFont({
  src: [
    { path: "../../public/fonts/RulesExpanded-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/RulesExpanded-Bold.woff2", weight: "700" },
  ],
  variable: "--font-rules-expanded",
  display: "swap",
});

const mondwest = localFont({
  src: [{ path: "../../public/fonts/Mondwest-Regular.woff2", weight: "400" }],
  variable: "--font-mondwest",
  display: "swap",
});

const sigurd = localFont({
  src: [{ path: "../../public/fonts/Sigurd-Variable.woff2", weight: "300 900" }],
  variable: "--font-display",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lothnic.dev"),
  title: "Mayank Joshi | Portfolio",
  description: "Systems & machine learning engineer portfolio of Mayank Joshi",
  openGraph: {
    title: "Mayank Joshi — Systems & Machine Learning Engineer",
    description: "Systems & machine learning engineer portfolio",
    images: [{ url: "/seo/og-image.png", width: 1200, height: 692 }],
  },
  icons: {
    icon: "/seo/favicon.ico",
    apple: "/seo/icon.png",
  },
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    document.documentElement.classList.toggle("dark", savedTheme !== "light");
  } catch {
    document.documentElement.classList.add("dark");
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${collapse.variable} ${courierPrime.variable} ${rulesCompressed.variable} ${rulesExpanded.variable} ${mondwest.variable} ${sigurd.variable} ${fraunces.variable} ${robotoMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
