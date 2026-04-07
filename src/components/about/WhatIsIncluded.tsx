import {
  Receipt,
  Building,
  Ship,
  Users,
  ShieldCheck,
  Crown,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuoteFormDialog from "@/components/QuoteFormDialog";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

const features: FeatureItem[] = [
  {
    icon: <Receipt size={24} />,
    title: "Tarifas negociadas",
    description: "Acesso a acordos exclusivos com companhias e hotéis.",
    accent: "hsl(200 85% 55%)",
  },
  {
    icon: <Building size={24} />,
    title: "Hospedagens selecionadas",
    description: "A curadoria cuida do conforto, da localização e do serviço.",
    accent: "hsl(260 70% 60%)",
  },
  {
    icon: <Ship size={24} />,
    title: "Cruzeiros & experiências",
    description: "Do mar ao deserto: passeios temáticos e roteiros diferentes.",
    accent: "hsl(170 70% 45%)",
  },
  {
    icon: <Users size={24} />,
    title: "Atendimento humano",
    description: "Nada de chatbot frio. Especialistas de verdade cuidando de você.",
    accent: "hsl(45 90% 55%)",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Segurança de ponta a ponta",
    description: "Documentação, seguros, suporte — tudo em um só lugar.",
    accent: "hsl(145 65% 45%)",
  },
  {
    icon: <Crown size={24} />,
    title: "Toque premium",
    description: "Upgrades, mimos e detalhes que viram memórias.",
    accent: "hsl(330 75% 55%)",
  },
];

const WhatIsIncluded = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-background via-blue-50/30 to-background">
        {/* Decorative */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14 lg:mb-18"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70 mb-4">
              <ShieldCheck size={13} />
              Por que viajar com a Evastur
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              O que está incluso{" "}
              <span className="text-primary">(de verdade)</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Transparência total. Sem letrinhas miúdas — só viagem bem planejada.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group relative rounded-2xl p-6 border border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `${feature.accent}12`,
                    color: feature.accent,
                  }}
                >
                  {feature.icon}
                </div>

                <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/destinos"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Explorar pacotes
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 font-bold text-base transition-all hover:-translate-y-0.5"
            >
              Montar meu roteiro
            </button>
          </motion.div>
        </div>
      </section>

      <QuoteFormDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
};

export default WhatIsIncluded;