// src/app/layout.tsx
import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Blog Summariser",
  description: "Scrape, summarise, translate, and store blog posts",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground chakra-ui-light" style={{ paddingRight: "0px" }}>
        <main className="container mx-auto py-10 px-4">{children}</main>
      </body>
    </html>
  );
}