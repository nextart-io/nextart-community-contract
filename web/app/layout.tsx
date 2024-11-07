import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./config/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: 'Next Art',
  description: 'Next Art Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${fontVariables}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
