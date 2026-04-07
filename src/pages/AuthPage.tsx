import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Phone, Loader2, Eye, EyeOff, CheckCircle2, KeyRound, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "@/assets/destino-riocroa-hero.jpg";

type ViewMode = "login" | "register" | "forgot" | "forgot-success";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  const [view, setView] = useState<ViewMode>("login");
  const [loading, setLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Cadastro
  const [regName, setRegName] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showRegConfirmPwd, setShowRegConfirmPwd] = useState(false);

  // Esqueceu a senha
  const [forgotEmail, setForgotEmail] = useState("");

  // Redireciona após login baseado no param ?redirect= ou pelo role do usuário
  useEffect(() => {
    if (!authLoading && user && profile) {
      const redirect = searchParams.get("redirect");
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (profile.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/minha-conta", { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: "E-mail ou senha incorretos.", variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      toast({ title: "Senhas não coincidem", description: "Verifique a confirmação de senha.", variant: "destructive" });
      return;
    }
    if (regPassword.length < 6) {
      toast({ title: "Senha muito curta", description: "Use pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: { full_name: regName, whatsapp: regWhatsapp },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
    } else {
      navigate(`/confirmar-email?email=${encodeURIComponent(regEmail)}`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setView("forgot-success");
    }
  };

  // Indicador de força da senha
  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(regPassword);
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-lime-400", "bg-emerald-500"][strength];
  const strengthLabel = ["", "Muito fraca", "Fraca", "Média", "Boa", "Forte"][strength];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const heroTexts: Record<ViewMode, { title: string; subtitle: string }> = {
    login: { title: "Sua próxima grande memória começa aqui.", subtitle: "Descubra destinos incríveis na Amazônia e em todo o Brasil com a Evastur." },
    register: { title: "Junte-se a milhares de aventureiros.", subtitle: "Crie sua conta e comece a planejar a viagem dos seus sonhos." },
    forgot: { title: "Sem problemas. Acontece com todos.", subtitle: "Te enviamos um link para redefinir sua senha rapidinho." },
    "forgot-success": { title: "E-mail enviado com sucesso!", subtitle: "Verifique sua caixa de entrada e siga as instruções." },
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left — Hero visual */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img src={heroImg} alt="Paisagem amazônica" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0d2040]/80 to-[#1a3a6b]/85" />

        {/* Floating cards decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[8%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-44"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-400/80 rounded-full flex items-center justify-center">
                <CheckCircle2 size={16} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Reserva confirmada!</span>
            </div>
            <p className="text-white/60 text-[10px]">Rio Croa • 3 pessoas</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[25%] right-[12%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-40"
          >
            <div className="flex items-center gap-2 mb-1">
              <Plane size={14} className="text-amber-300" />
              <span className="text-white text-xs font-semibold">Próxima viagem</span>
            </div>
            <p className="text-amber-300/80 text-xs font-bold">Cruzeiro Amazônico</p>
            <p className="text-white/50 text-[10px] mt-0.5">Em 12 dias</p>
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="text-white/90 font-bold text-2xl tracking-tight">
            <span className="text-emerald-400">E</span>vastur
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md"
            >
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                {heroTexts[view].title}
              </h1>
              <p className="mt-4 text-white/65 text-base leading-relaxed">
                {heroTexts[view].subtitle}
              </p>
              <div className="flex items-center gap-3 mt-8">
                {["🌿 Amazônia", "🚢 Cruzeiros", "✈️ Nacional", "🌎 Internacional"].map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 border border-white/15 text-white/70 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-white/35 text-xs">© {new Date().getFullYear()} Evastur Turismo — Cruzeiro do Sul, AC</p>
        </div>
      </div>

      {/* Right — Form area */}
      <div className="w-full lg:w-[45%] flex flex-col min-h-screen bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Início
          </Link>
          <span className="text-muted-foreground/50 text-xs font-mono">Evastur 2025</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">

              {/* ══════════ LOGIN ══════════ */}
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-7"
                >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Bem-vindo de volta 👋</h2>
                    <p className="text-muted-foreground text-sm">Entre na sua conta para continuar explorando.</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 h-11"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Senha</Label>
                        <button
                          type="button"
                          onClick={() => setView("forgot")}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Esqueceu a senha?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showLoginPwd ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPwd(!showLoginPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md" size="lg" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Entrar
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground">
                    Não tem conta?{" "}
                    <button type="button" onClick={() => setView("register")} className="text-primary font-semibold hover:underline">
                      Criar conta grátis
                    </button>
                  </p>
                </motion.div>
              )}

              {/* ══════════ REGISTER ══════════ */}
              {view === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Criar conta 🌍</h2>
                    <p className="text-muted-foreground text-sm">Reserve experiências inesquecíveis em todo o Brasil.</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="reg-name">Nome Completo</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-name"
                            placeholder="Seu nome completo"
                            className="pl-10 h-11"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-whatsapp">WhatsApp</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-whatsapp"
                            type="tel"
                            placeholder="(68) 9 9999-9999"
                            className="pl-10 h-11"
                            value={regWhatsapp}
                            onChange={(e) => setRegWhatsapp(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-email">E-mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 h-11"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-password"
                            type={showRegPwd ? "text" : "password"}
                            placeholder="Mín. 6 caracteres"
                            className="pl-10 pr-10 h-11"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPwd(!showRegPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {regPassword && (
                          <div className="space-y-1">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-muted"}`}
                                />
                              ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">{strengthLabel}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-confirm">Confirmar Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reg-confirm"
                            type={showRegConfirmPwd ? "text" : "password"}
                            placeholder="Repita a senha"
                            className={`pl-10 pr-10 h-11 ${regConfirmPassword && regPassword !== regConfirmPassword ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPwd(!showRegConfirmPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showRegConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {regConfirmPassword && regPassword !== regConfirmPassword && (
                          <p className="text-[11px] text-red-500">Senhas não coincidem</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold shadow-md"
                      size="lg"
                      disabled={loading || (!!regConfirmPassword && regPassword !== regConfirmPassword)}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Criar Conta Grátis
                    </Button>
                  </form>

                  <p className="text-center text-xs text-muted-foreground">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <button type="button" className="underline hover:text-foreground">Termos de Uso</button>
                    {" "}e{" "}
                    <button type="button" className="underline hover:text-foreground">Política de Privacidade</button>.
                  </p>

                  <p className="text-center text-sm text-muted-foreground">
                    Já tem conta?{" "}
                    <button type="button" onClick={() => setView("login")} className="text-primary font-semibold hover:underline">
                      Entrar
                    </button>
                  </p>
                </motion.div>
              )}

              {/* ══════════ FORGOT PASSWORD ══════════ */}
              {view === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-7"
                >
                  <div className="space-y-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                      <KeyRound size={24} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Esqueceu a senha?</h2>
                    <p className="text-muted-foreground text-sm">
                      Insira seu e-mail e enviaremos um link para você criar uma nova senha.
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">E-mail da sua conta</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 h-11"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 font-semibold" size="lg" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Enviar Link de Recuperação
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} /> Voltar para o login
                  </button>
                </motion.div>
              )}

              {/* ══════════ FORGOT SUCCESS ══════════ */}
              {view === "forgot-success" && (
                <motion.div
                  key="forgot-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">E-mail enviado! ✉️</h2>
                    <p className="text-muted-foreground text-sm">
                      Enviamos as instruções para <strong className="text-foreground">{forgotEmail}</strong>.
                      Verifique sua caixa de entrada (e a pasta de spam).
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-left">
                    <p className="font-semibold mb-1">⚠️ Não recebeu?</p>
                    <p className="text-xs">Aguarde alguns minutos e verifique o spam. Se ainda não chegou, tente novamente.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button variant="outline" onClick={() => setView("forgot")} className="w-full">
                      Tentar novamente
                    </Button>
                    <Button onClick={() => setView("login")} className="w-full">
                      Voltar para o login
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
