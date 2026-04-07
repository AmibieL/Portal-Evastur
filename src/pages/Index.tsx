import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationsSection from "@/components/DestinationsSection";
import CruzeiroDoSulSection from "@/components/CruzeiroDoSulSection";
import CTABannerHome from "@/components/CTABannerHome";
import QuoteFormDialog from "@/components/QuoteFormDialog";
import Footer from "@/components/Footer";

/**
 * A VITRINE DA EVASTUR (HOME PAGE)
 * 
 * E aí Juan, beleza? Esta é a Index, a "cara" do site.
 * Aqui a gente organiza as seções principais. Se você mudar a ordem aqui,
 * muda a ordem de tudo que o cliente vê primeiro. Cuidado pra não bagunçar o core! kkk
 */
const Index = () => {
  // Controle do modal de "Solicitar Orçamento"
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* Banner Principal com Chamada de Impacto */}
      <HeroSection />

      {/* Seção de Destinos (Nacionais e Internacionais) */}
      <DestinationsSection />

      {/* Seção Especial: Destinos do Cruzeiro do Sul */}
      <CruzeiroDoSulSection />

      {/* Banner de Chamada para Ação (CTA) que abre o formulário */}
      <CTABannerHome onOpenQuote={() => setQuoteOpen(true)} />

      {/* Modal de Orçamento - Fica escondido até o usuário clicar nos botões de CTA */}
      <QuoteFormDialog open={quoteOpen} onOpenChange={setQuoteOpen} />

      {/* Rodapé com links e informações de contato */}
      <Footer />
    </div>
  );
};

export default Index;
