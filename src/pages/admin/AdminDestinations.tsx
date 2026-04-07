import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { MapPin, Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DestinationFormSheet from "@/components/admin/DestinationFormSheet";

type Destination = Tables<"destinations">;

export default function AdminDestinations() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
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

  const upsertMutation = useMutation({
    mutationFn: async (dest: Partial<Destination> & { name: string; slug: string }) => {
      if (dest.id) {
        const { error } = await supabase
          .from("destinations")
          .update({
            name: dest.name,
            slug: dest.slug,
            subtitle: dest.subtitle,
            description: dest.description,
            cover_image_url: dest.cover_image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", dest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("destinations").insert({
          name: dest.name,
          slug: dest.slug,
          subtitle: dest.subtitle,
          description: dest.description,
          cover_image_url: dest.cover_image_url,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast({ title: editing ? "Destino atualizado!" : "Destino criado!" });
      setSheetOpen(false);
      setEditing(null);
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao salvar destino", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("destinations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast({ title: "Destino excluído!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    },
  });

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (dest: Destination) => {
    setEditing(dest);
    setSheetOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const handleSave = (dest: { name: string; slug: string; subtitle?: string; description?: string; cover_image_url?: string; id?: string }) => {
    upsertMutation.mutate(dest);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gerenciar Destinos</h1>
          <p className="text-muted-foreground text-sm">{destinations.length} destinos cadastrados</p>
        </div>
        <Button onClick={handleNew} className="gap-2">
          <Plus size={18} /> Novo Destino
        </Button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar destinos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : (
          <div className="divide-y">
            <div className="grid grid-cols-[60px_1fr_1fr_auto] items-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Capa</span>
              <span>Nome do Destino</span>
              <span>Slug</span>
              <span>Ações</span>
            </div>
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="grid grid-cols-[60px_1fr_1fr_auto] items-center px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                  {dest.cover_image_url ? (
                    <img src={dest.cover_image_url} alt={dest.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin size={16} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="font-medium text-foreground">{dest.name}</span>
                <span className="text-sm text-muted-foreground font-mono">/{dest.slug}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(dest)}>
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(dest.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && !isLoading && (
              <div className="py-12 text-center text-muted-foreground">
                Nenhum destino encontrado.
              </div>
            )}
          </div>
        )}
      </div>

      <DestinationFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        destination={editing}
        onSave={handleSave}
      />
    </div>
  );
}
