/**
 * MINI CARRINHO LATERAL — CartSheet.tsx
 *
 * Juan, este é o "carrinhozinho" que abre como panelinha lateral (Sheet)
 * quando o cliente clica no ícone de carrinho na Navbar.
 *
 * É uma versão simplificada do CartPage.tsx:
 * - Lista itens com imagem, preço, botões +/- para pessoas
 * - Mostra total estimado
 * - Botão "Finalizar Orçamento" → redireciona para /carrinho (CartPage completo)
 *
 * DIFERENÇA DO CartPage:
 * - CartSheet = preview rápido (menos detalhes, sem extras de cardápio)
 * - CartPage = versão completa com mais info e seleções
 *
 * Ambos usam a mesma query "cart" para compartilhar cache no TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Plus, Minus, Loader2, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          package:packages (
            id, title, slug, price, cover_image_url
          )
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity, people }: { id: string; quantity?: number; people?: number }) => {
      const updates: any = {};
      if (quantity !== undefined) updates.quantity = Math.max(1, quantity);
      if (people !== undefined) updates.people = Math.max(1, people);

      const { error } = await supabase
        .from("cart_items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast.success("Item removido do carrinho");
    },
  });

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item: any) => {
      const price = item.package?.price || 0;
      return total + price * item.people;
    }, 0);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <SheetTitle>Meu Carrinho</SheetTitle>
          </div>
          <SheetDescription>
            {cartItems.length} {cartItems.length === 1 ? "item selecionado" : "itens selecionados"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cartItems.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border">
                      <img 
                        src={item.package?.cover_image_url || "/placeholder.jpg"} 
                        alt={item.package?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.package?.title}</h4>
                      <p className="text-primary font-bold">{formatBRL(item.package?.price || 0)} <span className="text-xs text-muted-foreground font-normal">/ pessoa</span></p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 bg-muted/50 rounded-md px-2 py-1">
                          <button 
                            onClick={() => updateQuantity.mutate({ id: item.id, people: item.people - 1 })}
                            className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                            disabled={item.people <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">{item.people}</span>
                          <button 
                            onClick={() => updateQuantity.mutate({ id: item.id, people: item.people + 1 })}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <span className="text-[10px] uppercase text-muted-foreground ml-1">Pessoas</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <PackageSearch size={32} className="text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Seu carrinho está vazio</p>
                <p className="text-sm text-muted-foreground/60">Explore nossos pacotes e escolha sua próxima aventura.</p>
              </div>
              <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                <Link to="/destinos">Ver destinos</Link>
              </Button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="p-6 border-t bg-muted/20 shrink-0">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Total estimado</span>
                <span className="text-xl font-bold text-primary">{formatBRL(calculateTotal())}</span>
              </div>
              <Button className="w-full" asChild onClick={() => onOpenChange(false)}>
                <Link to="/carrinho" className="flex items-center gap-2">
                  Finalizar Orçamento
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
