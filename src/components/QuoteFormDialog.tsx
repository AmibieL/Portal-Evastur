import { User, Phone, MapPin, Calendar, Users, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * PROPS DO MODAL
 */
interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * O CAPTURADOR DE LEADS (MODAL DE ORÇAMENTO)
 * 
 * Este modal é o ponto principal de conversão para vendas personalizadas.
 */
const QuoteFormDialog = ({ open, onOpenChange }: QuoteFormDialogProps) => {
  const { data: settings } = useSiteSettings();

  const [formData, setFormData] = useState({
    nome: '',
    celular: '',
    origem: '',
    destino: '',
    ida: '',
    volta: '',
    pessoas: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every(v => v.trim() !== '');

  /**
   * TRATAMENTO DO ENVIO
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const text = `Olá! Gostaria de solicitar um orçamento de viagem.
    
*Nome:* ${formData.nome}
*Celular:* ${formData.celular}
*Origem:* ${formData.origem}
*Destino:* ${formData.destino}
*Data de Ida:* ${new Date(formData.ida).toLocaleDateString("pt-BR")}
*Data de Volta:* ${new Date(formData.volta).toLocaleDateString("pt-BR")}
*Quantidade de Pessoas:* ${formData.pessoas}`;

    const wppLink = settings?.whatsappLink || 'https://wa.me/5568999872973';
    window.open(`${wppLink}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Monte seu orçamento
          </DialogTitle>
          <DialogDescription>
            Preencha todos os campos abaixo para enviar sua solicitação.
          </DialogDescription>
        </DialogHeader>

        {/* O formulário usa espaçamento vertical consistente (space-y-4) */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">

            {/* Nome Completo */}
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User size={12} />
                Nome Completo
              </Label>
              <Input
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Como devemos te chamar"
                required
              />
            </div>

            {/* Celular / WhatsApp */}
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Phone size={12} />
                Número de Celular
              </Label>
              <Input
                value={formData.celular}
                onChange={(e) => handleChange('celular', e.target.value)}
                placeholder="(68) 99255-2607"
                required
              />
            </div>

            {/* Cidade de Origem */}
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MapPin size={12} />
                Cidade de Origem
              </Label>
              <Input
                value={formData.origem}
                onChange={(e) => handleChange('origem', e.target.value)}
                placeholder="Cidade de saída"
                required
              />
            </div>

            {/* Destino Desejado */}
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MapPin size={12} />
                Destino
              </Label>
              <Input
                value={formData.destino}
                onChange={(e) => handleChange('destino', e.target.value)}
                placeholder="Para onde deseja ir?"
                required
              />
            </div>

            {/* Calendário de Ida */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Calendar size={12} />
                Data de Ida
              </Label>
              <Input
                value={formData.ida}
                onChange={(e) => handleChange('ida', e.target.value)}
                type="date"
                required
              />
            </div>

            {/* Calendário de Volta */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Calendar size={12} />
                Data de Volta
              </Label>
              <Input
                value={formData.volta}
                onChange={(e) => handleChange('volta', e.target.value)}
                type="date"
                required
              />
            </div>

            {/* Seletor de Passageiros */}
            <div className="col-span-2 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Users size={12} />
                Quantidade de Pessoas
              </Label>
              <Select value={formData.pessoas} onValueChange={(val) => handleChange('pessoas', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 pessoa">1 pessoa</SelectItem>
                  <SelectItem value="2 pessoas">2 pessoas</SelectItem>
                  <SelectItem value="3 pessoas">3 pessoas</SelectItem>
                  <SelectItem value="4 pessoas">4 pessoas</SelectItem>
                  <SelectItem value="5+ pessoas">5+ pessoas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botão de Envio (Estilo WhatsApp) */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full mt-2 py-3.5 px-6 rounded-lg gradient-whatsapp text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            Enviar para o WhatsApp
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteFormDialog;
