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
import { useState } from "react";

const QuoteForm = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const text = `Olá! Gostaria de solicitar um orçamento de viagem.
    
*Nome:* ${formData.nome || 'Não informado'}
*Celular:* ${formData.celular || 'Não informado'}
*Origem:* ${formData.origem || 'Não informado'}
*Destino:* ${formData.destino || 'Não informado'}
*Data de Ida:* ${formData.ida ? new Date(formData.ida).toLocaleDateString("pt-BR") : 'Não informado'}
*Data de Volta:* ${formData.volta ? new Date(formData.volta).toLocaleDateString("pt-BR") : 'Não informado'}
*Quantidade de Pessoas:* ${formData.pessoas || 'Não informado'}`;
    
    window.open(`https://wa.me/5568999872973?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-card rounded-2xl shadow-quote-card p-6 lg:p-8 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          <Send size={14} />
          SOLICITE AGORA
        </div>
        <h3 className="text-2xl font-bold text-primary">Monte seu orçamento</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informe os detalhes da viagem e nossa equipe retorna com sugestões personalizadas.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="border-border focus:border-primary"
            />
          </div>

          {/* Celular */}
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
              className="border-border focus:border-primary"
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
              className="border-border focus:border-primary"
            />
          </div>

          {/* Destino */}
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
              className="border-border focus:border-primary"
            />
          </div>

          {/* Data de Ida */}
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
              className="border-border focus:border-primary"
            />
          </div>

          {/* Data de Volta */}
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
              className="border-border focus:border-primary"
            />
          </div>

          {/* Quantidade de Pessoas */}
          <div className="col-span-2 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Users size={12} />
              Quantidade de Pessoas
            </Label>
            <Select value={formData.pessoas} onValueChange={(val) => handleChange('pessoas', val)}>
              <SelectTrigger className="border-border focus:border-primary">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full mt-4 py-3.5 px-6 rounded-lg gradient-whatsapp text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          Enviar para o WhatsApp
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
