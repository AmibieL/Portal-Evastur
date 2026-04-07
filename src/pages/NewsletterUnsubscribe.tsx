import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MailX, CheckCircle2, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";

type Status = "loading" | "success" | "already" | "error";

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Link inválido. Verifique o link recebido por e-mail.");
      return;
    }

    const unsubscribe = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("newsletter-unsubscribe", {
          body: { token },
        });

        if (error) throw error;

        const result = typeof data === "string" ? JSON.parse(data) : data;

        if (result.error) {
          setStatus("error");
          setErrorMsg(result.error);
          return;
        }

        setEmail(result.email || "");
        if (result.message?.includes("já cancelada")) {
          setStatus("already");
        } else {
          setStatus("success");
        }
      } catch (err: any) {
        console.error("Unsubscribe error:", err);
        setStatus("error");
        setErrorMsg("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
      }
    };

    unsubscribe();
  }, [token]);

  const statusConfig = {
    loading: {
      icon: <Loader2 size={48} className="animate-spin text-blue-400" />,
      title: "Processando...",
      description: "Aguarde enquanto cancelamos sua inscrição.",
      color: "from-blue-500/20 to-blue-600/10",
    },
    success: {
      icon: <CheckCircle2 size={48} className="text-emerald-400" />,
      title: "Inscrição cancelada!",
      description: `O e-mail ${email} foi removido da nossa lista de novidades.`,
      color: "from-emerald-500/20 to-emerald-600/10",
    },
    already: {
      icon: <MailX size={48} className="text-amber-400" />,
      title: "Já descadastrado",
      description: `O e-mail ${email} já havia sido removido anteriormente.`,
      color: "from-amber-500/20 to-amber-600/10",
    },
    error: {
      icon: <AlertTriangle size={48} className="text-rose-400" />,
      title: "Ops! Algo deu errado",
      description: errorMsg,
      color: "from-rose-500/20 to-rose-600/10",
    },
  };

  const current = statusConfig[status];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, hsl(232 100% 8%) 0%, hsl(232 100% 16%) 50%, hsl(232 100% 12%) 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div
          className={`rounded-3xl p-10 text-center bg-gradient-to-br ${current.color} border border-white/10 backdrop-blur-xl shadow-2xl`}
        >
          <div className="flex justify-center mb-6">{current.icon}</div>

          <h1 className="text-2xl font-bold text-white mb-3">{current.title}</h1>
          <p className="text-white/60 leading-relaxed text-sm mb-8">{current.description}</p>

          {status !== "loading" && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs">
                Sentiremos sua falta! Você pode se inscrever novamente a qualquer momento.
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, hsl(232 100% 35%), hsl(232 100% 45%))",
                }}
              >
                <ArrowLeft size={16} />
                Voltar ao site
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Evastur Turismo — Cruzeiro do Sul, AC
        </p>
      </motion.div>
    </div>
  );
};

export default NewsletterUnsubscribe;
