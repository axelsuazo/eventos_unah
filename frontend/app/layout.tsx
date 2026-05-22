import type { Metadata } from "next";
import type { ReactNode } from "react";
import ThemeProvider from "@/app/Components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eventos UNAH",
  description: "Frontend estático del sistema de eventos universitarios UNAH.",
  icons: {
    icon: "/UNAH-escudo.png",
    apple: "/UNAH-escudo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
