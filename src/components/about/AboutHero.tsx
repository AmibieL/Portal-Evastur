import { Phone, Compass, ChevronDown, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-amazon.jpg";
import { useState } from "react";
import QuoteFormDialog from "@/components/QuoteFormDialog";

const stats = [
  { value: "29+", label: "Anos de experiência" },
  { value: "5000+", label: "Viagens realizadas" },
  { value: "24/7", label: "Suporte dedicado" },
  { value: "100%", label: "Embarques na pandemia" },
];

const AboutHero = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with parallax feel */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(6,12,34,0.55) 0%, rgba(6,12,34,0.70) 50%, rgba(6,12,34,0.92) 100%)"
          }} />
        </div>

        {/* Decorative glows */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-28 pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-5 py-2.5 rounded-full mb-8"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-white/90 text-sm font-medium tracking-wide">Desde 1996 • Cruzeiro do Sul, Acre</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 max-w-5xl mx-auto leading-[1.1]"
          >
            Transformamos sonhos em{" "}
            <span
              style={{
                background: "linear-gradient(135deg, hsl(200 90% 60%), hsl(170 80% 55%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              viagens inesquecíveis
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Do Vale do Juruá para o mundo: 29 anos de pioneirismo, resiliência e inovação.
            De roteiros autorais a suporte 24/7, conectamos pessoas, sonhos e destinos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl hover:opacity-90 hover:-translate-y-1 transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, hsl(350 100% 45%), hsl(350 100% 38%))",
                boxShadow: "0 8px 32px hsl(350 100% 45% / 0.35)",
              }}
            >
              <Phone size={18} />
              Solicitar orçamento
              <ChevronDown size={16} className="rotate-[-90deg]" />
            </button>
            <Link
              to="/destinos"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base text-white border border-white/25 bg-white/8 backdrop-blur-sm hover:bg-white/15 hover:-translate-y-1 transition-all duration-200"
            >
              <Compass size={18} />
              Explorar destinos
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl py-5 px-4"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-white/55 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-2 mt-14"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-white/70"
              />
            </div>
            <span className="text-white/40 text-xs tracking-widest uppercase">Descubra mais</span>
          </motion.div>
        </div>
      </section>

      <QuoteFormDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </>
  );
};

export default AboutHero;
