/**
 * BARRA DE NAVEGAÇÃO PRINCIPAL — Navbar.tsx
 *
 * Juan, este componente aparece em TODAS as páginas do site.
 *
 * FUNCIONALIDADES:
 * - Logo + links de navegação (Início, Destinos, Sobre, Contato)
 * - Botão de carrinho com contador de itens (só se logado)
 * - Menu do usuário com avatar (dropdown desktop, sheet mobile)
 * - Links rápidos: Meu Perfil, Minhas Viagens, Favoritos, Carrinho
 * - Botão de sair
 * - Menu hamburger para mobile (Sheet do shadcn)
 *
 * IMPORTANTE:
 * - O cartão do carrinho abre como um Sheet lateral (CartSheet)
 * - O role 'admin' redireciona "Meu Perfil" para /admin
 * - O contador de itens vem via query "cart-count"
 */
import { useState } from "react";
import { Home, MapPin, Info, LogIn, Menu, X, LogOut, User as UserIcon, ShoppingCart, Plane, Heart, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartSheet } from "@/components/CartSheet";
import logoEvastur from "@/assets/logo-evastur.png";

const Navbar = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isHome = location.pathname === "/";
  const isDestinos = location.pathname === "/destinos";

  const { data: cartCount = 0 } = useQuery({
    queryKey: ["cart-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      
      if (error) throw error;
      return count || 0;
    },
  });
  const isAbout = location.pathname === "/sobre";
  const [open, setOpen] = useState(false);

  const isContato = location.pathname === "/contato";

  const navLinks = [
    { to: "/", label: "Início", icon: Home, active: isHome },
    { to: "/destinos", label: "Destinos", icon: MapPin, active: isDestinos },
    { to: "/sobre", label: "Sobre nós", icon: Info, active: isAbout },
    { to: "/contato", label: "Contato", icon: Headphones, active: isContato },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-nav">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo da Evastur */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logoEvastur} 
              alt="Evastur Viagens" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Links de Navegação — Centro (só aparece no desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${link.active
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botões de Autenticação / Perfil — Direita */}
          <div className="flex items-center gap-2">
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-evastur-red text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            )}

            {user ? (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full border border-border overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-3">
                      <p className="text-sm font-medium leading-none truncate">{profile?.full_name || "Usuário"}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer py-2">
                      <Link to={profile?.role === "admin" ? "/admin" : "/minha-conta"}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    {profile?.role !== "admin" && (
                      <>
                        <DropdownMenuItem asChild className="cursor-pointer py-2">
                          <Link to="/minha-conta">
                            <Plane className="mr-2 h-4 w-4" />
                            Minhas Viagens
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer py-2">
                          <Link to="/minha-conta?tab=favoritos">
                            <Heart className="mr-2 h-4 w-4" />
                            Meus Favoritos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer py-2">
                          <Link to="/carrinho">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Meu Carrinho
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50" onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair da conta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <Link to="/login">
                    <LogIn size={16} />
                    Entrar
                  </Link>
                </Button>
                <Button className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                  <Link to="/login?tab=register">Criar conta</Link>
                </Button>
              </>
            )}

            {/* Botão do Menu Mobile (hamburger) */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full overflow-y-auto">
                  {/* Cabeçalho do Menu Mobile */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <img 
                      src={logoEvastur} 
                      alt="Evastur" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Links de Navegação Mobile */}
                  <div className="flex-1 py-4 px-4 space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${link.active
                            ? "bg-secondary text-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                          }`}
                      >
                        <link.icon size={20} />
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Área de Perfil / Autenticação Mobile */}
                  <div className="p-4 border-t shrink-0">
                    {user ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-2 py-2 mb-2 bg-secondary/30 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">{profile?.full_name || "Usuário"}</span>
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Link to={profile?.role === "admin" ? "/admin" : "/minha-conta"} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all">
                            <UserIcon size={20} /> Meu Perfil
                          </Link>
                          {profile?.role !== "admin" && (
                            <>
                              <Link to="/minha-conta" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all">
                                <Plane size={20} /> Minhas Viagens
                              </Link>
                              <Link to="/minha-conta?tab=favoritos" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all">
                                <Heart size={20} /> Meus Favoritos
                              </Link>
                            </>
                          )}
                          <Link to="/minha-conta?tab=carrinho" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all">
                            <ShoppingCart size={20} /> Carrinho
                          </Link>
                          <button onClick={() => { setOpen(false); signOut(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50/50 transition-all text-left">
                            <LogOut size={20} /> Sair da conta
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <Link to="/login" onClick={() => setOpen(false)}>
                            <LogIn size={16} />
                            Entrar
                          </Link>
                        </Button>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                          <Link to="/login?tab=register" onClick={() => setOpen(false)}>Criar conta</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </nav>
  );
};

export default Navbar;
