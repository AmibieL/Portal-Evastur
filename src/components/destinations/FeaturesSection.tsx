import { Sparkles, Ship, ShieldCheck, Heart, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Ship,
    title: "Cruzeiros assinados",
    description: "Roteiros sofisticados pelo Caribe, Mediterrâneo e Brasil com concierge dedicado.",
  },
  {
    icon: ShieldCheck,
    title: "Curadoria confiável",
    description: "Parcerias com hospedagens premium, guias locais e experiências imersivas selecionadas a dedo.",
  },
  {
    icon: Heart,
    title: "Detalhes personalizados",
    description: "Cada viagem nasce do seu estilo: celebrações, lua de mel, família ou aventuras solo.",
  },
  {
    icon: Clock,
    title: "Assistência contínua",
    description: "Equipe monitorando sua jornada antes, durante e depois da viagem com canais 24/7.",
  },
];

const checklist = [
  "Passagens aéreas e transfers inclusos",
  "Hospedagem em parceiros selecionados",
  "Guia local especializado",
  "Seguro viagem incluso",
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary/40 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, hsl(350 100% 45% / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
              <Sparkles size={12} />
              Experiência Completa
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Mais do que destinos,{" "}
              <span className="text-primary">criamos jornadas</span>{" "}
              sob medida
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              Combinamos hospedagens de alto padrão, serviços exclusivos e parceiros confiáveis para garantir que cada etapa aconteça com tranquilidade.
            </p>

            {/* Checklist */}
            <ul className="space-y-2.5">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                  <CheckCircle2
                    size={17}
                    className="shrink-0"
                    style={{ color: "hsl(350 100% 45%)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Right Feature Grid ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{ background: "hsl(350 100% 45% / 0.08)" }}
                >
                  <feature.icon
                    size={22}
                    className="transition-colors duration-300"
                    style={{ color: "hsl(350 100% 45%)" }}
                  />
                </div>

                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
