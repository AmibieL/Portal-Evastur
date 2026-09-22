import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe2, Loader2, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCatalogDeleteErrorDescription } from "@/lib/catalogDeleteError";

type Destination = Tables<"destinations">;

const statusStyles: Record<string, string> = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-50 text-slate-600",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const regionLabels: Record<string, string> = {
  regional: "Regional",
  national: "Nacional",
  international: "Internacional",
};

export default function AdminDestinations() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Destination[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("destinations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast({ title: "Destino excluído." });
    },
    onError: (error) => {
      console.error("Erro ao excluir destino:", error);
      toast({
        title: "Erro ao excluir destino",
        description: getCatalogDeleteErrorDescription(error, "destination"),
        variant: "destructive",
      });
    },
  });

  const filtered = destinations.filter((destination) => {
    const term = search.toLowerCase();
    return destination.name.toLowerCase().includes(term)
      || destination.slug.toLowerCase().includes(term)
      || (destination.city || "").toLowerCase().includes(term);
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Catálogo</p>
          <h1 className="text-2xl font-bold text-foreground">Destinos turísticos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conteúdo editorial dos lugares apresentados e vendidos pela Evastur
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/destinos/novo"><Plus size={17} />Novo destino</Link>
        </Button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-foreground">{destinations.length}</p>
          <p className="text-xs text-muted-foreground">Destinos cadastrados</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-emerald-600">{destinations.filter((item) => item.publication_status === "published").length}</p>
          <p className="text-xs text-muted-foreground">Publicados</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-amber-600">{destinations.filter((item) => item.publication_status === "draft").length}</p>
          <p className="text-xs text-muted-foreground">Rascunhos</p>
        </div>
      </div>

      <div className="mb-5 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Buscar por nome, cidade ou slug..." />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={30} /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><MapPin size={23} /></div>
          <p className="font-medium text-foreground">Nenhum destino encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">{search ? "Tente outro termo de busca." : "Cadastre o primeiro destino turístico."}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((destination) => (
            <article key={destination.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative aspect-[16/9] bg-muted">
                {destination.cover_image_url ? (
                  <img src={destination.cover_image_url} alt={destination.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground"><Globe2 size={32} /></div>
                )}
                <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[destination.publication_status] || statusStyles.draft}`}>
                  {statusLabels[destination.publication_status] || destination.publication_status}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-foreground">{destination.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[destination.city, destination.state, destination.country].filter(Boolean).join(" · ") || "Localização não informada"}
                    </p>
                  </div>
                  {destination.region_type && (
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      {regionLabels[destination.region_type] || destination.region_type}
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {destination.summary || destination.subtitle || "Sem resumo cadastrado."}
                </p>
                <div className="mt-4 flex gap-2 border-t border-border pt-4">
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
                    <Link to={`/admin/destinos/${destination.id}/editar`}><Pencil size={14} />Editar</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      if (window.confirm(`Excluir o destino "${destination.name}"? Os vínculos dele com pacotes serão removidos, mas os pacotes serão mantidos.`)) {
                        deleteMutation.mutate(destination.id);
                      }
                    }}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
