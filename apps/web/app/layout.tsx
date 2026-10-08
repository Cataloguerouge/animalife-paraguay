import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animalife Agroveterinaria | Paraguay",
  description: "Productos para el bienestar animal y el campo.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es-PY"><body>{children}</body></html>;
}
