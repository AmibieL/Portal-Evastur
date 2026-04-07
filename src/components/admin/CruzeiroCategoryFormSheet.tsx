import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import type { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Estendemos o tipo para incluir a galeria de imagens que vem de uma lógica customizada
type CruzeiroCategory = Tables<"cruzeiro_categories"> & { gallery_images?: string[] };

/**
 * UTILS: GERADOR DE SLUG
 * Gera o "link" amigável a partir do título (ex: "Rio Croa" -> "rio-croa")
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
    category: CruzeiroCategory | null; // Se for null, estamos criando uma nova categoria
    onSave: (cat: Omit<CruzeiroCategory, "created_at">) => void;
}

/**
 * O PORTAL DO CRUZEIRO (ADMIN STYLE)
 * 
 * Juan, este aqui é exclusivo para as categorias de Cruzeiro do Sul.
 * Ele permite que você vincule pacotes específicos a cada ponto turístico.
 * Se o pessoal de CS reclamar que sumiu algo, o culpado provavelmente está aqui kkk.
 */
export default function CruzeiroCategoryFormSheet({ open, onOpenChange, category, onSave }: Props) {
    const isEditing = !!category;

    // Estados locais do formulário
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [assignedPackages, setAssignedPackages] = useState<string[]>([]);
    const [slugManual, setSlugManual] = useState(false);

    // Buscamos apenas pacotes da categoria 'interno' para vincular
    const { data: availablePackages = [] } = useQuery({
        queryKey: ["admin-interno-packages"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("packages")
                .select("id, title")
                .eq("category", "interno")
                .eq("active", true)
                .order("title");
            if (error) throw error;
            return data;
        },
        enabled: open, // Só roda a busca quando o formulário é aberto
    });

    // Resetamos o formulário sempre que ele abre ou muda de categoria
    useEffect(() => {
        if (category) {
            setTitle(category.title);
            setSlug(category.slug);
            setDescription(category.description || "");
            setImageUrl(category.image_url || null);
            setGalleryImages((category as any).gallery_images || []);
            setAssignedPackages(category.assigned_packages || []);
            setSlugManual(true);
        } else {
            setTitle("");
            setSlug("");
            setDescription("");
            setImageUrl(null);
            setGalleryImages([]);
            setAssignedPackages([]);
            setSlugManual(false);
        }
    }, [category, open]);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!slugManual) setSlug(slugify(value));
    };

    // Função para marcar/desmarcar pacotes relacionados
    const togglePackage = (id: string) => {
        setAssignedPackages((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (!title || !slug) return;
        onSave({
            id: category?.id || "",
            title,
            slug,
            description: description || null,
            image_url: imageUrl || null,
            gallery_images: galleryImages,
            assigned_packages: assignedPackages,
            sort_order: category?.sort_order || 0,
        } as any);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? "Atualize as informações da categoria do Cruzeiro do Sul."
                            : "Crie um novo destaque para a área Visite Cruzeiro do Sul."}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 px-1 pb-28">
                    {/* Título da Categoria */}
                    <div className="space-y-2">
                        <Label htmlFor="cat-title">Título (Ex: Rio Croa)</Label>
                        <Input
                            id="cat-title"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />
                    </div>

                    {/* Slug (URL amigável) */}
                    <div className="space-y-2">
                        <Label htmlFor="cat-slug">Slug (URL)</Label>
                        <Input
                            id="cat-slug"
                            value={slug}
                            onChange={(e) => {
                                setSlug(e.target.value);
                                setSlugManual(true);
                            }}
                        />
                    </div>

                    {/* Descrição resumida */}
                    <div className="space-y-2">
                        <Label htmlFor="cat-desc">Descrição / Subtítulo</Label>
                        <Textarea
                            id="cat-desc"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Espelho d'água da Amazônia"
                        />
                    </div>

                    {/* Imagem de Capa (usada no fundo do banner) */}
                    <div className="space-y-2">
                        <Label>Imagem de Capa</Label>
                        <p className="text-xs text-muted-foreground">Foto principal exibida no hero da categoria.</p>
                        <ImageUpload
                            bucket="galleries"
                            value={imageUrl || undefined}
                            onChange={setImageUrl}
                        />
                    </div>

                    {/* Galeria lateral ou carrossel */}
                    <div className="space-y-2">
                        <Label>Galeria de Fotos</Label>
                        <p className="text-xs text-muted-foreground">
                            Adicione fotos do local para exibir em carrossel antes dos destinos relacionados.
                        </p>
                        <MultiImageUpload
                            bucket="galleries"
                            values={galleryImages}
                            onChange={setGalleryImages}
                        />
                        {galleryImages.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {galleryImages.length} foto{galleryImages.length !== 1 ? "s" : ""} adicionada{galleryImages.length !== 1 ? "s" : ""}.
                            </p>
                        )}
                    </div>

                    {/* Seleção de Pacotes daquela localidade */}
                    <div className="space-y-2 pt-2">
                        <Label>Pacotes Relacionados</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                            Selecione os pacotes que serão listados ao abrir esta categoria.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {availablePackages.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => togglePackage(pkg.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${assignedPackages.includes(pkg.id)
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border text-muted-foreground hover:border-primary/40"
                                        }`}
                                >
                                    {pkg.title}
                                </button>
                            ))}
                            {availablePackages.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">Nenhum pacote interno ativo no momento.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full" onClick={handleSave} disabled={!title || !slug}>
                            {isEditing ? "Salvar Alterações" : "Criar Categoria"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
