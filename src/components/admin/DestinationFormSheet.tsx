import { useState, useEffect } from "react";
import { CloudUpload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import type { Tables } from "@/integrations/supabase/types";

// Tipo encurtado para facilitar o uso dos dados do banco
type Destination = Tables<"destinations">;

/**
 * FUNÇÃO PARA GERAR O SLUG
 * 
 * Transforma "Rio Croa" em "rio-croa".
 * Remove acentos, espaços e caracteres especiais para a URL ficar limpa.
 */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: Destination | null; // Se vier null, o formulário entende que é uma CRIAÇÃO
  onSave: (dest: { id?: string; name: string; slug: string; subtitle?: string; description?: string; cover_image_url?: string; gallery?: string[] }) => void;
}

/**
 * A FÁBRICA DE DESTINOS (AQUELA GAVETA DA DIREITA)
 * 
 * Juan, este é o componente que faz o "Slide-in" quando você clica em novo/editar destino.
 * Ele cuida do formulário, gera as URLs bonitinhas e faz o upload das fotos
 * pro storage do Supabase sem você precisar chorar kkk.
 */
export default function DestinationFormSheet({ open, onOpenChange, destination, onSave }: Props) {
  const isEditing = !!destination;

  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [slugManual, setSlugManual] = useState(false); // Pra saber se o usuário digitou o slug manualmente

  // Sempre que o destino muda (ou o formulário abre), resetamos os campos
  useEffect(() => {
    if (destination) {
      setName(destination.name);
      setSlug(destination.slug);
      setSubtitle(destination.subtitle || "");
      setDescription(destination.description || "");
      setCoverImageUrl(destination.cover_image_url || null);
      setSlugManual(true);
    } else {
      setName("");
      setSlug("");
      setSubtitle("");
      setDescription("");
      setCoverImageUrl(null);
      setGallery([]);
      setSlugManual(false);
    }
  }, [destination, open]);

  // Se o usuário digita o nome, o slug é gerado automaticamente (a menos que ele já tenha mexido no slug)
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManual) setSlug(slugify(value));
  };

  const handleSave = () => {
    onSave({
      id: destination?.id,
      name,
      slug,
      subtitle: subtitle || undefined,
      description: description || undefined,
      cover_image_url: coverImageUrl || undefined,
      gallery: gallery.length > 0 ? gallery : undefined,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? "Editar Destino" : "Novo Destino"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Atualize as informações do destino."
              : "Preencha os dados para criar um novo destino."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-1">
          {/* Campo Nome */}
          <div className="space-y-2">
            <Label htmlFor="dest-name">Nome do Destino</Label>
            <Input
              id="dest-name"
              placeholder="Ex: Rio Croa"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Campo Slug (URL) */}
          <div className="space-y-2">
            <Label htmlFor="dest-slug">Slug (URL)</Label>
            <Input
              id="dest-slug"
              placeholder="rio-croa"
              className="font-mono text-sm"
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Usado na URL: /destino/<strong>{slug || "..."}</strong>
            </p>
          </div>

          {/* Subtítulo */}
          <div className="space-y-2">
            <Label htmlFor="dest-subtitle">Subtítulo / Slogan</Label>
            <Input
              id="dest-subtitle"
              placeholder="Ex: O espelho d'água da Amazônia"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          {/* Descrição Longa */}
          <div className="space-y-2">
            <Label htmlFor="dest-description">História / Descrição</Label>
            <Textarea
              id="dest-description"
              placeholder="Conte a história e detalhes do destino..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Upload de Imagem de Capa */}
          <div className="space-y-2">
            <Label>Imagem de Capa (Hero)</Label>
            <ImageUpload
              bucket="destinations"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              onRemove={() => setCoverImageUrl(null)}
              label="Arraste a imagem de capa aqui"
            />
          </div>

          {/* Upload de Múltiplas Imagens (Galeria) */}
          <div className="space-y-2">
            <Label>Galeria de Fotos</Label>
            <MultiImageUpload
              bucket="galleries"
              values={gallery}
              onChange={setGallery}
            />
          </div>
        </div>

        <SheetFooter className="mt-6 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name || !slug}>
            {isEditing ? "Salvar Alterações" : "Criar Destino"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
