import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckSquare,
  ClipboardList,
  FileText,
  Image,
  Info,
  Map,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";

export interface ItineraryDayDraft {
  id: string;
  title: string;
  description: string;
}

export interface PackageDetailDraft {
  id: string;
  label: string;
  value: string;
}

export interface InclusionOption {
  key: string;
  label: string;
  emoji: string;
}

export function ProductFormSection({
  icon: Icon,
  title,
  description,
  children,
  color = "text-primary",
  iconBg = "bg-primary/10",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  color?: string;
  iconBg?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-4 border-b border-border/50 px-6 pb-4 pt-5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={18} className={color} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function ProductMediaSection({
  assetId,
  coverImageUrl,
  gallery,
  onCoverChange,
  onCoverRemove,
  onGalleryChange,
  onGalleryImageRemove,
}: {
  assetId: string;
  coverImageUrl: string | null;
  gallery: string[];
  onCoverChange: (url: string) => void;
  onCoverRemove: () => void;
  onGalleryChange: (urls: string[]) => void;
  onGalleryImageRemove: (url: string) => void;
}) {
  return (
    <ProductFormSection
      icon={Image}
      title="Imagens"
      description="Banner de capa e galeria de fotos do produto"
      color="text-violet-600"
      iconBg="bg-violet-50"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium">🖼️ Imagem do Banner (Hero)</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">Imagem panorâmica exibida no topo da página</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5">
              <span className="text-xs font-bold text-violet-700">1920 × 800px</span>
              <span className="text-[10px] font-medium text-violet-500">(recomendado)</span>
            </div>
          </div>

          {coverImageUrl && (
            <div className="relative overflow-hidden rounded-xl border border-border bg-slate-100" style={{ aspectRatio: "12/5" }}>
              <img src={coverImageUrl} alt="Preview do banner" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                  Preview do banner (como aparece no site)
                </span>
                <button
                  type="button"
                  onClick={onCoverRemove}
                  aria-label="Remover imagem de capa"
                  className="rounded-full bg-black/40 p-1.5 text-white/80 backdrop-blur-sm transition-colors hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}

          <ImageUpload
            bucket="packages"
            folder={`${assetId}/cover`}
            value={coverImageUrl}
            onChange={onCoverChange}
            onRemove={onCoverRemove}
            label="Arraste ou clique para enviar o banner"
          />

          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <Info size={14} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-700">
              <strong>Dica:</strong> use imagens horizontais de pelo menos <strong>1920×800px</strong>. A proporção ideal é <strong>12:5</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-border/50 pt-5">
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium">📸 Galeria de Fotos</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">Fotos adicionais exibidas na página de detalhes</p>
          </div>
          <MultiImageUpload
            bucket="packages"
            folder={`${assetId}/gallery`}
            values={gallery}
            onChange={onGalleryChange}
            onRemoveImage={onGalleryImageRemove}
          />
        </div>
      </div>
    </ProductFormSection>
  );
}

export function ProductDescriptionSection({
  shortValue,
  fullValue,
  onShortChange,
  onFullChange,
}: {
  shortValue: string;
  fullValue: string;
  onShortChange: (value: string) => void;
  onFullChange: (value: string) => void;
}) {
  return (
    <ProductFormSection
      icon={FileText}
      title="Descrição"
      description="Texto de apresentação do produto para o cliente"
      color="text-amber-600"
      iconBg="bg-amber-50"
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Resumo</Label>
          <p className="mb-2 text-xs text-muted-foreground">Aparece nos cards e na apresentação inicial do pacote (2–3 linhas)</p>
          <Textarea
            value={shortValue}
            onChange={(event) => onShortChange(event.target.value)}
            rows={3}
            placeholder="Resuma a experiência e seus principais atrativos..."
            className="resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Descrição completa</Label>
          <p className="mb-2 text-xs text-muted-foreground">Conte todos os detalhes do destino, da viagem ou da experiência diretamente no pacote</p>
          <Textarea
            value={fullValue}
            onChange={(event) => onFullChange(event.target.value)}
            rows={8}
            placeholder="Apresente o local, a experiência, os diferenciais e tudo que o cliente precisa saber..."
          />
        </div>
      </div>
    </ProductFormSection>
  );
}

export function ProductInclusionsSection({
  options,
  selectedKeys,
  onToggle,
}: {
  options: InclusionOption[];
  selectedKeys: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <ProductFormSection
      icon={CheckSquare}
      title="O que está incluso?"
      description="Selecione todos os itens incluídos no produto"
      color="text-emerald-600"
      iconBg="bg-emerald-50"
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selectedKeys.includes(option.key);
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onToggle(option.key)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                active
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-border text-muted-foreground hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <span>{option.emoji}</span>
              {option.label}
            </button>
          );
        })}
      </div>
      {selectedKeys.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{selectedKeys.length} item(s) selecionado(s)</p>}
    </ProductFormSection>
  );
}

export function ProductItinerarySection({
  days,
  onAdd,
  onRemove,
  onUpdate,
}: {
  days: ItineraryDayDraft[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "title" | "description", value: string) => void;
}) {
  return (
    <ProductFormSection
      icon={Map}
      title="Roteiro Dia a Dia"
      description="Descrição das atividades em cada dia (opcional)"
      color="text-rose-600"
      iconBg="bg-rose-50"
    >
      <div className="space-y-3">
        {days.map((day, index) => (
          <div key={day.id} className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                <span className="text-sm font-semibold text-foreground">Dia {index + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(day.id)}
                aria-label={`Remover dia ${index + 1}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <Input value={day.title} onChange={(event) => onUpdate(day.id, "title", event.target.value)} placeholder="Título do dia" className="h-10" />
            <Textarea
              value={day.description}
              onChange={(event) => onUpdate(day.id, "description", event.target.value)}
              placeholder="Descreva as atividades deste dia..."
              rows={3}
              className="resize-none"
            />
          </div>
        ))}

        {days.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border py-8 text-center">
            <Map size={28} className="mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Nenhum dia adicionado ainda</p>
          </div>
        )}

        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="w-full gap-2 border-dashed">
          <Plus size={14} />
          Adicionar dia ao roteiro
        </Button>
      </div>
    </ProductFormSection>
  );
}

export function ProductDetailsSection({
  items,
  onChange,
}: {
  items: PackageDetailDraft[];
  onChange: (items: PackageDetailDraft[]) => void;
}) {
  return (
    <ProductFormSection
      icon={ClipboardList}
      title="Detalhes do Produto"
      description="Informações adicionais como tarifa, bagagem e regras (opcional)"
      color="text-cyan-600"
      iconBg="bg-cyan-50"
    >
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Rótulo</Label>
                <Input
                  value={item.label}
                  onChange={(event) => onChange(items.map((current) => current.id === item.id ? { ...current, label: event.target.value } : current))}
                  placeholder="Ex: Tipo de tarifa"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Valor</Label>
                <Input
                  value={item.value}
                  onChange={(event) => onChange(items.map((current) => current.id === item.id ? { ...current, value: event.target.value } : current))}
                  placeholder="Ex: Bagagem inclusa"
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((current) => current.id !== item.id))}
              aria-label="Remover detalhe"
              className="mt-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/30 py-8 text-center">
            <ClipboardList size={28} className="mx-auto mb-2 text-cyan-300" />
            <p className="text-sm text-muted-foreground">Nenhum detalhe adicionado</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, { id: crypto.randomUUID(), label: "", value: "" }])}
          className="w-full gap-2 border-dashed border-cyan-300 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50"
        >
          <Plus size={14} />
          Adicionar detalhe
        </Button>
      </div>
    </ProductFormSection>
  );
}
