import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { DemoProvider } from "@/hooks/use-demo";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: { default: "Vastor Capital", template: "%s · Vastor Capital" },
  description:
    "Estratégia, investimentos e governança para transformar patrimônio em legado.",
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <DemoProvider>
          {children}
          <Toaster richColors position="bottom-right" closeButton />
        </DemoProvider>
      </body>
    </html>
  );
}
