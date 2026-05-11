import type { Metadata } from "next";
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
