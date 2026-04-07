import { Sparkles, Heart, MessageCircle, ArrowDown } from "lucide-react";
import destApas from "@/assets/dest-apas.jpg";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const WHATSAPP_NUMBER = "5568999872973";
const wppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1%21+Vim+pelo+site+e+gostaria+de+falar+com+um+especialista+Evastur.`;

const DestinationsHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFavoritesClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate("/login?redirect=/minha-conta?tab=favoritos");
    }
  };

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden pt-20">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <img src={destApas} alt="Destinos Evastur" className="w-full h-full object-cover" />
        {/* Dark gradient for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, hsl(232 100% 10% / 0.90) 0%, hsl(232 100% 10% / 0.65) 55%, hsl(232 100% 10% / 0.15) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: "linear-gradient(to top, hsl(var(--background)), transparent)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-16 lg:py-24">
        {/* ── Left Content ── */}
        <div className="space-y-7 max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-widest">Curadoria Evastur</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]"
          >
            Destinos para viver{" "}
            <span
              className="relative"
              style={{
                background: "linear-gradient(90deg, hsl(45 93% 58%), hsl(350 100% 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              histórias
            </span>{" "}
            tão grandiosas quanto a sua
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-white/75 text-lg leading-relaxed"
          >
            Explore coleções selecionadas para diferentes estilos de viagem. Cada experiência foi pensada para entregar conforto, autenticidade e memórias inesquecíveis.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/minha-conta?tab=favoritos"
              onClick={handleFavoritesClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              style={{
                background: "linear-gradient(135deg, hsl(350 100% 45%), hsl(350 100% 38%))",
              }}
            >
              <Heart size={17} />
              Meus favoritos
            </Link>
            <a
              href={wppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-0.5"
            >
              <MessageCircle size={17} />
              Falar com especialista
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="hidden lg:flex items-center gap-2 text-white/40 text-xs mt-12"
          >
            <ArrowDown size={14} className="animate-bounce" />
            Role para explorar destinos
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsHero;
