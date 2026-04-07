import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CruzeiroCategoryFormSheet from "@/components/admin/CruzeiroCategoryFormSheet";
import { Card, CardContent } from "@/components/ui/card";

type CruzeiroCategory = Tables<"cruzeiro_categories">;

export default function AdminCruzeiro() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<CruzeiroCategory | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Busca as categorias de Cruzeiro do Sul
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-cruzeiro-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cruzeiro_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CruzeiroCategory[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (cat: Omit<CruzeiroCategory, "created_at">) => {
      if (cat.id) {
        const { error } = await supabase
          .from("cruzeiro_categories")
          .update({
            title: cat.title,
            slug: cat.slug,
            description: cat.description,
            image_url: cat.image_url,
            gallery_images: (cat as any).gallery_images || [],
            assigned_packages: cat.assigned_packages,
            sort_order: cat.sort_order,
          })
          .eq("id", cat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cruzeiro_categories").insert({
          title: cat.title,
          slug: cat.slug,
          description: cat.description,
          image_url: cat.image_url,
          gallery_images: (cat as any).gallery_images || [],
          assigned_packages: cat.assigned_packages,
          sort_order: categories.length,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cruzeiro-categories"] });
      toast({ title: editing ? "Categoria atualizada!" : "Categoria criada!" });
      setSheetOpen(false);
      setEditing(null);
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cruzeiro_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cruzeiro-categories"] });
      toast({ title: "Categoria excluída com sucesso" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    },
  });

  const filtered = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (cat: CruzeiroCategory) => {
    setEditing(cat);
    setSheetOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const handleSave = (cat: Omit<CruzeiroCategory, "created_at">) => {
    upsertMutation.mutate(cat);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cruzeiro do Sul</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os mosaicos (categorias) exibidos na seção Visite Cruzeiro do Sul
          </p>
        </div>
        <Button onClick={handleNew} className="gap-2 w-full sm:w-auto">
          <Plus size={16} />
          Nova Categoria
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar categorias..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Nenhuma categoria encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <Card key={cat.id} className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors">
              <div className="aspect-video w-full bg-muted relative">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Sem imagem
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {cat.description || "Nenhuma descrição informada."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground bg-secondary inline-flex px-2 py-1 rounded-md">
                      {cat.assigned_packages?.length || 0} pacotes
                    </span>
                    {(cat as any).gallery_images?.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-secondary inline-flex px-2 py-1 rounded-md">
                        {(cat as any).gallery_images.length} foto{(cat as any).gallery_images.length !== 1 ? "s" : ""} na galeria
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleEdit(cat)}>
                    <Pencil size={14} />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
                        deleteMutation.mutate(cat.id);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CruzeiroCategoryFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={editing}
        onSave={handleSave}
      />
    </div>
  );
}
