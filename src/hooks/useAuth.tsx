import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/**
 * DEFINIÇÃO DO CONTEXTO DE AUTENTICAÇÃO
 * 
 * Aqui guardamos tudo o que precisamos saber sobre o usuário logado:
 * - user: Dados básicos do Supabase Auth (email, id, etc)
 * - session: A sessão atual (token de acesso)
 * - profile: Dados extras que vêm da nossa tabela 'profiles' (nome, cargo/role, foto)
 * - loading: Pra saber se ainda estamos checando o login quando o app abre
 */
type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: { role?: string; full_name?: string; avatar_url?: string } | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role?: string; full_name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca dados adicionais do usuário (como o cargo: admin ou cliente)
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("fetchProfile auth error (Juan, olha isso!):", error);
      }
      // Se não encontrar o perfil, assume que é um cliente comum por segurança
      setProfile(data || { role: "customer" });
    } catch (err) {
      console.error("fetchProfile exception:", err);
      setProfile({ role: "customer" });
    }
  };

  useEffect(() => {
    // 1. Checa se o cara já tem uma sessão guardada (cookies/localStorage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Fica de olho se o cara deslogar ou mudar de conta (o Supabase avisa a gente)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true); // Evita mostrar a tela errada enquanto busca o perfil
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * LOGOUT (O FAMOSO "VAI COM DEUS")
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * O HOOK useAuth (O NOSSO VIP PASS)
 * 
 * É através dele que qualquer componente do site acessa o usuário.
 * Juan, se você tentar usar isso fora do AuthProvider, vai dar erro. Não diga que não avisei! kkk
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider. Juan, você esqueceu o Provider de novo? kkk");
  }
  return context;
}

