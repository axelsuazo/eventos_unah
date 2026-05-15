import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProviderContext } from "@/app/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eventos UNAH",
  description: "Frontend del sistema de gestión de eventos universitarios UNAH.",
  icons: {
    icon: "/UNAH-escudo.png",
    apple: "/UNAH-escudo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProviderContext>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProviderContext>
      </body>
    </html>
  );
}