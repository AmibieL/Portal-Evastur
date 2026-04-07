import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Save, Building2, Palette, Bell, Shield, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AdminConfiguracoes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<Record<string, string>>({});

  const { isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const dict: Record<string, string> = {};
      data.forEach((row) => {
        dict[row.key] = row.value || "";
      });
      setSettings(dict);
      return dict;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: Record<string, string>) => {
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
      }));
      const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings-global"] });
      toast({ title: "Sucesso", description: "Configurações salvas!" });
    },
    onError: (err) => {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    mutation.mutate(settings);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie as informações e preferências da sua agência.
          </p>
        </div>
        <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2 self-start">
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar Tudo
        </Button>
      </div>

      <Tabs defaultValue="agency" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 h-auto py-2">
          <TabsTrigger value="agency" className="gap-2 text-xs sm:text-sm py-2">
            <Building2 size={14} />
            Agência
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2 text-xs sm:text-sm py-2">
            <Link2 size={14} />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 text-xs sm:text-sm py-2">
            <Bell size={14} />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2 text-xs sm:text-sm py-2">
            <Palette size={14} />
            SEO
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm py-2">
            <Shield size={14} />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Agency Tab */}
        <TabsContent value="agency">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da Agência</CardTitle>
              <CardDescription>Informações exibidas no site e nos documentos.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label>Nome da Agência</Label>
                <Input value={settings["company_name"] || ""} onChange={(e) => updateSetting("company_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>E-mail Corporativo</Label>
                <Input type="email" value={settings["company_email"] || ""} onChange={(e) => updateSetting("company_email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefone (Fixo/Outros)</Label>
                <Input value={settings["company_phone"] || ""} onChange={(e) => updateSetting("company_phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (com DDD)</Label>
                <Input value={settings["company_whatsapp"] || ""} onChange={(e) => updateSetting("company_whatsapp", e.target.value)} placeholder="Ex: 68999990000" />
              </div>
              <div className="space-y-2">
                <Label>Cadastur</Label>
                <Input value={settings["company_cadastur"] || ""} onChange={(e) => updateSetting("company_cadastur", e.target.value)} placeholder="AC.00.00.0000-0" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Endereço Completo</Label>
                <Input value={settings["company_address"] || ""} onChange={(e) => updateSetting("company_address", e.target.value)} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Descrição da Agência</Label>
                <Textarea rows={3} value={settings["company_description"] || ""} onChange={(e) => updateSetting("company_description", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Redes Sociais</CardTitle>
              <CardDescription>Links para as páginas sociais da agência exibidos no rodapé.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Link do Instagram</Label>
                <Input value={settings["social_instagram"] || ""} onChange={(e) => updateSetting("social_instagram", e.target.value)} placeholder="https://instagram.com/sua_agencia" />
              </div>
              <div className="space-y-2">
                <Label>Link do Facebook</Label>
                <Input value={settings["social_facebook"] || ""} onChange={(e) => updateSetting("social_facebook", e.target.value)} placeholder="https://facebook.com/sua_agencia" />
              </div>
              <div className="space-y-2">
                <Label>Link do YouTube</Label>
                <Input value={settings["social_youtube"] || ""} onChange={(e) => updateSetting("social_youtube", e.target.value)} placeholder="https://youtube.com/@sua_agencia" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferências de Notificação</CardTitle>
              <CardDescription>Controle quais alertas você recebe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Nova reserva por e-mail</p>
                  <p className="text-xs text-muted-foreground">Receba um e-mail a cada nova reserva.</p>
                </div>
                <Switch
                  checked={settings["notify_email_reservations"] === "true"}
                  onCheckedChange={(c) => updateSetting("notify_email_reservations", c ? "true" : "false")}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Cancelamento por e-mail</p>
                  <p className="text-xs text-muted-foreground">Alerta quando uma reserva é cancelada.</p>
                </div>
                <Switch
                  checked={settings["notify_email_cancellations"] === "true"}
                  onCheckedChange={(c) => updateSetting("notify_email_cancellations", c ? "true" : "false")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO e Meta Tags</CardTitle>
              <CardDescription>Configure como seu site aparece nos mecanismos de busca.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Título do Site (meta title)</Label>
                <Input value={settings["seo_title"] || ""} onChange={(e) => updateSetting("seo_title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descrição (meta description)</Label>
                <Textarea rows={3} value={settings["seo_description"] || ""} onChange={(e) => updateSetting("seo_description", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segurança e Acesso</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta administrativa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Aviso Legal</Label>
                <p className="text-sm text-muted-foreground">Somente usuários com nível de acesso Admin podem visualizar esta tela ou aplicar alterações nas configurações do sistema.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
