import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hostme.dev"),
  title: "hostme — ホスティング診断",
  description:
    "7つの質問に答えるだけで、最適なホスティング先が見つかる。10サービスからTOP3を提案。",
  openGraph: {
    title: "hostme — ホスティング診断",
    description:
      "7つの質問に答えるだけで、最適なホスティング先が見つかる。10サービスからTOP3を提案。",
    type: "website",
    siteName: "hostme",
    images: [{ url: "/ogp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "hostme — ホスティング診断",
    description:
      "7つの質問に答えるだけで、最適なホスティング先が見つかる。10サービスからTOP3を提案。",
    images: ["/ogp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={jetbrainsMono.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "hostme",
              url: "https://hostme.dev",
              description:
                "7つの質問に答えるだけで、最適なホスティング先が見つかる。10サービスからTOP3を提案。",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
            }),
          }}
        />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
