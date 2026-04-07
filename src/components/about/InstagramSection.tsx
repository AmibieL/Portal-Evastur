import { Sparkles, Instagram, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Bastidores de roteiros personalizados",
  "Cobertura de viagens e inspeções de hotéis",
  "Dicas rápidas de documentação e seguros",
  "Ofertas relâmpago e oportunidades exclusivas",
];

const InstagramSection = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsl(232 100% 8%) 0%, hsl(232 100% 14%) 50%, hsl(232 100% 8%) 100%)",
        }}
      />
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Left Content — 3 cols */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-pink-500/15 border border-pink-500/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles size={14} className="text-pink-400" />
              <span className="text-pink-300 text-sm font-medium">Novidades em tempo real</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight"
            >
              Compartilhamos bastidores e{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, hsl(280 80% 65%), hsl(330 80% 60%), hsl(25 90% 60%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                inspirações
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-white/55 text-lg mb-10 max-w-2xl leading-relaxed"
            >
              Acompanhe nossos especialistas testando experiências, conheça destinos antes de embarcar
              e veja como cuidamos de cada viagem.
            </motion.p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
                  className="flex items-center gap-3 p-4 bg-white/[0.04] border border-white/8 rounded-xl"
                >
                  <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80 font-medium text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Instagram Card — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-3xl p-8 text-center border border-white/10 backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Instagram gradient icon */}
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-500/25">
                <Instagram size={36} className="text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Siga a Evastur</h3>
              <p className="text-white/45 text-sm mb-6 leading-relaxed">
                Mensagens diretas, suporte rápido e inspirações diárias para sua próxima viagem.
              </p>

              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/evastur.turismo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-pink-500/20"
                style={{
                  background: "linear-gradient(135deg, hsl(280 80% 55%), hsl(330 80% 50%), hsl(25 90% 55%))",
                }}
              >
                @evastur.turismo
                <ExternalLink size={14} />
              </a>

              {/* Follower hint */}
              <p className="text-white/30 text-xs mt-4">
                📍 Cruzeiro do Sul • Amazônia • Brasil
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
