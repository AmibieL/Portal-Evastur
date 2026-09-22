import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";

const wppText = encodeURIComponent("Olá! Gostaria de falar com um consultor.");
const wppLink = `https://wa.me/5568999872973?text=${wppText}`;

const contactOptions = [
  { icon: Phone, title: "WhatsApp", text: "Atendimento direto", href: wppLink },
  { icon: Mail, title: "E-mail", text: "contato@evastur.com", href: "mailto:contato@evastur.com" },
  { icon: MessageCircle, title: "Consultoria", text: "Planeje com nossa equipe", href: wppLink },
];

const ContactCTA = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const { error: functionError } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email, name: name || undefined },
      });
      if (functionError) throw functionError;
      setSuccess(true);
      setEmail("");
      setName("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (submissionError: unknown) {
      console.error("Error subscribing to newsletter:", submissionError);
      setError("Erro ao assinar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#051036] py-20 text-white sm:py-24 lg:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Atendimento Evastur</p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Sua próxima viagem começa com uma boa conversa
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65">
              Conte o que você procura. Nossa equipe organiza as possibilidades e ajuda a transformar a ideia em um roteiro viável.
            </p>
            <Link
              to="/contato"
              className="group mt-9 inline-flex min-h-12 items-center gap-4 bg-[#e00032] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9002d]"
            >
              Falar com um especialista
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="border-t border-white/20">
            {contactOptions.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.href}
                target={option.href.startsWith("http") ? "_blank" : undefined}
                rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-white/20 py-6"
              >
                <option.icon size={19} strokeWidth={1.6} className="text-white/65" />
                <span>
                  <span className="block text-sm font-semibold">{option.title}</span>
                  <span className="mt-1 block text-xs text-white/50">{option.text}</span>
                </span>
                <ArrowRight size={16} className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-16 border-t border-white/20 pt-9 lg:mt-20"
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold">Novidades e condições especiais</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">Receba inspirações de viagem sem excesso de mensagens.</p>
            </div>

            {success ? (
              <div className="flex items-center gap-3 text-sm font-medium text-emerald-300">
                <CheckCircle2 size={19} /> Inscrição realizada com sucesso.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr_auto]">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  aria-label="Seu nome"
                  className="min-h-12 border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/60"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  aria-label="Seu e-mail"
                  required
                  className="min-h-12 border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/60"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-5 text-sm font-semibold text-[#051036] transition-colors hover:bg-slate-100 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={15} /> Assinar</>}
                </button>
              </form>
            )}
          </div>
          {error && <p className="mt-3 text-right text-xs text-rose-300">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
