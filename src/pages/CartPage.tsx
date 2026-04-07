/**
 * PÁGINA DO CARRINHO — CartPage.tsx
 *
 * Juan, aqui o cliente vê todos os itens que adicionou ao carrinho.
 *
 * FUNCIONALIDADES:
 * - Lista itens com imagem, nome, duração, preço por pessoa
 * - Botões + e - para alterar quantidade de pessoas
 * - Botão de remover item do carrinho
 * - Mostra extras do cardápio (se pacote interno selecionou itens)
 * - Calcula subtotal (preço + extras) × pessoas
 * - Botão "Ir para o pagamento" → redireciona para /checkout
 *
 * IMPORTANTE:
 * - O cart_items tem campo menu_selections (JSON) com os itens do cardápio
 * - O campo travel_date no cart_item guarda a data escolhida pelo cliente
 *   ou a data definida pelo admin (depende do tipo de pacote)
 * - Invalidar query "cart-count" quando altera itens (Navbar atualiza)
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Trash2, Plus, Minus, Lock, Loader2, PackageSearch, Calendar, Users as UsersIcon, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          package:packages (
            id, title, slug, price, cover_image_url, duration
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
      queryClient.invalidateQueries({ queryKey: ["cart-count", user?.id] });
      toast.success("Item removido do carrinho");
    },
  });

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item: any) => {
      const price = item.package?.price || 0;
      const menuExtras = Array.isArray(item.menu_selections)
        ? (item.menu_selections as any[]).reduce((s: number, m: any) => s + Number(m.price || 0), 0)
        : 0;
      return total + (price + menuExtras) * item.people;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <ShoppingCart className="text-accent" />
              Meu Carrinho
            </h1>
            <p className="text-muted-foreground mt-2">
              Revise seus pacotes selecionados antes de solicitar o orçamento.
            </p>
          </header>

          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item: any, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-40 h-40 shrink-0">
                            <img 
                              src={item.package?.cover_image_url || "/placeholder.jpg"} 
                              alt={item.package?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h3 className="font-bold text-lg leading-tight transition-colors hover:text-primary">
                                  <Link to={`/pacote/${item.package?.slug}`}>{item.package?.title}</Link>
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {item.package?.duration || "Duração flexível"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <UsersIcon size={12} /> {item.people} Pessoas
                                  </span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive shrink-0"
                                onClick={() => removeItem.mutate(item.id)}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>

                            <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                              <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  disabled={item.people <= 1}
                                  onClick={() => updateQuantity.mutate({ id: item.id, people: item.people - 1 })}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-4 text-center text-sm font-bold">{item.people}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity.mutate({ id: item.id, people: item.people + 1 })}
                                >
                                  <Plus size={14} />
                                </Button>
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground px-1">Pessoas</span>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Subtotal</p>
                                {(() => {
                                  const menuExtras = Array.isArray(item.menu_selections)
                                    ? (item.menu_selections as any[]).reduce((s: number, m: any) => s + Number(m.price || 0), 0)
                                    : 0;
                                  const basePrice = item.package?.price || 0;
                                  return (
                                    <>
                                      {menuExtras > 0 && (
                                        <p className="text-xs text-orange-600">
                                          {formatBRL(basePrice)} + {formatBRL(menuExtras)} extras
                                        </p>
                                      )}
                                      <p className="text-xl font-bold text-primary">
                                        {formatBRL((basePrice + menuExtras) * item.people)}
                                      </p>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Menu selections */}
                            {Array.isArray(item.menu_selections) && item.menu_selections.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium mb-2">
                                  <UtensilsCrossed size={12} />
                                  <span>Itens do cardápio selecionados:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {(item.menu_selections as any[]).map((m: any, idx: number) => (
                                    <span key={idx} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 rounded-full px-2.5 py-0.5">
                                      {m.name} — {formatBRL(Number(m.price))}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-primary/10 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="font-bold text-lg border-b pb-3 text-primary">Resumo do Pedido</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Itens ({cartItems.length})</span>
                        <span>{formatBRL(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxas</span>
                        <span className="text-emerald-500 font-medium">Inclusas</span>
                      </div>
                      <div className="pt-3 border-t flex justify-between items-baseline">
                        <span className="font-bold">Total Estimado</span>
                        <span className="text-2xl font-black text-primary">
                          {formatBRL(calculateTotal())}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button 
                        className="w-full gap-2 h-12 text-lg shadow-md hover:shadow-lg transition-all bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={handleCheckout}
                      >
                        <Lock size={18} />
                        Finalizar Pagamento
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/destinos">Continuar selecionando</Link>
                      </Button>
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                      Pagamento 100% seguro via PIX, Crédito ou Débito. Seus dados estão protegidos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-transparent py-16">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <PackageSearch size={40} className="text-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-primary">Seu carrinho está vazio</h2>
                  <p className="text-muted-foreground max-w-sm">Parece que você ainda não escolheu seu próximo destino. Que tal dar uma olhada?</p>
                </div>
                <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                  <Link to="/destinos">Explorar Destinos</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
