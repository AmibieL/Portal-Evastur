/**
 * ARQUIVO PRINCIPAL DE ROTAS — App.tsx
 *
 * Juan, aqui é onde TODAS as rotas do site são definidas.
 * Se precisar criar uma nova página, é aqui que você cadastra o caminho.
 *
 * ESTRUTURA:
 * - Páginas públicas: /, /destinos, /sobre, /contato, /pacote/:slug
 * - Área do cliente: /minha-conta, /carrinho, /checkout (precisa login)
 * - Painel admin: /admin/* (precisa role = 'admin' no perfil)
 *
 * PROVIDERS (envolvem todo o app):
 * - QueryClientProvider: cache de dados do TanStack Query
 * - AuthProvider: contexto de autenticação (useAuth)
 * - TooltipProvider: tooltips dos componentes shadcn/ui
 *
 * IMPORTANTE: sempre coloque rotas novas ACIMA da rota "*" (catch-all),
 * senão vão cair na página 404.
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";
import PackageDetails from "./pages/PackageDetails";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import { AuthProvider } from "./hooks/useAuth";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPacotes from "./pages/admin/AdminPacotes";
import AdminPackageForm from "./pages/admin/AdminPackageForm";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminCruzeiro from "./pages/admin/AdminCruzeiro";
import AdminFinanceiro from "./pages/admin/AdminFinanceiro";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";
import AdminVouchers from "./pages/admin/AdminVouchers";
import ClientTripDetails from "./pages/ClientTripDetails";
import CruzeiroCategoryDetails from "./pages/CruzeiroCategoryDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ContactPage from "./pages/ContactPage";
import NewsletterUnsubscribe from "./pages/NewsletterUnsubscribe";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/destinos" element={<Destinations />} />
            <Route path="/sobre" element={<AboutUs />} />
            <Route path="/destino/:slug" element={<DestinationDetails />} />
            <Route path="/pacote/:slug" element={<PackageDetails />} />
            <Route path="/cruzeiro/:slug" element={<CruzeiroCategoryDetails />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/minha-conta" element={<CustomerDashboard />} />
            <Route path="/minha-conta/viagem/:id" element={<ClientTripDetails />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pagamento/sucesso" element={<PaymentSuccessPage />} />
            <Route path="/pagamento/cancelado" element={<PaymentCancelPage />} />
            <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/cancelar-newsletter" element={<NewsletterUnsubscribe />} />
            <Route path="/confirmar-email" element={<EmailConfirmationPage />} />

            {/* ══════ Rotas do Painel Admin (protegidas pelo AdminLayout) ══════ */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pacotes" element={<AdminPacotes />} />
              <Route path="pacotes/novo" element={<AdminPackageForm />} />
              <Route path="pacotes/:id/editar" element={<AdminPackageForm />} />
              <Route path="destinos" element={<AdminDestinations />} />
              <Route path="reservas" element={<AdminReservations />} />
              <Route path="cruzeiro" element={<AdminCruzeiro />} />
              <Route path="financeiro" element={<AdminFinanceiro />} />
              <Route path="vouchers" element={<AdminVouchers />} />
              <Route path="configuracoes" element={<AdminConfiguracoes />} />
            </Route>

            {/* ATENÇÃO: Sempre adicionar rotas novas ACIMA desta rota catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
