/**
 * FORMULÁRIO DE PACOTES (Criar/Editar) — AdminPackageForm.tsx
 *
 * Juan, este é o grande formulário onde cria e edita pacotes de viagem.
 * Ele serve tanto para /admin/pacotes/novo quanto para /admin/pacotes/:id/editar
 *
 * SEÇÕES DO FORMULÁRIO:
 * 1. Informações Gerais — título, destino, categoria, preço, parcelas, duração, data, status, slug
 * 2. Imagens — capa (hero) e galeria de fotos
 * 3. Descrição — texto curto de apresentação
 * 4. Inclusões — o que está incluso (translado, hospedagem, alimentação, etc.)
 * 5. Roteiro Dia a Dia — descrição de cada dia da viagem
 * 6. Cardápio — SÓ para pacotes internos (bebidas, refeições extras)
 *
 * IMPORTANTES:
 * - Slug é gerado automaticamente do título (pode editar manualmente)
 * - Experiências regionais podem ter data e horário fixos, ambos opcionais
 * - Ao criar, oferece enviar newsletter para assinantes
 * - O pacote e todas as sub-tabelas são sincronizados atomicamente pela RPC
 *   save_package_catalog; qualquer falha reverte a operação completa
 *
 * TABELAS ENVOLVIDAS:
 * packages, package_inclusions, package_itinerary_days,
 * package_images, package_menu_items
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import {
  ArrowLeft, Plus, Trash2, Loader2, Send, Package,
  Info, UtensilsCrossed, Plane, Luggage, CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Link } from "react-router-dom";
import { getStoragePathFromPublicUrl, removeStorageImages } from "@/lib/storageImages";
import {
  getPrimaryDestinationId,
  resolvePackageDestinationName,
  type DestinationNameRelation,
} from "@/lib/catalog";
import AirlineSelect, { getAirlineInfo } from "@/components/AirlineSelect";
import { CapacityFields } from "@/components/admin/packages/ProductSharedFields";
import {
  ProductDescriptionSection,
  ProductDetailsSection,
  ProductFormSection,
  ProductInclusionsSection,
  ProductItinerarySection,
  ProductMediaSection,
  type ItineraryDayDraft,
  type PackageDetailDraft,
} from "@/components/admin/packages/ProductContentSections";


function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface MenuItemDraft {
  id: string;
  name: string;
  description: string;
  price: string;
}

type StoredRouteLeg = Partial<Record<
  | "airportCodeFrom"
  | "cityFrom"
  | "from"
  | "airportCodeTo"
  | "cityTo"
  | "to"
  | "date"
  | "departureTime"
  | "time"
  | "arrivalTime"
  | "airline"
  | "stops"
  | "duration"
  | "baggage",
  string
>>;

type StoredRouteInfo = {
  departure?: StoredRouteLeg;
  return?: StoredRouteLeg;
};

type StoredPackageDetail = {
  id?: string;
  label?: string;
  value?: string;
};

const inclusionOptions = [
  { key: "translado", label: "Translado", emoji: "🚌" },
  { key: "hospedagem", label: "Hospedagem", emoji: "🛏️" },
  { key: "alimentacao", label: "Alimentação", emoji: "🍽️" },
  { key: "guia", label: "Guia local", emoji: "🗺️" },
  { key: "ingresso", label: "Ingressos", emoji: "🎟️" },
  { key: "seguro", label: "Seguro viagem", emoji: "🛡️" },
  { key: "passeio", label: "Passeios", emoji: "🚤" },
];

type PackageType = "external" | "regional";

type PackageCreationDraft = {
  version: 2;
  packageAssetId: string;
  general: {
    title: string;
    slug: string;
    slugManual: boolean;
    destinationName: string;
    category: string;
    duration: string;
    price: string;
    status: string;
    shortDescription: string;
    fullDescription: string;
    installments: string;
    travelDate: string;
    travelTime?: string;
    totalSlots: string;
    availableSlots: string;
  };
  content: {
    selectedInclusions: string[];
    itinerary: ItineraryDayDraft[];
    coverImageUrl: string | null;
    gallery: string[];
    removedImageUrls: string[];
    menuItems: MenuItemDraft[];
    packageDetails: PackageDetailDraft[];
  };
  route: {
    departure: StoredRouteLeg;
    return: StoredRouteLeg;
  };
};

const PACKAGE_DRAFT_VERSION = 2;

function readPackageCreationDraft(storageKey: string): PackageCreationDraft | null {
  try {
    const storedDraft = sessionStorage.getItem(storageKey);
    if (!storedDraft) return null;

    const draft = JSON.parse(storedDraft) as PackageCreationDraft;
    return draft.version === PACKAGE_DRAFT_VERSION ? draft : null;
  } catch {
    sessionStorage.removeItem(storageKey);
    return null;
  }
}

export default function AdminPackageForm({ packageType }: { packageType?: PackageType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id && id !== "novo";
  const draftStorageKey = `evastur:admin:package-draft:${packageType || "external"}`;
  const [initialDraft] = useState(() => isEditing ? null : readPackageCreationDraft(draftStorageKey));
  const [packageAssetId] = useState(() => isEditing
    ? id!
    : initialDraft?.packageAssetId || crypto.randomUUID());
  const packageListPath = packageType === "regional"
    ? "/admin/pacotes/regionais"
    : packageType === "external"
      ? "/admin/pacotes/externos"
      : "/admin/pacotes";
  const clearCreationDraft = () => {
    if (!isEditing) sessionStorage.removeItem(draftStorageKey);
  };

  const [title, setTitle] = useState(initialDraft?.general.title || "");
  const [slug, setSlug] = useState(initialDraft?.general.slug || "");
  const [slugManual, setSlugManual] = useState(initialDraft?.general.slugManual || false);
  const [destinationName, setDestinationName] = useState(initialDraft?.general.destinationName || "");
  const [legacyDestinationId, setLegacyDestinationId] = useState<string | null>(null);
  const [category, setCategory] = useState(initialDraft?.general.category || (packageType === "regional" ? "interno" : "nacional"));
  const [duration, setDuration] = useState(initialDraft?.general.duration || "");
  const [price, setPrice] = useState(initialDraft?.general.price || "");
  const [status, setStatus] = useState(initialDraft?.general.status || "ativo");
  const [shortDescription, setShortDescription] = useState(initialDraft?.general.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(initialDraft?.general.fullDescription || "");
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>(initialDraft?.content.selectedInclusions || []);
  const [itinerary, setItinerary] = useState<ItineraryDayDraft[]>(initialDraft?.content.itinerary || []);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initialDraft?.content.coverImageUrl || null);
  const [gallery, setGallery] = useState<string[]>(initialDraft?.content.gallery || []);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>(initialDraft?.content.removedImageUrls || []);
  const [installments, setInstallments] = useState(initialDraft?.general.installments || "10");
  const [travelDate, setTravelDate] = useState(initialDraft?.general.travelDate || "");
  const [travelTime, setTravelTime] = useState(initialDraft?.general.travelTime || "");
  const [menuItems, setMenuItems] = useState<MenuItemDraft[]>(initialDraft?.content.menuItems || []);
  const [totalSlots, setTotalSlots] = useState(initialDraft?.general.totalSlots || "");
  const [availableSlots, setAvailableSlots] = useState(initialDraft?.general.availableSlots || "");

  // Route info state — Departure (Ida)
  const [routeDepartureAirportFrom, setRouteDepartureAirportFrom] = useState(initialDraft?.route.departure.airportCodeFrom || "");
  const [routeDepartureCityFrom, setRouteDepartureCityFrom] = useState(initialDraft?.route.departure.cityFrom || "");
  const [routeDepartureAirportTo, setRouteDepartureAirportTo] = useState(initialDraft?.route.departure.airportCodeTo || "");
  const [routeDepartureCityTo, setRouteDepartureCityTo] = useState(initialDraft?.route.departure.cityTo || "");
  const [routeDepartureDate, setRouteDepartureDate] = useState(initialDraft?.route.departure.date || "");
  const [routeDepartureTime, setRouteDepartureTime] = useState(initialDraft?.route.departure.departureTime || "");
  const [routeDepartureArrivalTime, setRouteDepartureArrivalTime] = useState(initialDraft?.route.departure.arrivalTime || "");
  const [routeDepartureAirline, setRouteDepartureAirline] = useState(initialDraft?.route.departure.airline || "");
  const [routeDepartureStops, setRouteDepartureStops] = useState(initialDraft?.route.departure.stops || "");
  const [routeDepartureDuration, setRouteDepartureDuration] = useState(initialDraft?.route.departure.duration || "");
  const [routeDepartureBaggage, setRouteDepartureBaggage] = useState(initialDraft?.route.departure.baggage || "");

  // Route info state — Return (Volta)
  const [routeReturnAirportFrom, setRouteReturnAirportFrom] = useState(initialDraft?.route.return.airportCodeFrom || "");
  const [routeReturnCityFrom, setRouteReturnCityFrom] = useState(initialDraft?.route.return.cityFrom || "");
  const [routeReturnAirportTo, setRouteReturnAirportTo] = useState(initialDraft?.route.return.airportCodeTo || "");
  const [routeReturnCityTo, setRouteReturnCityTo] = useState(initialDraft?.route.return.cityTo || "");
  const [routeReturnDate, setRouteReturnDate] = useState(initialDraft?.route.return.date || "");
  const [routeReturnTime, setRouteReturnTime] = useState(initialDraft?.route.return.departureTime || "");
  const [routeReturnArrivalTime, setRouteReturnArrivalTime] = useState(initialDraft?.route.return.arrivalTime || "");
  const [routeReturnAirline, setRouteReturnAirline] = useState(initialDraft?.route.return.airline || "");
  const [routeReturnStops, setRouteReturnStops] = useState(initialDraft?.route.return.stops || "");
  const [routeReturnDuration, setRouteReturnDuration] = useState(initialDraft?.route.return.duration || "");
  const [routeReturnBaggage, setRouteReturnBaggage] = useState(initialDraft?.route.return.baggage || "");

  // Package details state
  const [packageDetails, setPackageDetails] = useState<PackageDetailDraft[]>(initialDraft?.content.packageDetails || []);

  useEffect(() => {
    if (isEditing) return;

    const draft: PackageCreationDraft = {
        version: PACKAGE_DRAFT_VERSION,
        packageAssetId,
        general: {
          title,
          slug,
          slugManual,
          destinationName,
          category,
          duration,
          price,
          status,
          shortDescription,
          fullDescription,
          installments,
          travelDate,
          travelTime,
          totalSlots,
          availableSlots,
        },
        content: {
          selectedInclusions,
          itinerary,
          coverImageUrl,
          gallery,
          removedImageUrls,
          menuItems,
          packageDetails,
        },
        route: {
          departure: {
            airportCodeFrom: routeDepartureAirportFrom,
            cityFrom: routeDepartureCityFrom,
            airportCodeTo: routeDepartureAirportTo,
            cityTo: routeDepartureCityTo,
            date: routeDepartureDate,
            departureTime: routeDepartureTime,
            arrivalTime: routeDepartureArrivalTime,
            airline: routeDepartureAirline,
            stops: routeDepartureStops,
            duration: routeDepartureDuration,
            baggage: routeDepartureBaggage,
          },
          return: {
            airportCodeFrom: routeReturnAirportFrom,
            cityFrom: routeReturnCityFrom,
            airportCodeTo: routeReturnAirportTo,
            cityTo: routeReturnCityTo,
            date: routeReturnDate,
            departureTime: routeReturnTime,
            arrivalTime: routeReturnArrivalTime,
            airline: routeReturnAirline,
            stops: routeReturnStops,
            duration: routeReturnDuration,
            baggage: routeReturnBaggage,
          },
        },
    };

    try {
      sessionStorage.setItem(draftStorageKey, JSON.stringify(draft));
    } catch (error) {
      console.error("Não foi possível salvar o rascunho temporário do pacote:", error);
    }
  }, [
    availableSlots, category, coverImageUrl, draftStorageKey, duration, fullDescription, gallery,
    installments, isEditing, itinerary, menuItems, packageAssetId, packageDetails,
    destinationName, price, removedImageUrls,
    routeDepartureAirline, routeDepartureAirportFrom, routeDepartureAirportTo,
    routeDepartureArrivalTime, routeDepartureBaggage, routeDepartureCityFrom,
    routeDepartureCityTo, routeDepartureDate, routeDepartureDuration,
    routeDepartureStops, routeDepartureTime, routeReturnAirline,
    routeReturnAirportFrom, routeReturnAirportTo, routeReturnArrivalTime,
    routeReturnBaggage, routeReturnCityFrom, routeReturnCityTo, routeReturnDate,
    routeReturnDuration, routeReturnStops, routeReturnTime, selectedInclusions,
    shortDescription, slug, slugManual, status, title, totalSlots, travelDate, travelTime,
  ]);

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

  const { isLoading } = useQuery({
    queryKey: ["package-edit", id],
    enabled: isEditing,
    queryFn: async () => {
      const { data: pkg, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      const { data: inclusions } = await supabase
        .from("package_inclusions")
        .select("inclusion_key")
        .eq("package_id", id!);

      const { data: days } = await supabase
        .from("package_itinerary_days")
        .select("*")
        .eq("package_id", id!)
        .order("day_number");

      const { data: images } = await supabase
        .from("package_images")
        .select("image_url")
        .eq("package_id", id!)
        .order("sort_order");

      const { data: menuItemsData } = await supabase
        .from("package_menu_items")
        .select("*")
        .eq("package_id", id!)
        .order("sort_order");

      const { data: destinationRelations } = await supabase
        .from("package_destinations")
        .select("destination_id, is_primary, sort_order, destinations(name)")
        .eq("package_id", id!)
        .order("sort_order");

      const legacyDestinationResult = pkg.destination_id
        ? await supabase
            .from("destinations")
            .select("name")
            .eq("id", pkg.destination_id)
            .maybeSingle()
        : null;

      const ri = pkg.route_info as StoredRouteInfo | null;
      const resolvedDestinationName = resolvePackageDestinationName({
        destinationName: pkg.destination_name,
        legacyDestinationName: legacyDestinationResult?.data?.name,
        relations: destinationRelations as DestinationNameRelation[] | null,
        routeDestinationName: ri?.departure?.cityTo || ri?.departure?.to,
      });

      setTitle(pkg.title);
      setSlug(pkg.slug);
      setSlugManual(true);
      setDestinationName(resolvedDestinationName);
      setLegacyDestinationId(
        pkg.destination_id
        || getPrimaryDestinationId(destinationRelations as DestinationNameRelation[] | null)
      );
      setCategory(pkg.category);
      setDuration(pkg.duration || "");
      setPrice(pkg.price.toString());
      setStatus(pkg.status);
      setShortDescription(pkg.short_description || "");
      setFullDescription(pkg.full_description || "");
      setCoverImageUrl(pkg.cover_image_url || null);
      setInstallments(String(pkg.installments || 10));
      setTravelDate(pkg.travel_date ? pkg.travel_date.split("T")[0] : "");
      setTravelTime(pkg.travel_time ? pkg.travel_time.slice(0, 5) : "");
      setTotalSlots(pkg.total_slots != null ? String(pkg.total_slots) : "");
      setAvailableSlots(pkg.available_slots != null ? String(pkg.available_slots) : "");
      setSelectedInclusions(inclusions?.map((i) => i.inclusion_key) || []);
      setItinerary(
        days?.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description || "",
        })) || []
      );
      setGallery(images?.map((img) => img.image_url) || []);
      setMenuItems(
        menuItemsData?.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description || "",
          price: String(m.price),
        })) || []
      );

      // Load route info (retrocompatível com dados antigos from/to)
      if (ri && typeof ri === "object") {
        const dep = ri.departure || {};
        setRouteDepartureAirportFrom(dep.airportCodeFrom || "");
        setRouteDepartureCityFrom(dep.cityFrom || dep.from || "");
        setRouteDepartureAirportTo(dep.airportCodeTo || "");
        setRouteDepartureCityTo(dep.cityTo || dep.to || "");
        setRouteDepartureDate(dep.date || "");
        setRouteDepartureTime(dep.departureTime || dep.time || "");
        setRouteDepartureArrivalTime(dep.arrivalTime || "");
        setRouteDepartureAirline(dep.airline || "");
        setRouteDepartureStops(dep.stops || "");
        setRouteDepartureDuration(dep.duration || "");
        setRouteDepartureBaggage(dep.baggage || "");

        const ret = ri.return || {};
        setRouteReturnAirportFrom(ret.airportCodeFrom || "");
        setRouteReturnCityFrom(ret.cityFrom || ret.from || "");
        setRouteReturnAirportTo(ret.airportCodeTo || "");
        setRouteReturnCityTo(ret.cityTo || ret.to || "");
        setRouteReturnDate(ret.date || "");
        setRouteReturnTime(ret.departureTime || ret.time || "");
        setRouteReturnArrivalTime(ret.arrivalTime || "");
        setRouteReturnAirline(ret.airline || "");
        setRouteReturnStops(ret.stops || "");
        setRouteReturnDuration(ret.duration || "");
        setRouteReturnBaggage(ret.baggage || "");
      }

      // Load package details
      const pd = pkg.package_details as StoredPackageDetail[] | null;
      if (pd && Array.isArray(pd)) {
        setPackageDetails(pd.map((item) => ({
          id: item.id || crypto.randomUUID(),
          label: item.label || "",
          value: item.value || "",
        })));
      }

      return pkg;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Informe o título do produto.");
      if (!destinationName.trim()) throw new Error("Informe o destino ou local do produto.");
      if (!slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
        throw new Error("Use um slug válido, com letras minúsculas, números e hífens.");
      }
      const priceValue = Number(price);
      const installmentsValue = Number(installments);
      if (!Number.isFinite(priceValue) || priceValue <= 0) {
        throw new Error("Informe um preço maior que zero.");
      }
      if (!Number.isInteger(installmentsValue) || installmentsValue < 1 || installmentsValue > 48) {
        throw new Error("O parcelamento deve estar entre 1 e 48 vezes.");
      }
      if (packageType === "regional" && category !== "interno") {
        throw new Error("Experiências regionais devem usar a categoria Regional — Acre.");
      }
      if (packageType === "external" && category === "interno") {
        throw new Error("Pacotes externos devem ser nacionais, internacionais ou cruzeiros.");
      }
      if (status !== "rascunho" && !coverImageUrl) {
        throw new Error("Adicione uma imagem de capa antes de publicar o produto.");
      }
      if (routeDepartureDate && routeReturnDate && routeReturnDate < routeDepartureDate) {
        throw new Error("A data da volta não pode ser anterior à data da ida.");
      }
      if (packageType === "regional" && Boolean(travelDate) !== Boolean(travelTime)) {
        throw new Error("Informe a data e o horário da experiência ou deixe os dois campos vazios.");
      }

      const totalSlotsValue = totalSlots ? Number(totalSlots) : null;
      const availableSlotsValue = availableSlots
        ? Number(availableSlots)
        : totalSlotsValue;
      if (totalSlotsValue !== null && totalSlotsValue < 0) {
        throw new Error("A capacidade total não pode ser negativa.");
      }
      if (totalSlotsValue !== null && !Number.isInteger(totalSlotsValue)) {
        throw new Error("A capacidade total deve ser um número inteiro.");
      }
      if (availableSlotsValue !== null && availableSlotsValue < 0) {
        throw new Error("As vagas disponíveis não podem ser negativas.");
      }
      if (availableSlotsValue !== null && !Number.isInteger(availableSlotsValue)) {
        throw new Error("As vagas disponíveis devem ser um número inteiro.");
      }
      if (
        totalSlotsValue !== null &&
        availableSlotsValue !== null &&
        availableSlotsValue > totalSlotsValue
      ) {
        throw new Error("As vagas disponíveis não podem superar a capacidade total.");
      }
      const pkgData: { [key: string]: Json | undefined } = {
        id: packageAssetId,
        title: title.trim(),
        destination_name: destinationName.trim(),
        slug: slug.trim(),
        category,
        package_type: category === "interno" ? "regional" : "external",
        travel_scope:
          category === "internacional"
            ? "international"
            : category === "interno"
              ? null
              : "national",
        duration: duration.trim() || null,
        price: priceValue,
        status,
        active: status !== "rascunho",
        publication_status: status === "rascunho" ? "draft" : "published",
        sales_status:
          status === "esgotado"
            ? "sold_out"
            : status === "rascunho"
              ? "paused"
              : "available",
        short_description: shortDescription.trim() || null,
        full_description: fullDescription.trim() || null,
        cover_image_url: coverImageUrl || null,
        cover_image_path: getStoragePathFromPublicUrl(coverImageUrl, "packages"),
        installments: installmentsValue,
        travel_date: travelDate || null,
        travel_time: category === "interno" ? travelTime || null : null,
        updated_at: new Date().toISOString(),
      };

      // Build route_info
      const hasRoute = routeDepartureCityFrom || routeDepartureCityTo || routeReturnCityFrom || routeReturnCityTo
        || routeDepartureAirportFrom || routeDepartureAirportTo || routeReturnAirportFrom || routeReturnAirportTo;
      if (hasRoute) {
        pkgData.route_info = {
          departure: {
            airportCodeFrom: routeDepartureAirportFrom || null,
            cityFrom: routeDepartureCityFrom || null,
            airportCodeTo: routeDepartureAirportTo || null,
            cityTo: routeDepartureCityTo || null,
            date: routeDepartureDate || null,
            departureTime: routeDepartureTime || null,
            arrivalTime: routeDepartureArrivalTime || null,
            airline: routeDepartureAirline || null,
            stops: routeDepartureStops || null,
            duration: routeDepartureDuration || null,
            baggage: routeDepartureBaggage || null,
          },
          return: {
            airportCodeFrom: routeReturnAirportFrom || null,
            cityFrom: routeReturnCityFrom || null,
            airportCodeTo: routeReturnAirportTo || null,
            cityTo: routeReturnCityTo || null,
            date: routeReturnDate || null,
            departureTime: routeReturnTime || null,
            arrivalTime: routeReturnArrivalTime || null,
            airline: routeReturnAirline || null,
            stops: routeReturnStops || null,
            duration: routeReturnDuration || null,
            baggage: routeReturnBaggage || null,
          },
        };
      } else {
        pkgData.route_info = null;
      }

      // Build package_details
      const validDetails = packageDetails.filter(d => d.label.trim() || d.value.trim());
      pkgData.package_details = validDetails.length > 0
        ? validDetails.map(d => ({ id: d.id, label: d.label, value: d.value }))
        : null;

      pkgData.total_slots = totalSlotsValue;
      pkgData.available_slots = availableSlotsValue;

      const inclusionRows = selectedInclusions.map((key) => ({
        inclusion_key: key,
        label: inclusionOptions.find((option) => option.key === key)?.label || key,
      }));
      const itineraryRows = itinerary.map((day, index) => ({
        day_number: index + 1,
        title: day.title,
        description: day.description || null,
      }));
      const imageRows = gallery.map((url, index) => ({
        image_url: url,
        storage_path: getStoragePathFromPublicUrl(url, "packages"),
        alt_text: `${title} — foto ${index + 1}`,
        caption: null,
        sort_order: index + 1,
      }));
      const menuRows = category === "interno"
        ? menuItems.map((item, index) => ({
            name: item.name,
            description: item.description || null,
            price: parseFloat(item.price) || 0,
            sort_order: index + 1,
          }))
        : [];

      const saveDirectPackage = async () => {
        const { error: packageError } = await supabase
          .from("packages")
          .upsert(pkgData as Database["public"]["Tables"]["packages"]["Insert"], {
            onConflict: "id",
          });
        if (packageError) throw packageError;

        try {
          const deletionResults = await Promise.all([
            supabase.from("package_inclusions").delete().eq("package_id", packageAssetId),
            supabase.from("package_itinerary_days").delete().eq("package_id", packageAssetId),
            supabase.from("package_images").delete().eq("package_id", packageAssetId),
            supabase.from("package_menu_items").delete().eq("package_id", packageAssetId),
            supabase.from("package_destinations").delete().eq("package_id", packageAssetId),
          ]);
          const deletionError = deletionResults.find((result) => result.error)?.error;
          if (deletionError) throw deletionError;

          if (inclusionRows.length > 0) {
            const { error } = await supabase.from("package_inclusions").insert(
              inclusionRows.map((row) => ({ ...row, package_id: packageAssetId }))
            );
            if (error) throw error;
          }

          if (itineraryRows.length > 0) {
            const { error } = await supabase.from("package_itinerary_days").insert(
              itineraryRows.map((row) => ({ ...row, package_id: packageAssetId }))
            );
            if (error) throw error;
          }

          if (imageRows.length > 0) {
            const { error } = await supabase.from("package_images").insert(
              imageRows.map((row) => ({ ...row, package_id: packageAssetId }))
            );
            if (error) throw error;
          }

          if (menuRows.length > 0) {
            const { error } = await supabase.from("package_menu_items").insert(
              menuRows.map((row) => ({ ...row, package_id: packageAssetId }))
            );
            if (error) throw error;
          }
        } catch (error) {
          if (!isEditing) {
            const { error: cleanupError } = await supabase
              .from("packages")
              .delete()
              .eq("id", packageAssetId);
            if (cleanupError) {
              console.error("Não foi possível desfazer o pacote incompleto:", cleanupError);
            }
          }
          throw error;
        }

        return packageAssetId;
      };

      const { data: rpcPackageId, error: rpcError } = await supabase.rpc("save_package_catalog", {
        p_package: pkgData,
        p_inclusions: inclusionRows,
        p_itinerary: itineraryRows,
        p_images: imageRows,
        p_menu_items: menuRows,
        // Compatibilidade temporária: a RPC anterior à simplificação exige
        // um destino relacionado. A RPC nova aceita a lista e a ignora.
        p_destinations: legacyDestinationId
          ? [{ destination_id: legacyDestinationId, is_primary: true, sort_order: 0 }]
          : [],
        p_travel_time: category === "interno" ? travelTime || null : null,
      });

      let pkgId = rpcPackageId;
      if (rpcError) {
        const legacyDestinationRequirement = /vincule pelo menos um destino cadastrado/i.test(
          rpcError.message
        );
        if (!legacyDestinationRequirement || legacyDestinationId) throw rpcError;
        pkgId = await saveDirectPackage();
      }

      let imageCleanupFailed = false;
      const usedImageUrls = new Set([coverImageUrl, ...gallery].filter(Boolean));
      const imageUrlsToRemove = removedImageUrls.filter((url) => !usedImageUrls.has(url));
      try {
        await removeStorageImages("packages", imageUrlsToRemove);
      } catch (error) {
        imageCleanupFailed = true;
        console.error("Não foi possível remover imagens antigas do pacote:", error);
      }

      return { newPkgId: isEditing ? null : pkgId, title, price, coverImageUrl, slug, imageCleanupFailed };
    },
    onSuccess: (data) => {
      clearCreationDraft();
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      toast({ title: isEditing ? "Pacote atualizado! ✅" : "Pacote criado! 🎉" });
      if (data?.imageCleanupFailed) {
        toast({
          title: "Pacote salvo, mas uma imagem antiga não foi excluída",
          description: "O conteúdo está correto. A limpeza do Storage pode ser refeita depois.",
          variant: "destructive",
        });
      }
      if (data?.newPkgId) {
        toast({
          title: "📧 Enviar Newsletter?",
          description: "Notificar assinantes sobre o novo pacote?",
          action: (
            <ToastAction
              altText="Enviar newsletter sobre o novo pacote"
              onClick={() =>
                sendNewsletterMutation.mutate({
                  id: data.newPkgId,
                  title: data.title,
                  price: data.price,
                  cover_image_url: data.coverImageUrl,
                  slug: data.slug,
                })
              }
              className="flex items-center gap-1"
            >
              <Send size={12} /> Enviar
            </ToastAction>
          ),
        });
      }
      navigate(packageListPath);
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    },
  });

  const sendNewsletterMutation = useMutation({
    mutationFn: async (pkgData: { id: string; title: string; price: string; cover_image_url: string; slug: string }) => {
      const { error } = await supabase.functions.invoke("send-newsletter", {
        body: {
          package_id: pkgData.id,
          package_name: pkgData.title,
          package_price: pkgData.price,
          package_image: pkgData.cover_image_url,
          package_slug: pkgData.slug,
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Newsletter enviada!", description: "Todos os assinantes foram notificados." });
    },
  });

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const toggleInclusion = (key: string) => {
    setSelectedInclusions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const addDay = () => {
    setItinerary([...itinerary, { id: crypto.randomUUID(), title: "", description: "" }]);
  };

  const removeDay = (dayId: string) => {
    setItinerary(itinerary.filter((d) => d.id !== dayId));
  };

  const updateDay = (dayId: string, field: "title" | "description", value: string) => {
    setItinerary(itinerary.map((d) => (d.id === dayId ? { ...d, [field]: value } : d)));
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { id: crypto.randomUUID(), name: "", description: "", price: "" }]);
  };

  const removeMenuItem = (itemId: string) => {
    setMenuItems(menuItems.filter((m) => m.id !== itemId));
  };

  const updateMenuItem = (itemId: string, field: keyof MenuItemDraft, value: string) => {
    setMenuItems(menuItems.map((m) => (m.id === itemId ? { ...m, [field]: value } : m)));
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const canSave = !!title.trim() && !!slug.trim() && !!destinationName.trim() && !saveMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to={packageListPath}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-0.5">
            Admin / Pacotes
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing
              ? packageType === "regional" ? "Editar Experiência Regional" : "Editar Pacote Externo"
              : packageType === "regional" ? "Criar Experiência Regional" : "Criar Pacote Externo"}
          </h1>
        </div>
      </div>

      <div className="space-y-5">
        {/* ── 1. INFORMAÇÕES GERAIS ── */}
        <ProductFormSection
          icon={Info}
          title="Informações Gerais"
          description="Dados principais do pacote que o cliente verá na listagem"
          color="text-sky-600"
          iconBg="bg-sky-50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Título do Pacote */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium">
                Título do Pacote <span className="text-red-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Imersão no Rio Croa"
                className="h-11"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium">
                Destino ou local <span className="text-red-500">*</span>
              </Label>
              <Input
                value={destinationName}
                onChange={(event) => setDestinationName(event.target.value)}
                placeholder={packageType === "regional"
                  ? "Ex: Rio Croa — Cruzeiro do Sul, Acre"
                  : "Ex: Fortaleza, Ceará"}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Informe diretamente onde a viagem ou experiência acontece. Não é necessário cadastrar uma página de destino.
              </p>
            </div>

            {/* A modalidade regional já define a categoria automaticamente. */}
            {packageType !== "regional" && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nacional">🇧🇷 Nacional</SelectItem>
                    <SelectItem value="internacional">✈️ Internacional</SelectItem>
                    <SelectItem value="cruzeiro">🚢 Cruzeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Preço por pessoa */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Preço por pessoa (R$) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                  R$
                </span>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  className="h-11 pl-9"
                />
              </div>
            </div>

            {/* Parcelas máximas */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Parcelamento máximo</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={1}
                  max={48}
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  placeholder="10"
                  className="h-11 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  x
                </span>
              </div>
            </div>

            {/* Duração */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Duração</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 3 dias / 2 noites"
                className="h-11"
              />
            </div>

            {packageType === "regional" ? (
              <div className="sm:col-span-2 rounded-xl border border-sky-100 bg-sky-50/40 p-4">
                <div className="mb-3 flex items-start gap-2">
                  <CalendarClock className="mt-0.5 text-sky-600" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Data fixa da experiência</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Opcional. Preencha os dois campos somente quando a experiência acontecer em uma data específica.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="regional-travel-date" className="text-sm font-medium">Data</Label>
                    <Input
                      id="regional-travel-date"
                      type="date"
                      value={travelDate}
                      onChange={(event) => setTravelDate(event.target.value)}
                      aria-invalid={Boolean(travelDate) !== Boolean(travelTime)}
                      className="h-11"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="regional-travel-time" className="text-sm font-medium">Horário</Label>
                    <Input
                      id="regional-travel-time"
                      type="time"
                      value={travelTime}
                      onChange={(event) => setTravelTime(event.target.value)}
                      aria-invalid={Boolean(travelDate) !== Boolean(travelTime)}
                      className="h-11"
                    />
                  </div>
                </div>
                {Boolean(travelDate) !== Boolean(travelTime) && (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    Preencha data e horário juntos ou deixe ambos vazios.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="external-travel-date" className="text-sm font-medium">Data da Viagem</Label>
                <Input
                  id="external-travel-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="h-11"
                />
              </div>
            )}

            <CapacityFields
              totalSlots={totalSlots}
              availableSlots={availableSlots}
              onTotalSlotsChange={setTotalSlots}
              onAvailableSlotsChange={setAvailableSlots}
            />


            {/* Status de venda */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Status de venda</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">✅ Ativo — à venda</SelectItem>
                  <SelectItem value="rascunho">✏️ Rascunho — oculto</SelectItem>
                  <SelectItem value="esgotado">❌ Esgotado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL slug (gerado automaticamente) */}
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-sm font-medium text-muted-foreground">
                URL (slug) — gerado automaticamente
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm shrink-0">/pacote/</span>
                <Input
                  value={slug}
                  className="h-9 font-mono text-sm text-muted-foreground"
                  onChange={(e) => {
                    setSlugManual(true);
                    setSlug(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </ProductFormSection>

        {/* ── 1.5 TRAJETO IDA E VOLTA ── */}
        {category !== "interno" && (
        <ProductFormSection
          icon={Plane}
          title="Informações de Voo"
          description="Companhia aérea, aeroportos, horários, bagagem e paradas — dados completos para o cliente"
          color="text-indigo-600"
          iconBg="bg-indigo-50"
        >
          <div className="space-y-6">
            {/* ── IDA ── */}
            <div className="space-y-4 p-5 rounded-xl border border-indigo-200 bg-indigo-50/30">
              <div className="flex items-center gap-2 pb-2 border-b border-indigo-200/60">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">→</span>
                <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Ida</span>
              </div>

              {/* Aeroportos: Código + Cidade */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cód. Aeroporto Origem</Label>
                  <Input
                    value={routeDepartureAirportFrom}
                    onChange={(e) => setRouteDepartureAirportFrom(e.target.value.toUpperCase())}
                    placeholder="RBR"
                    maxLength={4}
                    className="h-10 font-mono font-bold text-center uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cidade Origem</Label>
                  <Input
                    value={routeDepartureCityFrom}
                    onChange={(e) => setRouteDepartureCityFrom(e.target.value)}
                    placeholder="Rio Branco"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cód. Aeroporto Destino</Label>
                  <Input
                    value={routeDepartureAirportTo}
                    onChange={(e) => setRouteDepartureAirportTo(e.target.value.toUpperCase())}
                    placeholder="GRU"
                    maxLength={4}
                    className="h-10 font-mono font-bold text-center uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cidade Destino</Label>
                  <Input
                    value={routeDepartureCityTo}
                    onChange={(e) => setRouteDepartureCityTo(e.target.value)}
                    placeholder="São Paulo"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Data, Horários e Duração */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Data da ida</Label>
                  <Input
                    type="date"
                    value={routeDepartureDate}
                    onChange={(e) => setRouteDepartureDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Horário de Saída</Label>
                  <Input
                    type="time"
                    value={routeDepartureTime}
                    onChange={(e) => setRouteDepartureTime(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Horário de Chegada</Label>
                  <Input
                    type="time"
                    value={routeDepartureArrivalTime}
                    onChange={(e) => setRouteDepartureArrivalTime(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Duração do voo</Label>
                  <Input
                    value={routeDepartureDuration}
                    onChange={(e) => setRouteDepartureDuration(e.target.value)}
                    placeholder="11h 35m"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Cia Aérea, Paradas e Bagagem */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Companhia Aérea</Label>
                  <AirlineSelect
                    value={routeDepartureAirline}
                    onChange={setRouteDepartureAirline}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Paradas</Label>
                  <Select value={routeDepartureStops} onValueChange={setRouteDepartureStops}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direto">✈️ Direto</SelectItem>
                      <SelectItem value="1 parada">1 parada</SelectItem>
                      <SelectItem value="2 paradas">2 paradas</SelectItem>
                      <SelectItem value="3+ paradas">3+ paradas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Bagagem</Label>
                  <Input
                    value={routeDepartureBaggage}
                    onChange={(e) => setRouteDepartureBaggage(e.target.value)}
                    placeholder="Ex: 23kg, Mão 10kg"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Preview da ida */}
              {routeDepartureAirportFrom && routeDepartureAirportTo && (
                <div className="bg-white/80 rounded-lg p-3 border border-indigo-100 flex items-center gap-3 text-sm">
                  <Plane size={14} className="text-indigo-500 shrink-0" />
                  <span className="font-mono font-bold text-indigo-800">{routeDepartureAirportFrom}</span>
                  <span className="text-indigo-400">→</span>
                  <span className="font-mono font-bold text-indigo-800">{routeDepartureAirportTo}</span>
                  {routeDepartureAirline && (() => {
                    const info = getAirlineInfo(routeDepartureAirline);
                    return (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        •
                        {info?.logo && <img src={info.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />}
                        {routeDepartureAirline}
                      </span>
                    );
                  })()}
                  {routeDepartureTime && <span className="text-muted-foreground">• {routeDepartureTime}</span>}
                  {routeDepartureArrivalTime && <span className="text-muted-foreground">→ {routeDepartureArrivalTime}</span>}
                  {routeDepartureDuration && <span className="text-indigo-600 font-medium ml-auto">{routeDepartureDuration}</span>}
                </div>
              )}
            </div>

            {/* ── VOLTA ── */}
            <div className="space-y-4 p-5 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">←</span>
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Volta</span>
              </div>

              {/* Aeroportos: Código + Cidade */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cód. Aeroporto Origem</Label>
                  <Input
                    value={routeReturnAirportFrom}
                    onChange={(e) => setRouteReturnAirportFrom(e.target.value.toUpperCase())}
                    placeholder="GRU"
                    maxLength={4}
                    className="h-10 font-mono font-bold text-center uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cidade Origem</Label>
                  <Input
                    value={routeReturnCityFrom}
                    onChange={(e) => setRouteReturnCityFrom(e.target.value)}
                    placeholder="São Paulo"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cód. Aeroporto Destino</Label>
                  <Input
                    value={routeReturnAirportTo}
                    onChange={(e) => setRouteReturnAirportTo(e.target.value.toUpperCase())}
                    placeholder="RBR"
                    maxLength={4}
                    className="h-10 font-mono font-bold text-center uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cidade Destino</Label>
                  <Input
                    value={routeReturnCityTo}
                    onChange={(e) => setRouteReturnCityTo(e.target.value)}
                    placeholder="Rio Branco"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Data, Horários e Duração */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Data da volta</Label>
                  <Input
                    type="date"
                    value={routeReturnDate}
                    onChange={(e) => setRouteReturnDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Horário de Saída</Label>
                  <Input
                    type="time"
                    value={routeReturnTime}
                    onChange={(e) => setRouteReturnTime(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Horário de Chegada</Label>
                  <Input
                    type="time"
                    value={routeReturnArrivalTime}
                    onChange={(e) => setRouteReturnArrivalTime(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Duração do voo</Label>
                  <Input
                    value={routeReturnDuration}
                    onChange={(e) => setRouteReturnDuration(e.target.value)}
                    placeholder="10h"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Cia Aérea, Paradas e Bagagem */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Companhia Aérea</Label>
                  <AirlineSelect
                    value={routeReturnAirline}
                    onChange={setRouteReturnAirline}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Paradas</Label>
                  <Select value={routeReturnStops} onValueChange={setRouteReturnStops}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direto">✈️ Direto</SelectItem>
                      <SelectItem value="1 parada">1 parada</SelectItem>
                      <SelectItem value="2 paradas">2 paradas</SelectItem>
                      <SelectItem value="3+ paradas">3+ paradas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Bagagem</Label>
                  <Input
                    value={routeReturnBaggage}
                    onChange={(e) => setRouteReturnBaggage(e.target.value)}
                    placeholder="Ex: 23kg, Mão 10kg"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Preview da volta */}
              {routeReturnAirportFrom && routeReturnAirportTo && (
                <div className="bg-white/80 rounded-lg p-3 border border-emerald-100 flex items-center gap-3 text-sm">
                  <Plane size={14} className="text-emerald-500 shrink-0" />
                  <span className="font-mono font-bold text-emerald-800">{routeReturnAirportFrom}</span>
                  <span className="text-emerald-400">→</span>
                  <span className="font-mono font-bold text-emerald-800">{routeReturnAirportTo}</span>
                  {routeReturnAirline && (() => {
                    const info = getAirlineInfo(routeReturnAirline);
                    return (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        •
                        {info?.logo && <img src={info.logo} alt="" className="w-4 h-4 rounded-sm object-contain" />}
                        {routeReturnAirline}
                      </span>
                    );
                  })()}
                  {routeReturnTime && <span className="text-muted-foreground">• {routeReturnTime}</span>}
                  {routeReturnArrivalTime && <span className="text-muted-foreground">→ {routeReturnArrivalTime}</span>}
                  {routeReturnDuration && <span className="text-emerald-600 font-medium ml-auto">{routeReturnDuration}</span>}
                </div>
              )}
            </div>
          </div>
        </ProductFormSection>
        )}

        <ProductMediaSection
          assetId={packageAssetId}
          coverImageUrl={coverImageUrl}
          gallery={gallery}
          onCoverChange={handleCoverImageChange}
          onCoverRemove={handleCoverImageRemove}
          onGalleryChange={setGallery}
          onGalleryImageRemove={queueImageRemoval}
        />

        <ProductDescriptionSection
          shortValue={shortDescription}
          fullValue={fullDescription}
          onShortChange={setShortDescription}
          onFullChange={setFullDescription}
        />

        <ProductInclusionsSection
          options={inclusionOptions}
          selectedKeys={selectedInclusions}
          onToggle={toggleInclusion}
        />

        <ProductItinerarySection
          days={itinerary}
          onAdd={addDay}
          onRemove={removeDay}
          onUpdate={updateDay}
        />

        <ProductDetailsSection items={packageDetails} onChange={setPackageDetails} />

        {/* ── 6. CARDÁPIO (somente internos) ── */}
        {category === "interno" && (
          <ProductFormSection
            icon={UtensilsCrossed}
            title="Cardápio do Passeio"
            description="Itens opcionais que o cliente poderá escolher ao fazer a reserva (bebidas, refeições, etc.)"
            color="text-orange-600"
            iconBg="bg-orange-50"
          >
            <div className="space-y-3">
              {menuItems.map((item, i) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "hsl(25 100% 50%)" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        Item {i + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <Label className="text-xs text-muted-foreground">Nome do item</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateMenuItem(item.id, "name", e.target.value)}
                        placeholder="Ex: Caipirinha artesanal"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Preço (R$)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem(item.id, "price", e.target.value)}
                          placeholder="0,00"
                          className="h-10 pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Descrição (opcional)</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateMenuItem(item.id, "description", e.target.value)}
                      placeholder="Ex: Com fruta da estação e cachaça artesanal"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              ))}

              {menuItems.length === 0 && (
                <div className="border-2 border-dashed border-orange-200 rounded-xl py-8 text-center bg-orange-50/30">
                  <UtensilsCrossed size={28} className="text-orange-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum item adicionado ao cardápio
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Adicione bebidas, refeições ou experiências extras
                  </p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMenuItem}
                className="gap-2 w-full border-dashed border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
              >
                <Plus size={14} />
                Adicionar item ao cardápio
              </Button>
            </div>
          </ProductFormSection>
        )}

        {/* ── BOTÕES DE AÇÃO ── */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Button variant="ghost" asChild className="text-muted-foreground">
            <Link to={packageListPath} onClick={clearCreationDraft}>← Cancelar</Link>
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!canSave}
            className="gap-2 px-7 h-11"
            style={{
              background: canSave
                ? "linear-gradient(135deg, hsl(232 100% 23%), hsl(232 100% 30%))"
                : undefined,
            }}
          >
            {saveMutation.isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Package size={16} />
            )}
            {saveMutation.isPending
              ? "Salvando..."
              : isEditing
              ? "Salvar alterações"
              : status === "rascunho"
                ? "Salvar rascunho"
                : packageType === "regional"
                  ? "Publicar experiência"
                  : "Publicar pacote"}
          </Button>
        </div>
      </div>
    </div>
  );
}
