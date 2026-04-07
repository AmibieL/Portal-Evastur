import { Sparkles, Phone, Mail, MessageCircle, ArrowRight, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const wppText = encodeURIComponent("Olá! Gostaria de falar com um consultor.");
const wppLink = `https://wa.me/5568999872973?text=${wppText}`;

const contactOptions = [
  {
    icon: Phone,
    title: "WhatsApp",
    description: "Converse em tempo real com um especialista",
    cta: "Chamar agora",
    link: wppLink,
    accent: "#22c55e",
    bg: "from-green-500/10 to-green-500/5",
    border: "border-green-500/20",
  },
  {
    icon: Mail,
    title: "E-mail",
    description: "Receba um roteiro exclusivo na sua caixa de entrada",
    cta: "Enviar e-mail",
    link: "mailto:contato@evastur.com",
    accent: "hsl(350 100% 45%)",
    bg: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/20",
  },
  {
    icon: MessageCircle,
    title: "Consultoria",
    description: "Agende uma chamada e cocrie sua próxima experiência",
    cta: "Agendar agora",
    link: wppLink,
    accent: "hsl(45 93% 55%)",
    bg: "from-amber-500/15 to-amber-500/5",
    border: "border-amber-500/30",
  },
];

const ContactCTA = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const { error: fnError } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email, name: name || undefined },
      });

      if (fnError) throw fnError;

      setSuccess(true);
      setEmail("");
      setName("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error subscribing to newsletter:", err);
      setError("Erro ao assinar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Full-bleed navy gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(232 100% 12%) 0%, hsl(232 100% 20%) 100%)",
        }}
      />
      {/* Subtle radial glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(350 100% 45% / 0.3) 0%, transparent 70%)",
          transform: "translate(30%, -40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(225 76% 49% / 0.4) 0%, transparent 70%)",
          transform: "translate(-40%, 40%)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
            <Sparkles size={13} />
            Pronto para embarcar?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Transforme ideias em{" "}
            <span
              style={{
                background: "linear-gradient(90deg, hsl(45 93% 58%), hsl(350 100% 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              roteiros inesquecíveis
            </span>
          </h2>
          <p className="text-white/65 leading-relaxed">
            Compartilhe seu estilo de viagem e receba propostas exclusivas com fotografias, valores e diferenciais pensados para você.
          </p>
        </motion.div>

        {/* Primary CTA to Contact Page */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <Link
            to="/contato"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl hover:opacity-90 hover:-translate-y-1 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, hsl(350 100% 45%), hsl(350 100% 38%))",
              boxShadow: "0 8px 32px hsl(350 100% 45% / 0.35)",
            }}
          >
            <Sparkles size={18} />
            Falar com especialista
            <ArrowRight size={16} className="ml-0.5" />
          </Link>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-14">
          {contactOptions.map((opt, i) => (
            <motion.a
              key={i}
              href={opt.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              whileHover={{ y: -6 }}
              className={`group relative flex flex-col gap-4 p-6 rounded-2xl border bg-gradient-to-br ${opt.bg} ${opt.border} backdrop-blur-sm cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-2xl`}
            >
              {/* Decorative glow */}
              <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{ background: opt.accent }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${opt.accent}22` }}
              >
                <opt.icon size={22} style={{ color: opt.accent }} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{opt.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{opt.description}</p>
              </div>

              <span
                className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto"
                style={{ color: opt.accent }}
              >
                {opt.cta}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </span>
            </motion.a>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-center text-white/50 text-sm mb-4 uppercase tracking-widest font-medium">
            Receba novidades e promoções
          </p>
          
          {success ? (
            <div className="flex flex-col items-center gap-2 text-center py-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-1">
                <CheckCircle2 size={24} className="text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-semibold">Inscrição realizada com sucesso! 🎉</p>
              <p className="text-white/50 text-xs">Fique de olho na sua caixa de entrada.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm backdrop-blur-sm"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-[1.5] px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-white/30 text-sm backdrop-blur-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shrink-0 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, hsl(350 100% 45%), hsl(350 100% 38%))",
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (
                  <>
                    <Send size={15} />
                    Assinar news
                  </>
                )}
              </button>
            </form>
          )}
          {error && <p className="text-rose-400 text-xs mt-2 text-center">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
