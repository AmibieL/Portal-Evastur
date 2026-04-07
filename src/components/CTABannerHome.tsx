import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTABannerHomeProps {
  onOpenQuote: () => void;
}

const CTABannerHome = ({ onOpenQuote }: CTABannerHomeProps) => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground">
          Não encontrou o destino ideal?
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
          Montamos uma viagem exclusiva para você. Conte-nos o que procura e nossa equipe cuida de tudo.
        </p>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base gap-2"
          onClick={onOpenQuote}
        >
          <Sparkles size={18} />
          Solicitar Orçamento
        </Button>
      </div>
    </section>
  );
};

export default CTABannerHome;
