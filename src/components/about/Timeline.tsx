import {
  Globe2,
  Building2,
  Crown,
  Sparkles,
  Heart,
  Clock,
  Rocket,
  Globe,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

const timelineItems: TimelineItem[] = [
  {
    year: "1996",
    title: "Nasce a EVASTUR",
    description: "Primeira agência de viagens do Vale do Juruá — atendimento próximo e foco em viagens nacionais.",
    icon: <Globe2 size={20} />,
    accent: "hsl(220 80% 55%)",
  },
  {
    year: "2001",
    title: "Mudança na aviação mundial",
    description: "Após 11/09, a aviação se reformula globalmente e a EVASTUR se adapta para seguir conectando com segurança.",
    icon: <CheckCircle2 size={20} />,
    accent: "hsl(200 85% 50%)",
  },
  {
    year: "2008",
    title: "Parcerias globais",
    description: "Acordos com hotéis, operadoras e companhias aéreas ampliam destinos e tarifas competitivas.",
    icon: <Building2 size={20} />,
    accent: "hsl(260 70% 60%)",
  },
  {
    year: "2012",
    title: "Nova direção",
    description: "Ex-RICO e TRIP assume 100% da empresa, profissionaliza processos e prepara a expansão.",
    icon: <Crown size={20} />,
    accent: "hsl(45 90% 55%)",
  },
  {
    year: "2015",
    title: "Roteiros autorais",
    description: "Experiências culturais, gastronômicas e vivências locais com curadoria própria EVASTUR.",
    icon: <Sparkles size={20} />,
    accent: "hsl(330 75% 55%)",
  },
  {
    year: "2019–2020",
    title: "Pandemia e resiliência",
    description: "Mesmo com o mundo parado, garantimos 100% dos embarques, mantivemos a equipe e não fechamos um dia sequer.",
    icon: <Heart size={20} />,
    accent: "hsl(350 80% 55%)",
  },
  {
    year: "2020",
    title: "Suporte total 24/7",
    description: "A cultura criada na pandemia vira política: acompanhamento integral antes, durante e depois da viagem.",
    icon: <Clock size={20} />,
    accent: "hsl(170 70% 45%)",
  },
  {
    year: "2025",
    title: "Rebranding EVASTUR+",
    description: "Nova identidade, logo renovada e lançamento do portal online com pacotes exclusivos para Cruzeiro do Sul.",
    icon: <Rocket size={20} />,
    accent: "hsl(15 90% 55%)",
  },
  {
    year: "2025+",
    title: "Conectividade e expansão digital",
    description: "Plataforma que reúne clientes, hotéis, companhias aéreas e operadoras para simplificar compras online.",
    icon: <Globe size={20} />,
    accent: "hsl(200 90% 55%)",
  },
];

const Timeline = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(232 100% 8%) 0%, hsl(232 100% 14%) 50%, hsl(232 100% 8%) 100%)",
        }}
      />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
            <Clock size={13} />
            Nossa história
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Do primeiro balcão à{" "}
            <span
              style={{
                background: "linear-gradient(90deg, hsl(200 90% 60%), hsl(170 80% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EVASTUR+
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Uma linha do tempo de coragem, adaptação e inovação — sempre ao lado dos passageiros do Vale do Juruá.
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative pl-12 md:pl-14 pb-12 last:pb-0 group"
            >
              {/* Vertical line */}
              {index !== timelineItems.length - 1 && (
                <div
                  className="absolute left-[15px] md:left-[17px] top-8 w-[2px] h-full"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                  }}
                />
              )}

              {/* Dot / Node */}
              <div
                className="absolute left-0 top-1.5 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center border-2 group-hover:scale-125 transition-all duration-300"
                style={{
                  borderColor: `${item.accent}60`,
                  background: `${item.accent}15`,
                  color: item.accent,
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: item.accent }}
                />
              </div>

              {/* Content Card */}
              <div className="ml-3 md:ml-4 p-5 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 group-hover:-translate-y-0.5">
                {/* Year badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={13} style={{ color: item.accent }} />
                  <span
                    className="text-sm font-bold"
                    style={{ color: item.accent }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="flex items-start gap-3.5">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `${item.accent}12`,
                      color: item.accent,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;