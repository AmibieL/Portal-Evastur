import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, ShoppingBag, Users, TrendingUp, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * CONFIGURAÇÃO DE STATUS
 * 
 * Mapeia os status do banco de dados para labels amigáveis e cores.
 * Se adicionar um novo status no banco, precisa cadastrar aqui também.
 */
const statusConfig: Record<string, { label: string; color: string }> = {
  novo: { label: "Novo", color: "bg-blue-100 text-blue-700" },
  aguardando: { label: "Aguardando", color: "bg-amber-100 text-amber-700" },
  confirmado: { label: "Confirmado", color: "bg-emerald-100 text-emerald-700" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

/**
 * PÁGINA INICIAL DO ADMIN (O RESUMO DA ÓPERA)
 * 
 * Fala Juan! Aqui é onde o dono da agência olha pra ver se está ficando rico kkk.
 * Mostramos as vendas totais, reservas que precisam de atenção e o faturamento.
 * Se os números estiverem vermelhos, corre!
 */
export default function AdminDashboard() {
  // BUSCA DE RESERVAS
  const { data: reservations = [], isLoading: loadingRes } = useQuery({
    queryKey: ["admin-dashboard-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // BUSCA DE PACOTES ATIVOS (usado para o contador de pacotes)
  const { data: packages = [], isLoading: loadingPkg } = useQuery({
    queryKey: ["admin-dashboard-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id, active, status")
        .eq("active", true);
      if (error) throw error;
      return data;
    },
  });

  const isLoading = loadingRes || loadingPkg;

  // CÁLCULOS DOS INDICADORES (KPIs)
  const confirmedRes = reservations.filter((r) => r.status === "confirmado");
  const pendingRes = reservations.filter((r) => r.status === "novo" || r.status === "aguardando");
  
  // Soma o faturamento total apenas das reservas confirmadas
  const totalRevenue = confirmedRes.reduce((sum, r) => sum + Number(r.total_price), 0);
  
  // Taxa de conversão: (Confirmados / Total) * 100
  const conversionRate = reservations.length > 0
    ? ((confirmedRes.length / reservations.length) * 100).toFixed(1)
    : "0";

  // Lista de estatísticas para renderizar os cards lá embaixo
  const stats = [
    {
      icon: BarChart3,
      label: "Total de Vendas",
      value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: Clock,
      label: "Reservas Pendentes",
      value: pendingRes.length.toString(),
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: ShoppingBag,
      label: "Pacotes Ativos",
      value: packages.length.toString(),
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Taxa de Conversão",
      value: `${conversionRate}%`,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral do seu negócio</p>
      </div>

      {/* CARDS DE INDICADORES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ÁREA DE ATIVIDADE RECENTE (Últimas 8 reservas) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users size={20} />
            Atividade Recente
          </h3>
          <div className="divide-y">
            {reservations.slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                   {/* Nome do cliente e do pacote reservado */}
                  <span className="font-medium text-foreground">{r.client_name}</span>
                  <span className="text-sm text-muted-foreground ml-2">{r.package_name}</span>
                </div>
                <div className="flex items-center gap-3">
                   {/* Preço e Status com a badge colorida */}
                  <span className="font-semibold text-sm">
                    R$ {Number(r.total_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <Badge className={`${statusConfig[r.status]?.color || ""} text-xs border-0`}>
                    {statusConfig[r.status]?.label || r.status}
                  </Badge>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                Nenhuma atividade recente. As reservas aparecerão aqui.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
