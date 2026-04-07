import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw, Loader2, CheckCircle2, Inbox, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import heroImg from "@/assets/destino-riocroa-hero.jpg";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Erro ao reenviar", description: error.message, variant: "destructive" });
      } else {
        setResent(true);
        toast({ title: "E-mail reenviado!", description: "Verifique sua caixa de entrada." });
      }
    } catch {
      toast({ title: "Erro inesperado", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left — Hero visual (desktop only) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img src={heroImg} alt="Paisagem amazônica" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0d2040]/80 to-[#1a3a6b]/85" />

        {/* Floating cards decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] right-[10%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-52"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-400/80 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div>
                <span className="text-white text-xs font-semibold block">Conta criada!</span>
                <span className="text-white/50 text-[10px]">Agora confirme seu e-mail</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[22%] right-[8%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-48"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-white text-xs font-semibold">Falta pouco!</span>
            </div>
            <p className="text-white/50 text-[10px]">Confirme para acessar pacotes exclusivos da Amazônia.</p>
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="text-white/90 font-bold text-2xl tracking-tight">
            <span className="text-emerald-400">E</span>vastur
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
              Estamos quase lá! ✉️
            </h1>
            <p className="mt-4 text-white/65 text-base leading-relaxed">
              Confirme seu e-mail para começar a explorar as melhores experiências de viagem.
            </p>
            <div className="flex items-center gap-3 mt-8">
              {["🌿 Amazônia", "🚢 Cruzeiros", "✈️ Nacional", "🌎 Internacional"].map((tag) => (
                <span key={tag} className="text-xs bg-white/10 border border-white/15 text-white/70 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-white/35 text-xs">© {new Date().getFullYear()} Evastur Turismo — Cruzeiro do Sul, AC</p>
        </div>
      </div>

      {/* Right — Confirmation content */}
      <div className="w-full lg:w-[45%] flex flex-col min-h-screen bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Voltar ao login
          </Link>
          <span className="text-muted-foreground/50 text-xs font-mono">Evastur 2025</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Animated mail icon */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-emerald-100 rounded-3xl flex items-center justify-center shadow-lg">
                    <Mail size={44} className="text-primary" />
                  </div>
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 border-2 border-primary/30 rounded-3xl"
                  />
                  {/* Success badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    <CheckCircle2 size={18} className="text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Title and description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-3"
              >
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  Verifique seu e-mail 📬
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enviamos um link de confirmação para
                </p>
                {email && (
                  <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5">
                    <Mail size={16} className="text-primary" />
                    <span className="font-semibold text-foreground text-sm">{email}</span>
                  </div>
                )}
                <p className="text-muted-foreground text-xs">
                  Clique no link do e-mail para ativar sua conta e começar a explorar.
                </p>
              </motion.div>

              {/* Tips card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Inbox size={18} className="text-amber-600" />
                  <h3 className="font-semibold text-amber-800 text-sm">Não encontrou o e-mail?</h3>
                </div>
                <ul className="space-y-2 text-xs text-amber-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Verifique sua pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Aguarde alguns minutos — pode levar até <strong>5 minutos</strong> para chegar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    Certifique-se de que o e-mail digitado está correto
                  </li>
                </ul>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-3"
              >
                <Button
                  onClick={handleResend}
                  disabled={resending || resent}
                  variant="outline"
                  className="w-full h-11 font-semibold gap-2"
                  size="lg"
                >
                  {resending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : resent ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {resent ? "E-mail reenviado com sucesso!" : "Reenviar e-mail de confirmação"}
                </Button>

                <Button asChild className="w-full h-11 font-semibold" size="lg">
                  <Link to="/login">Voltar para o Login</Link>
                </Button>
              </motion.div>

              {/* Footer text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-xs text-muted-foreground/60"
              >
                Após confirmar, você poderá fazer login e reservar experiências incríveis.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
