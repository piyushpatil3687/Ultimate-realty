import type { Metadata } from "next";
import "./globals.css";
import ChatbotVisibility from "./components/ChatbotVisibility";

export const metadata: Metadata = {
  title: "Ultimate Realty | Pune",
  description:
    "Ultimate Realty - Find your dream home in Pune. Explore flats, apartments, villas, plots and commercial properties.",
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
        <ChatbotVisibility />
      </body>
    </html>
  );
}