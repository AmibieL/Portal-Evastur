import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4 py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto"
              >
                <XCircle size={48} className="text-amber-500" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Pagamento Cancelado</h1>
                <p className="text-muted-foreground mt-2">
                  Nenhum valor foi cobrado. Seu carrinho ainda está salvo.
                </p>
              </div>
            </div>

            <Card className="border-amber-200/50 bg-amber-50/30">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">O que aconteceu?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  O pagamento foi cancelado ou não foi concluído. Isso pode ter ocorrido porque
                  você voltou do processo de pagamento. <strong>Nenhum valor foi cobrado</strong>.
                </p>
                <p className="text-sm text-muted-foreground">
                  Suas reservas pendentes podem ter expirado. Para garantir disponibilidade,
                  volte ao carrinho e tente novamente.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button asChild className="gap-2" size="lg">
                <Link to="/carrinho">
                  <ShoppingCart size={18} />
                  Voltar ao Carrinho
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2" size="lg">
                <Link to="/destinos">
                  <ArrowLeft size={18} />
                  Continuar Explorando
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentCancelPage;
