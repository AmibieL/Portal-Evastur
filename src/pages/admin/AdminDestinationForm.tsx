import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Image as ImageIcon,
  Info,
  Loader2,
  Map,
  MapPin,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import {
  ImageUpload,
  MultiImageUpload,
} from "@/components/ImageUpload";
import { getStoragePathFromPublicUrl, removeStorageImages } from "@/lib/storageImages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Destination = Tables<"destinations">;

type HighlightDraft = {
  id: string;
  title: string;
  description: string;
};

type ItineraryDraft = {
  id: string;
  title: string;
  description: string;
};

type PackageOption = Pick<Tables<"packages">, "id" | "title" | "package_type">;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Info;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-start gap-3 border-b border-border/60 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function AdminDestinationForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [destinationAssetId] = useState(() => id || crypto.randomUUID());

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [regionType, setRegionType] = useState("regional");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Acre");
  const [country, setCountry] = useState("Brasil");
  const [accessInfo, setAccessInfo] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<HighlightDraft[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDraft[]>([]);
  const [relatedPackageIds, setRelatedPackageIds] = useState<string[]>([]);
  const [publicationStatus, setPublicationStatus] = useState("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [packageSearch, setPackageSearch] = useState("");

  const queueImageRemoval = (url: string | null) => {
    if (!url) return;
    setRemovedImageUrls((urls) => urls.includes(url) ? urls : [...urls, url]);
  };

  const handleCoverImageChange = (url: string) => {
    if (coverImageUrl && coverImageUrl !== url) queueImageRemoval(coverImageUrl);
    setCoverImageUrl(url);
  };

  const handleCoverImageRemove = () => {
    queueImageRemoval(coverImageUrl);
    setCoverImageUrl(null);
  };

  const { data: initialData, isLoading } = useQuery({
    queryKey: ["admin-destination-edit", id],
    enabled: isEditing,
    queryFn: async () => {
      const [destinationResult, galleryResult, highlightsResult, itineraryResult, relationsResult] = await Promise.all([
        supabase.from("destinations").select("*").eq("id", id!).single(),
        supabase.from("destination_gallery").select("*").eq("destination_id", id!).order("sort_order"),
        supabase.from("destination_highlights").select("*").eq("destination_id", id!).order("sort_order"),
        supabase.from("destination_itinerary_days").select("*").eq("destination_id", id!).order("day_number"),
        supabase.from("package_destinations").select("package_id, is_primary").eq("destination_id", id!),
      ]);

      if (destinationResult.error) throw destinationResult.error;
      if (galleryResult.error) throw galleryResult.error;
      if (highlightsResult.error) throw highlightsResult.error;
      if (itineraryResult.error) throw itineraryResult.error;
      if (relationsResult.error) throw relationsResult.error;

      return {
        destination: destinationResult.data,
        gallery: galleryResult.data,
        highlights: highlightsResult.data,
        itinerary: itineraryResult.data,
        relations: relationsResult.data,
      };
    },
  });

  const { data: packageOptions = [] } = useQuery({
    queryKey: ["admin-destination-package-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id, title, package_type")
        .order("title");
      if (error) throw error;
      return data as PackageOption[];
    },
  });

  useEffect(() => {
    if (!initialData) return;

    const destination: Destination = initialData.destination;
    setName(destination.name);
    setSlug(destination.slug);
    setSlugManual(true);
    setSubtitle(destination.subtitle || "");
    setSummary(destination.summary || "");
    setDescription(destination.description || "");
    setRegionType(destination.region_type || "regional");
    setCity(destination.city || "");
    setState(destination.state || "Acre");
    setCountry(destination.country || "Brasil");
    setAccessInfo(destination.access_info || "");
    setRecommendations(destination.recommendations || "");
    setCoverImageUrl(destination.cover_image_url || null);
    setPublicationStatus(destination.publication_status || "draft");
    setSeoTitle(destination.seo_title || "");
    setSeoDescription(destination.seo_description || "");
    setGallery(initialData.gallery.map((image) => image.image_url));
    setHighlights(initialData.highlights.map((highlight) => ({
      id: highlight.id,
      title: highlight.title,
      description: highlight.description || "",
    })));
    setItinerary(initialData.itinerary.map((day) => ({
      id: day.id,
      title: day.title,
      description: day.description || "",
    })));
    setRelatedPackageIds(initialData.relations.map((relation) => relation.package_id));
  }, [initialData]);

  const filteredPackageOptions = useMemo(() => {
    const search = packageSearch.trim().toLowerCase();
    return packageOptions.filter((option) => !search || option.title.toLowerCase().includes(search));
  }, [packageOptions, packageSearch]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const destinationData: TablesInsert<"destinations"> = {
        name: name.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim() || null,
        summary: summary.trim() || null,
        description: description.trim() || null,
        region_type: regionType,
        city: city.trim() || null,
        state: state.trim() || null,
        country: country.trim() || "Brasil",
        access_info: accessInfo.trim() || null,
        recommendations: recommendations.trim() || null,
        cover_image_url: coverImageUrl,
        cover_image_path: getStoragePathFromPublicUrl(coverImageUrl, "destinations"),
        publication_status: publicationStatus,
        active: publicationStatus === "published",
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let destinationId = id;

      if (isEditing) {
        const { error } = await supabase
          .from("destinations")
          .update(destinationData)
          .eq("id", id!);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("destinations")
          .insert({ ...destinationData, id: destinationAssetId })
          .select("id")
          .single();
        if (error) throw error;
        destinationId = data.id;
      }

      if (!destinationId) throw new Error("Não foi possível identificar o destino salvo.");

      const galleryDelete = await supabase.from("destination_gallery").delete().eq("destination_id", destinationId);
      if (galleryDelete.error) throw galleryDelete.error;
      if (gallery.length > 0) {
        const { error } = await supabase.from("destination_gallery").insert(
          gallery.map((imageUrl, index) => ({
            destination_id: destinationId,
            image_url: imageUrl,
            storage_path: getStoragePathFromPublicUrl(imageUrl, "galleries"),
            alt_text: `${name} — foto ${index + 1}`,
            sort_order: index + 1,
          }))
        );
        if (error) throw error;
      }

      const highlightsDelete = await supabase.from("destination_highlights").delete().eq("destination_id", destinationId);
      if (highlightsDelete.error) throw highlightsDelete.error;
      const validHighlights = highlights.filter((highlight) => highlight.title.trim());
      if (validHighlights.length > 0) {
        const { error } = await supabase.from("destination_highlights").insert(
          validHighlights.map((highlight, index) => ({
            destination_id: destinationId,
            title: highlight.title.trim(),
            description: highlight.description.trim() || null,
            sort_order: index + 1,
          }))
        );
        if (error) throw error;
      }

      const itineraryDelete = await supabase.from("destination_itinerary_days").delete().eq("destination_id", destinationId);
      if (itineraryDelete.error) throw itineraryDelete.error;
      const validItinerary = itinerary.filter((day) => day.title.trim());
      if (validItinerary.length > 0) {
        const { error } = await supabase.from("destination_itinerary_days").insert(
          validItinerary.map((day, index) => ({
            destination_id: destinationId,
            day_number: index + 1,
            title: day.title.trim(),
            description: day.description.trim() || null,
          }))
        );
        if (error) throw error;
      }

      const relationsDelete = await supabase.from("package_destinations").delete().eq("destination_id", destinationId);
      if (relationsDelete.error) throw relationsDelete.error;
      if (relatedPackageIds.length > 0) {
        const { error } = await supabase.from("package_destinations").insert(
          relatedPackageIds.map((packageId, index) => ({
            destination_id: destinationId,
            package_id: packageId,
            // O destino principal pertence ao contexto do pacote e será definido
            // no formulário do produto. Relações existentes preservam esse valor.
            is_primary: initialData?.relations.find((relation) => relation.package_id === packageId)?.is_primary ?? false,
            sort_order: index,
          }))
        );
        if (error) throw error;
      }

      let imageCleanupFailed = false;
      const usedImageUrls = new Set([coverImageUrl, ...gallery].filter(Boolean));
      const removedCoverUrls = removedImageUrls.filter((url) => getStoragePathFromPublicUrl(url, "destinations"));
      const removedGalleryUrls = removedImageUrls.filter((url) => getStoragePathFromPublicUrl(url, "galleries"));

      try {
        await Promise.all([
          removeStorageImages("destinations", removedCoverUrls.filter((url) => !usedImageUrls.has(url))),
          removeStorageImages("galleries", removedGalleryUrls.filter((url) => !usedImageUrls.has(url))),
        ]);
      } catch (error) {
        imageCleanupFailed = true;
        console.error("Não foi possível remover imagens antigas do destino:", error);
      }

      return { destinationId, imageCleanupFailed };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast({ title: isEditing ? "Destino atualizado!" : "Destino criado!" });
      if (result.imageCleanupFailed) {
        toast({
          title: "Destino salvo, mas uma imagem antiga não foi excluída",
          description: "O conteúdo está correto. A limpeza do Storage pode ser refeita depois.",
          variant: "destructive",
        });
      }
      navigate("/admin/destinos");
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao salvar destino", description: error.message, variant: "destructive" });
    },
  });

  const toggleRelatedPackage = (packageId: string) => {
    setRelatedPackageIds((current) => current.includes(packageId)
      ? current.filter((item) => item !== packageId)
      : [...current, packageId]);
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const canSave = Boolean(name.trim() && slug.trim()) && !saveMutation.isPending;

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/destinos"><ArrowLeft size={17} /></Link>
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Catálogo / Destinos</p>
            <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Editar destino turístico" : "Novo destino turístico"}</h1>
          </div>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={!canSave} className="gap-2">
          {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saveMutation.isPending ? "Salvando..." : "Salvar destino"}
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-5">
        <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl bg-muted/70 p-1">
          <TabsTrigger value="content">Informações</TabsTrigger>
          <TabsTrigger value="media">Galeria</TabsTrigger>
          <TabsTrigger value="experience">Atrativos e roteiro</TabsTrigger>
          <TabsTrigger value="packages">Produtos relacionados</TabsTrigger>
          <TabsTrigger value="publishing">Publicação e SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-5">
          <FormSection icon={Info} title="Identidade do destino" description="Informações principais exibidas no site">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Nome do destino *</Label>
                <Input value={name} onChange={(event) => {
                  const value = event.target.value;
                  setName(value);
                  if (!slugManual) setSlug(slugify(value));
                }} placeholder="Ex: Rio Croa" />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={slug} onChange={(event) => {
                  setSlugManual(true);
                  setSlug(event.target.value);
                }} className="font-mono" placeholder="rio-croa" />
              </div>
              <div className="space-y-2">
                <Label>Tipo de destino</Label>
                <Select value={regionType} onValueChange={setRegionType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regional">Regional — Acre</SelectItem>
                    <SelectItem value="national">Nacional</SelectItem>
                    <SelectItem value="international">Internacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Subtítulo</Label>
                <Input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Uma frase curta para apresentar o destino" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Resumo</Label>
                <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={3} placeholder="Resumo usado nos cards e no início da página" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Descrição completa</Label>
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={8} placeholder="História, características e contexto do destino" />
              </div>
            </div>
          </FormSection>

          <FormSection icon={MapPin} title="Localização e orientações" description="Ajude o visitante a entender onde fica e como chegar">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label>Cidade</Label><Input value={city} onChange={(event) => setCity(event.target.value)} /></div>
              <div className="space-y-2"><Label>Estado</Label><Input value={state} onChange={(event) => setState(event.target.value)} /></div>
              <div className="space-y-2"><Label>País</Label><Input value={country} onChange={(event) => setCountry(event.target.value)} /></div>
              <div className="space-y-2 sm:col-span-3"><Label>Como chegar</Label><Textarea value={accessInfo} onChange={(event) => setAccessInfo(event.target.value)} rows={5} /></div>
              <div className="space-y-2 sm:col-span-3"><Label>Recomendações ao visitante</Label><Textarea value={recommendations} onChange={(event) => setRecommendations(event.target.value)} rows={5} /></div>
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="media" className="space-y-5">
          <FormSection icon={ImageIcon} title="Imagem de capa" description="Banner principal da página do destino">
            <ImageUpload bucket="destinations" folder={`${destinationAssetId}/cover`} value={coverImageUrl} onChange={handleCoverImageChange} onRemove={handleCoverImageRemove} label="Enviar imagem de capa" />
          </FormSection>
          <FormSection icon={ImageIcon} title="Galeria de fotos" description="Imagens adicionais, exibidas na ordem abaixo">
            <MultiImageUpload bucket="galleries" folder={`${destinationAssetId}/gallery`} values={gallery} onChange={setGallery} onRemoveImage={queueImageRemoval} />
          </FormSection>
        </TabsContent>

        <TabsContent value="experience" className="space-y-5">
          <FormSection icon={MapPin} title="Principais atrativos" description="Destaques que tornam o destino especial">
            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={highlight.id} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">Atrativo {index + 1}</span><Button type="button" size="icon" variant="ghost" onClick={() => setHighlights((items) => items.filter((item) => item.id !== highlight.id))}><Trash2 size={15} /></Button></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={highlight.title} onChange={(event) => setHighlights((items) => items.map((item) => item.id === highlight.id ? { ...item, title: event.target.value } : item))} placeholder="Nome do atrativo" />
                    <Input value={highlight.description} onChange={(event) => setHighlights((items) => items.map((item) => item.id === highlight.id ? { ...item, description: event.target.value } : item))} placeholder="Descrição curta" />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full gap-2 border-dashed" onClick={() => setHighlights((items) => [...items, { id: crypto.randomUUID(), title: "", description: "" }])}><Plus size={15} />Adicionar atrativo</Button>
            </div>
          </FormSection>

          <FormSection icon={Map} title="Roteiro sugerido" description="Uma sugestão editorial do que fazer no destino">
            <div className="space-y-3">
              {itinerary.map((day, index) => (
                <div key={day.id} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">Dia {index + 1}</span><Button type="button" size="icon" variant="ghost" onClick={() => setItinerary((items) => items.filter((item) => item.id !== day.id))}><Trash2 size={15} /></Button></div>
                  <div className="space-y-3">
                    <Input value={day.title} onChange={(event) => setItinerary((items) => items.map((item) => item.id === day.id ? { ...item, title: event.target.value } : item))} placeholder="Título do dia" />
                    <Textarea value={day.description} onChange={(event) => setItinerary((items) => items.map((item) => item.id === day.id ? { ...item, description: event.target.value } : item))} rows={3} placeholder="Atividades e recomendações" />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full gap-2 border-dashed" onClick={() => setItinerary((items) => [...items, { id: crypto.randomUUID(), title: "", description: "" }])}><Plus size={15} />Adicionar dia</Button>
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="packages">
          <FormSection icon={Package} title="Produtos relacionados" description="Selecione os pacotes e experiências oferecidos neste destino">
            <div className="space-y-4">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input value={packageSearch} onChange={(event) => setPackageSearch(event.target.value)} className="pl-9" placeholder="Buscar produto..." /></div>
              <div className="grid gap-2 sm:grid-cols-2">
                {filteredPackageOptions.map((option) => {
                  const selected = relatedPackageIds.includes(option.id);
                  return (
                    <button key={option.id} type="button" onClick={() => toggleRelatedPackage(option.id)} className={`rounded-xl border p-3 text-left transition-colors ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <p className="text-sm font-semibold text-foreground">{option.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{option.package_type === "regional" ? "Experiência regional" : "Pacote externo"}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="publishing" className="space-y-5">
          <FormSection icon={Info} title="Publicação" description="Controle a visibilidade deste destino no site">
            <div className="max-w-sm space-y-2">
              <Label>Status editorial</Label>
              <Select value={publicationStatus} onValueChange={setPublicationStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormSection>
          <FormSection icon={Search} title="SEO" description="Título e descrição usados por buscadores e compartilhamentos">
            <div className="space-y-4">
              <div className="space-y-2"><Label>Título SEO</Label><Input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} maxLength={70} /></div>
              <div className="space-y-2"><Label>Descrição SEO</Label><Textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} maxLength={160} rows={3} /></div>
            </div>
          </FormSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
