import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEMA | The New Parent Night Light",
  description: "A free living community for new mums, new dads and parents figuring it out together.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
