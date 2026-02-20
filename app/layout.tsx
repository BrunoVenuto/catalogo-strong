import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import CartDrawer from "@/components/CartDrawer";
import ConsultoriaController from "@/components/ConsultoriaController";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />

        {children}

        <Footer />

        {/* Globais */}
        <FloatingCTA />
        <ConsultoriaController />
        <CartDrawer />
      </body>
    </html>
  );
}
