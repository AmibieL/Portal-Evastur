import { ArrowDown, ArrowRight, Heart, MessageCircle } from "lucide-react";
import heroAmazon from "@/assets/hero-amazon.jpg";
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
    <section className="relative flex min-h-[700px] items-end overflow-hidden bg-[#06123d] pt-20 text-white lg:min-h-[780px]">
      <div className="absolute inset-0">
        <img
          src={heroAmazon}
          alt="Paisagem natural entre os destinos selecionados pela Evastur"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,11,43,0.94)_0%,rgba(2,11,43,0.72)_48%,rgba(2,11,43,0.2)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b2b]/80 via-transparent to-black/20" />
      </div>

      <div className="container relative z-10 mx-auto px-5 pb-12 pt-28 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70"
          >
            <span className="h-px w-10 bg-[#e00032]" />
            Viagens nacionais e internacionais
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5.3rem]"
          >
            O mundo, escolhido com cuidado.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-7 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg"
          >
            Explore coleções selecionadas para diferentes estilos de viagem. Cada roteiro combina conforto, autenticidade e o acompanhamento próximo da Evastur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#pacotes"
              className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#e00032] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9002d]"
            >
              Explorar pacotes
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <Link
              to="/cruzeiro-do-sul"
              className="group inline-flex min-h-12 items-center justify-center gap-3 border border-white/35 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
            >
              Conheça Cruzeiro do Sul
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/20 pt-5 text-xs text-white/75"
        >
          <Link
            to="/minha-conta?tab=favoritos"
            onClick={handleFavoritesClick}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Heart size={14} /> Meus favoritos
          </Link>
          <a href={wppUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <MessageCircle size={14} /> Falar com um especialista
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationsHero;
