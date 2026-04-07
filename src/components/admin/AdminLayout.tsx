/**
 * LAYOUT DO PAINEL ADMIN — AdminLayout.tsx
 *
 * Juan, este componente é o "esqueleto" de todas as páginas /admin/*.
 * Ele renderiza a sidebar à esquerda e o conteúdo (<Outlet />) à direita.
 *
 * PROTEÇÃO DE ACESSO:
 * - Se não está logado → redireciona para /login
 * - Se logado mas NÃO é admin (role !== 'admin') → redireciona para /minha-conta
 * - Enquanto carrega, mostra um spinner
 *
 * SIDEBAR:
 * - Desktop: fixa à esquerda (w-60), sempre visível
 * - Mobile: botão hamburger abre um Sheet lateral
 * - Itens: Painel, Pacotes, Reservas, Vouchers, Cruzeiro do Sul, Financeiro
 *
 * Se precisar adicionar uma nova seção admin, adicione ao array navItems
 * E crie a rota correspondente em App.tsx
 */
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  DollarSign,
  Menu,
  LogOut,
  Mountain,
  ChevronRight,
  Ticket,
} from "lucide-react";
import logoEvastur from "@/assets/logo-evastur.png";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  {
    title: "Painel",
    icon: LayoutDashboard,
    path: "/admin",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    title: "Pacotes",
    icon: Package,
    path: "/admin/pacotes",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    title: "Reservas",
    icon: ClipboardList,
    path: "/admin/reservas",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    title: "Vouchers",
    icon: Ticket,
    path: "/admin/vouchers",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    title: "Cruzeiro do Sul",
    icon: Mountain,
    path: "/admin/cruzeiro",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    path: "/admin/financeiro",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
];

function SidebarContent({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate?: () => void;
}) {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    navigate("/login", { replace: true });
    if (onNavigate) onNavigate();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, hsl(232 45% 11%) 0%, hsl(232 40% 8%) 100%)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link
          to="/admin"
          className="flex items-center gap-3"
          onClick={onNavigate}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "hsl(350 100% 45%)" }}
          >
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate leading-none">
              Evastur
            </p>
            <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase mt-0.5">
              Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isExact = item.path === "/admin";
          const active = isExact
            ? currentPath === "/admin"
            : currentPath.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  active ? item.bg : "bg-white/5 group-hover:bg-white/8"
                )}
              >
                <item.icon
                  size={16}
                  className={active ? item.color : "text-white/40 group-hover:text-white/60"}
                />
              </div>
              <span>{item.title}</span>
              {active && (
                <ChevronRight size={14} className="ml-auto text-white/30" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-5 border-t border-white/5 pt-4 space-y-1">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white"
            style={{ background: "hsl(350 100% 45%)" }}
          >
            {profile?.full_name?.charAt(0)?.toUpperCase() ||
              user?.email?.charAt(0)?.toUpperCase() ||
              "A"}
          </div>
          <div className="min-w-0">
            <p className="text-white/80 text-sm font-medium truncate leading-none">
              {profile?.full_name || "Admin"}
            </p>
            <p className="text-white/30 text-xs truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <LogOut size={15} className="text-white/40" />
          </div>
          Sair da conta
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login", { replace: true });
      else if (profile && profile.role !== "admin")
        navigate("/minha-conta", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  if (loading || !profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 shadow-xl z-30">
        <SidebarContent currentPath={location.pathname} />
      </aside>

      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4 border-b border-white/5"
        style={{
          background: "hsl(232 45% 11%)",
        }}
      >
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="text-white/60 hover:text-white transition-colors">
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0 border-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SidebarContent
              currentPath={location.pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <img src={logoEvastur} alt="Evastur" className="h-7 w-auto object-contain" />
        </div>
        <div className="w-6" />
      </header>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
