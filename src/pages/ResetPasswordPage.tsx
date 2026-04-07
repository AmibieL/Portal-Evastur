import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // O Supabase envia o usuário pra cá com a sessão já ativa via magic link
  // A gente só precisa chamar updateUser para definir a nova senha
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Sessão ativa, pode redefinir a senha
      }
    });
    return () => subscription.unsubscribe();
  }, []);

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
  const strength = getStrength(password);
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-lime-400", "bg-emerald-500"][strength];
  const strengthLabel = ["", "Muito fraca", "Fraca", "Média", "Boa", "Forte"][strength];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha muito curta", description: "Use pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao redefinir senha", description: error.message, variant: "destructive" });
    } else {
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {!done ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-7"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Nova senha</h1>
              <p className="text-muted-foreground text-sm">Escolha uma senha forte para proteger sua conta.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-5 bg-card border rounded-2xl p-7 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Mín. 6 caracteres"
                    className="pl-10 pr-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-muted"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{strengthLabel}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    className={`pl-10 pr-10 h-11 ${confirmPassword && password !== confirmPassword ? "border-red-400" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500">Senhas não coincidem</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={loading || (!!confirmPassword && password !== confirmPassword)}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Redefinir Senha
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 size={40} className="text-emerald-500" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Senha redefinida! 🎉</h2>
              <p className="text-muted-foreground text-sm mt-2">Redirecionando para o login em instantes...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
