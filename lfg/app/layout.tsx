import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const font = localFont({
   src: "../public/FontAwesome/webfonts/fa-v4compatibility.ttf"
});

export const metadata: Metadata = {
   title: "Looking For Group | RIT",
   description: "Temp description"
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${font.className}`}>{children}</body>
      </html>
   );
}
