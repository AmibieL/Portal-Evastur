import { TrendingUp, Leaf, Mountain, Ship, Utensils } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    icon: Leaf,
    title: "Ecoturismo",
    description: "Trilhas em matas nativas, observação de fauna local e conexão pura com a floresta.",
    accent: "#059669",
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: Mountain,
    title: "Vivências Indígenas",
    description: "Imersão profunda nas tradições, medicinas ancestrais e pinturas das etnias da região.",
    accent: "#d97706",
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: Ship,
    title: "Expedições Fluviais",
    description: "Navegue pelo Rio Croa, igarapés secretos e descubra mirantes escondidos nas águas amazônicas.",
    accent: "#0284c7",
    bg: "from-sky-500/10 to-sky-500/5",
    border: "border-sky-500/20",
  },
  {
    icon: Utensils,
    title: "Sabores Locais",
    description: "Descubra a culinária autêntica do Juruá, desde farinhadas até pratos típicos indígenas.",
    accent: "hsl(350 100% 45%)",
    bg: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/20",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Subtle top divider */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, hsl(220 13% 85%), transparent)" }}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              <span className="block w-6 h-px bg-accent" />
              Natureza em Foco
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              A Amazônia Ocidental{" "}
              <span className="text-primary">do seu jeito</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
            Descubra os roteiros que mais combinam com você: da tranquilidade das águas escuras aos cantos espirituais da floresta.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`group relative rounded-2xl p-6 border bg-gradient-to-br ${cat.bg} ${cat.border} cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl`}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                style={{ background: cat.accent }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
                style={{ background: `${cat.accent}20` }}
              >
                <cat.icon size={26} style={{ color: cat.accent }} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                {cat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                style={{ background: cat.accent }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
