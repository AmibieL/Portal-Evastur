import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * O CONTROLE DE FAVORITOS (HOOK USE FAVORITE)
 * 
 * Juan, este hook é o cérebro por trás do botão de coração. 
 * Ele verifica se o pacote está favoritado, adiciona e remove do banco.
 * Se o cara tentar favoritar sem estar logado, ele manda pro login kkk.
 */
export function useFavorite(packageId?: string) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Verifica se o pacote específico está favoritado
  const { data: isFavorite, isLoading } = useQuery({
    queryKey: ["package-favorite", packageId, user?.id],
    enabled: !!packageId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("package_id", packageId!)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
  });

  // Mutação para alternar entre favoritado e não favoritado
  const toggleFavorite = useMutation({
    mutationFn: async (pkgId: string) => {
      if (!user) {
        // Se não tá logado, tchau kkk. Manda pro login!
        const currentPath = window.location.pathname;
        navigate(`/login?redirect=${currentPath}`);
        throw new Error("Necessário login");
      }

      if (isFavorite) {
        // Se já é favorito, a gente remove
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("package_id", pkgId)
          .eq("user_id", user.id);
        if (error) throw error;
        return false;
      } else {
        // Se não é, a gente adiciona
        const { error } = await supabase
          .from("user_favorites")
          .insert({
            package_id: pkgId,
            user_id: user.id
          });
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (wasAdded) => {
      // Atualiza o cache pra UI refletir a mudança na hora
      queryClient.invalidateQueries({ queryKey: ["package-favorite", packageId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["customer-favorites", user?.id] });
      
      if (wasAdded === true) {
        toast.success("Adicionado aos favoritos! ❤️");
      } else if (wasAdded === false) {
        toast.info("Removido dos favoritos.");
      }
    },
    onError: (error: any) => {
      if (error.message !== "Necessário login") {
        toast.error("Erro ao processar favoritos kkk. Tenta de novo!");
      }
    }
  });

  return {
    isFavorite,
    isLoading,
    toggleFavorite: () => packageId && toggleFavorite.mutate(packageId)
  };
}
