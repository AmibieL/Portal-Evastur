import { Sparkles, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuoteFormDialog from "@/components/QuoteFormDialog";

const CTABanner = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl py-14 lg:py-20 px-6 lg:px-12 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(232 100% 12%) 0%, hsl(232 100% 22%) 50%, hsl(220 80% 30%) 100%)",
            }}
          >
            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: "translate(30%, -40%)" }} />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" style={{ transform: "translate(-30%, 40%)" }} />

            {/* Icon */}
            <div className="relative z-10 flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                <Sparkles size={28} className="text-amber-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="relative z-10 text-2xl md:text-3xl lg:text-5xl font-extrabold text-white mb-5 max-w-3xl mx-auto leading-tight">
              Pronto para a sua próxima{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, hsl(45 93% 58%), hsl(350 100% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                lembrança inesquecível?
              </span>
            </h2>

            {/* Description */}
            <p className="relative z-10 text-white/55 text-lg mb-10 max-w-xl mx-auto">
              Deixe nosso time cuidar de tudo. Você só se preocupa em dizer "sim" para a viagem.
            </p>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setQuoteOpen(true)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl hover:opacity-90 hover:-translate-y-1 transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, hsl(350 100% 45%), hsl(350 100% 38%))",
                  boxShadow: "0 8px 32px hsl(350 100% 45% / 0.35)",
                }}
              >
                Solicitar orçamento
                <ArrowRight size={18} />
              </button>
              <Link
                to="/destinos"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base text-white border border-white/25 bg-white/8 backdrop-blur-sm hover:bg-white/15 hover:-translate-y-1 transition-all duration-200"
              >
                <MapPin size={18} />
                Ver destinos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <QuoteFormDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
};

export default CTABanner;
