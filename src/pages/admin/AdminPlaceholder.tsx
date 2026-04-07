import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const titles: Record<string, string> = {
  "/admin/reservas": "Reservas",
  "/admin/financeiro": "Financeiro",
  "/admin/configuracoes": "Configurações",
};

export default function AdminPlaceholder() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "Página";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground text-sm mt-1">Em breve disponível</p>
      </div>
      <Card>
        <CardContent className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Esta seção está em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
