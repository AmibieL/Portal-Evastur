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
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { AuthProvider } from "./hooks/useAuth";
import BrandPreloader from "./components/BrandPreloader";

const AboutUs = lazy(() => import("./pages/AboutUs"));
const Destinations = lazy(() => import("./pages/Destinations"));
const PackageDetails = lazy(() => import("./pages/PackageDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPacotes = lazy(() => import("./pages/admin/AdminPacotes"));
const AdminPackageForm = lazy(() => import("./pages/admin/AdminPackageForm"));
const AdminExternalPackageForm = lazy(() => import("./pages/admin/AdminExternalPackageForm"));
const AdminRegionalExperienceForm = lazy(() => import("./pages/admin/AdminRegionalExperienceForm"));
const AdminReservations = lazy(() => import("./pages/admin/AdminReservations"));
const AdminFinanceiro = lazy(() => import("./pages/admin/AdminFinanceiro"));
const AdminConfiguracoes = lazy(() => import("./pages/admin/AdminConfiguracoes"));
const AdminVouchers = lazy(() => import("./pages/admin/AdminVouchers"));
const ClientTripDetails = lazy(() => import("./pages/ClientTripDetails"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("./pages/PaymentCancelPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NewsletterUnsubscribe = lazy(() => import("./pages/NewsletterUnsubscribe"));
const EmailConfirmationPage = lazy(() => import("./pages/EmailConfirmationPage"));
const RegionalExperiences = lazy(() => import("./pages/RegionalExperiences"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrandPreloader />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" aria-label="Carregando página" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/destinos" element={<Destinations />} />
              <Route path="/cruzeiro-do-sul" element={<RegionalExperiences />} />
              <Route path="/sobre" element={<AboutUs />} />
              <Route path="/destino/:slug" element={<Navigate to="/destinos" replace />} />
              <Route path="/pacote/:slug" element={<PackageDetails />} />
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
                <Route path="pacotes/novo" element={<AdminExternalPackageForm />} />
                <Route path="pacotes/:id/editar" element={<AdminPackageForm />} />
                <Route path="pacotes/externos" element={<AdminPacotes packageType="external" />} />
                <Route path="pacotes/externos/novo" element={<AdminExternalPackageForm />} />
                <Route path="pacotes/externos/:id/editar" element={<AdminExternalPackageForm />} />
                <Route path="pacotes/regionais" element={<AdminPacotes packageType="regional" />} />
                <Route path="pacotes/regionais/novo" element={<AdminRegionalExperienceForm />} />
                <Route path="pacotes/regionais/:id/editar" element={<AdminRegionalExperienceForm />} />
                <Route path="destinos/*" element={<Navigate to="/admin/pacotes/regionais" replace />} />
                <Route path="reservas" element={<AdminReservations />} />
                <Route path="financeiro" element={<AdminFinanceiro />} />
                <Route path="vouchers" element={<AdminVouchers />} />
                <Route path="configuracoes" element={<AdminConfiguracoes />} />
              </Route>

              {/* ATENÇÃO: Sempre adicionar rotas novas ACIMA desta rota catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
