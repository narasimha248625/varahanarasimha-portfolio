import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "varahanarasimha Logisa",
  description: "Portfolio of Varahanarasimha Logisa - Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
