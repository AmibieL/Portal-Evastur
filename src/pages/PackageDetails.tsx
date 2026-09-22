import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Car, Coffee, Bed, Map, Shield, MessageCircle, Users, Compass, Camera, MapPin, Loader2, CreditCard, Heart, Star, UserCircle, ShoppingCart, Calendar, Maximize2, ArrowRight, Info, Plane, UtensilsCrossed, CheckCircle2, Ban, Luggage, Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useFavorite } from "@/hooks/useFavorite";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getAirlineInfo } from "@/components/AirlineSelect";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getFixedPackageSchedule } from "@/lib/packageSchedule";
import "./package-details.css";

type RouteLeg = Partial<Record<
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

type RouteInfo = {
  departure?: RouteLeg;
  return?: RouteLeg;
};

type PackageDetail = {
  label?: string;
  value?: string;
};

type ItineraryDay = {
  day_number: number;
  title: string;
  description?: string | null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

const SHOW_LEGACY_FLIGHT_SUMMARY = false;

const inclusionIcons: Record<string, typeof Car> = {
  translado: Car,
  hospedagem: Bed,
  alimentacao: Coffee,
  guia: Map,
  ingresso: Compass,
  seguro: Shield,
  passeio: Camera,
};

const getAirport = (leg: RouteLeg | undefined, direction: "From" | "To") =>
  leg?.[`airportCode${direction}`] || "";

const getCity = (leg: RouteLeg | undefined, direction: "From" | "To") =>
  leg?.[`city${direction}`] || leg?.[direction === "From" ? "from" : "to"] || "";

const getDepartureTime = (leg: RouteLeg | undefined) =>
  leg?.departureTime || leg?.time || "";

const formatFlightDate = (dateValue: string) => {
  if (!dateValue) return "";
  return new Date(`${dateValue}T12:00:00`).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPackageDate = (dateValue: string, long = false) => {
  const [year, month, day] = dateValue.substring(0, 10).split("-").map(Number);
  if (!year || !month || !day) return dateValue;

  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", long
    ? { day: "2-digit", month: "long", year: "numeric" }
    : { day: "2-digit", month: "2-digit", year: "numeric" });
};

function FlightLegSummary({ leg, label, reverse = false }: { leg: RouteLeg; label: string; reverse?: boolean }) {
  const airportFrom = getAirport(leg, "From");
  const airportTo = getAirport(leg, "To");
  const cityFrom = getCity(leg, "From");
  const cityTo = getCity(leg, "To");
  const departureTime = getDepartureTime(leg);
  const arrivalTime = leg.arrivalTime || "";
  const airline = leg.airline || "";
  const airlineInfo = airline ? getAirlineInfo(airline) : null;
  const date = leg.date ? formatFlightDate(leg.date) : "";

  return (
    <div className="flight-leg">
      <div className="flight-leg__header">
        <span><Plane size={13} className={reverse ? "rotate-180" : ""} /> {label}</span>
        {date && <time>{date}</time>}
      </div>

      <div className="flight-leg__route">
        <div className="flight-leg__airport">
          <strong>{departureTime || "--:--"}</strong>
          <span>{cityFrom || "Origem"}</span>
          {airportFrom && <small>{airportFrom}</small>}
        </div>

        <div className="flight-leg__path" aria-label={leg.stops || "Trecho aéreo"}>
          <span>{leg.stops || "Trecho aéreo"}</span>
          <div><i /><Plane size={15} /><i /></div>
          {leg.duration && <small>{leg.duration}</small>}
        </div>

        <div className="flight-leg__airport flight-leg__airport--arrival">
          <strong>{arrivalTime || "--:--"}</strong>
          <span>{cityTo || "Destino"}</span>
          {airportTo && <small>{airportTo}</small>}
        </div>
      </div>

      {(airline || leg.baggage) && (
        <div className="flight-leg__footer">
          {airline && (
            <span className="flight-leg__airline">
              <span className="flight-leg__logo">
                {airlineInfo?.logo
                  ? <img src={airlineInfo.logo} alt="" />
                  : <Plane size={13} />}
              </span>
              {airline}
              {airlineInfo?.iata && <small>{airlineInfo.iata}</small>}
            </span>
          )}
          {leg.baggage && <span><Luggage size={14} /> {leg.baggage}</span>}
        </div>
      )}
    </div>
  );
}

function PackageFlightSummary({ routeInfo }: { routeInfo: RouteInfo | null }) {
  if (!routeInfo || typeof routeInfo !== "object") return null;

  const departure = routeInfo.departure;
  const returnLeg = routeInfo.return;
  const hasDeparture = Boolean(departure && (getCity(departure, "From") || getCity(departure, "To") || getAirport(departure, "From")));
  const hasReturn = Boolean(returnLeg && (getCity(returnLeg, "From") || getCity(returnLeg, "To") || getAirport(returnLeg, "From")));
  if (!hasDeparture && !hasReturn) return null;

  return (
    <section className="flight-summary" aria-labelledby="flight-summary-title">
      <div className="flight-summary__title" id="flight-summary-title">
        <Plane size={19} />
        <span>Seu voo</span>
      </div>
      <div className="flight-summary__legs">
        {hasDeparture && departure && <FlightLegSummary leg={departure} label="Ida" />}
        {hasReturn && returnLeg && <FlightLegSummary leg={returnLeg} label="Volta" reverse />}
      </div>
    </section>
  );
}

function PackageItinerary({ days, isRegional }: { days: ItineraryDay[]; isRegional: boolean }) {
  const title = isRegional ? "Expedição dia a dia" : "Roteiro dia a dia";

  return (
    <motion.section
      id="roteiro"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className={`experience-itinerary ${isRegional ? "experience-itinerary--regional" : ""}`}
      aria-labelledby="experience-itinerary-title"
    >
      <motion.div custom={0} variants={fadeUp} className="experience-itinerary__heading">
        <span className="experience-eyebrow">{isRegional ? "Expedição" : "Seu roteiro"}</span>
        <h2 id="experience-itinerary-title">{title}</h2>
        <p>
          {isRegional
            ? "Confira como será a programação da experiência, com cada etapa preparada para você aproveitar o destino com tranquilidade."
            : "Confira cada etapa da viagem, dos primeiros momentos no destino até o retorno para casa."}
        </p>
      </motion.div>

      <motion.ol custom={1} variants={fadeUp} className="experience-itinerary__timeline">
        {days.map((day) => {
          const dayNumber = String(day.day_number).padStart(2, "0");

          return (
            <li key={day.day_number} className="experience-itinerary__day">
              <div className="experience-itinerary__marker" aria-hidden="true">
                <span>{dayNumber}</span>
              </div>
              <div className="experience-itinerary__copy">
                <span>Dia {dayNumber}</span>
                <h3>{day.title}</h3>
                {day.description && <p className="whitespace-pre-wrap">{day.description}</p>}
              </div>
            </li>
          );
        })}
      </motion.ol>
    </motion.section>
  );
}

/**
 * PÁGINA DE DETALHES DO PACOTE
 * 
 * Juan, esta é a página mais importante do site kkk.
 * Aqui a gente mostra tudo o que o pacote oferece, fotos, roteiro e preços.
 * Nosso amigão freelancer deixou tudo organizado, não vai quebrar nada! kkk
 */
const PackageDetails = () => {
  const { slug: slugParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: siteSettings } = useSiteSettings();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedMenuItemIds, setSelectedMenuItemIds] = useState<string[]>([]);

  // Busca os dados do pacote pelo slug (usando slugParam pra não confundir o Juan kkk)
  const { data: pkg, isLoading } = useQuery({
    queryKey: ["package", slugParam],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugParam || "");

      let pkgQuery = supabase
        .from("packages")
        .select("*, package_inclusions(inclusion_key, label), package_itinerary_days(day_number, title, description), package_images(image_url, sort_order), available_slots, total_slots");

      if (isUuid) {
        pkgQuery = pkgQuery.eq("id", slugParam!);
      } else {
        pkgQuery = pkgQuery.eq("slug", slugParam!);
      }

      const { data, error } = await pkgQuery.single();
      if (error) throw error;
      return data;
    },
  });

  const isRegionalPackage = pkg?.package_type === "regional" || pkg?.category === "interno";

  // Busca itens do cardápio somente para experiências regionais.
  const { data: menuItems = [] } = useQuery({
    queryKey: ["package-menu-items", pkg?.id],
    enabled: Boolean(pkg?.id) && isRegionalPackage,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("package_menu_items")
        .select("*")
        .eq("package_id", pkg!.id)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["package-reviews", pkg?.id],
    enabled: !!pkg?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, avatar_url)")
        .eq("package_id", pkg!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: hasConfirmedReservation } = useQuery({
    queryKey: ["package-reservation", pkg?.id, user?.id],
    enabled: !!pkg?.id && !!user,
    queryFn: async () => {
      const { count } = await supabase
        .from("reservations")
        .select("*", { count: 'exact', head: true })
        .eq("package_id", pkg!.id)
        .eq("user_id", user!.id)
        .eq("status", "confirmado");
      return (count || 0) > 0;
    },
  });

  // O NOSSO NOVO HOOK DE FAVORITOS
  const { isFavorite, toggleFavorite } = useFavorite(pkg?.id);

  const addToCart = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast.error("Você precisa estar logado para adicionar itens ao carrinho");
        throw new Error("Não logado");
      }

      // Monta as seleções do cardápio para salvar no carrinho
      const menuSelections = menuItems
        .filter((item) => selectedMenuItemIds.includes(item.id))
        .map((item) => ({ id: item.id, name: item.name, price: item.price }));

      const travelDateToSave = isRegional
        ? getFixedPackageSchedule(pkg.travel_date, pkg.travel_time)?.dateTime || null
        : pkg.travel_date || null;

      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, people")
        .eq("user_id", user.id)
        .eq("package_id", pkg!.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ people: existing.people + 1, menu_selections: menuSelections, travel_date: travelDateToSave })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            package_id: pkg!.id,
            people: 1,
            menu_selections: menuSelections,
            travel_date: travelDateToSave,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-count", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
      toast.success(`${isRegional ? "Experiência" : "Pacote"} adicionado ao carrinho!`);
    },
    onError: (err: Error) => {
      if (err.message !== "Não logado") {
        toast.error("Erro ao adicionar ao carrinho");
      }
    }
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      await supabase.from("reviews").insert({
        package_id: pkg!.id,
        user_id: user!.id,
        rating: reviewRating,
        comment: reviewComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package-reviews", pkg?.id] });
      setReviewComment("");
      toast.success("Avaliação enviada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao enviar avaliação");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={48} />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <h1 className="text-2xl font-bold text-primary mb-2">Produto não encontrado</h1>
          <button onClick={() => navigate(-1)} className="text-accent underline">Voltar</button>
        </div>
      </div>
    );
  }

  const inclusions = pkg.package_inclusions || [];
  const itinerary = [...(pkg.package_itinerary_days || [])].sort((a, b) => a.day_number - b.day_number);
  const images = [...(pkg.package_images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const destinationName: string | null = pkg.destination_name || null;
  const installments = pkg.installments || 10;
  const isRegional = pkg.package_type === "regional" || pkg.category === "interno";
  const isExternal = !isRegional;
  const regionalSchedule = isRegional
    ? getFixedPackageSchedule(pkg.travel_date, pkg.travel_time)
    : null;
  const isSoldOut = pkg.sales_status === "sold_out" || pkg.status === "esgotado";
  const productLabel = isRegional ? "Experiência regional" : "Pacote externo";
  const scopeLabel = pkg.category === "cruzeiro"
    ? "Cruzeiro"
    : pkg.travel_scope === "international"
      ? "Internacional"
      : pkg.travel_scope === "national"
        ? "Nacional"
        : null;
  const availableSlots: number | null = pkg.available_slots ?? null;
  const totalSlots: number | null = pkg.total_slots ?? null;

  // Calcula o total dos extras do cardápio
  const menuExtrasTotal = menuItems
    .filter((item) => selectedMenuItemIds.includes(item.id))
    .reduce((sum, item) => sum + Number(item.price), 0);

  const totalWithExtras = Number(pkg.price) + menuExtrasTotal;
  const installmentValue = Math.round(totalWithExtras / installments);

  const toggleMenuItem = (id: string) => {
    setSelectedMenuItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // null when no reviews yet — display as "Novo" in the UI
  const avgRating = reviewsData && reviewsData.length > 0
    ? (reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length).toFixed(1)
    : null;

  const userHasReviewed = reviewsData?.some(r => r.user_id === user?.id);

  return (
    <div className="package-experience min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner — mt-16/lg:mt-20 empurra o banner para baixo do menu fixo */}
      <section className="experience-hero relative overflow-hidden mt-16 lg:mt-20">
        {pkg.cover_image_url && <motion.img
          src={pkg.cover_image_url || ""}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-6 right-6 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-all"
            onClick={() => toggleFavorite()}
            aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-evastur-red text-evastur-red" : "text-white"}
            />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-4 transition-colors"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ArrowLeft size={18} />
              Voltar
            </motion.button>

            <motion.div initial="hidden" animate="visible">
              <motion.div custom={0} variants={fadeUp} className="flex flex-wrap gap-2 mb-3 items-center">
                <Badge className="bg-evastur-red text-white border-0">
                  {productLabel}
                </Badge>
                {scopeLabel && (
                  <Badge variant="outline" className="border-white/30 text-white/90 backdrop-blur-sm">
                    {scopeLabel}
                  </Badge>
                )}
                {pkg.duration && (
                  <Badge variant="outline" className="border-white/30 text-white/90 backdrop-blur-sm">
                    <Clock size={12} className="mr-1" />
                    {pkg.duration}
                  </Badge>
                )}
                {isExternal && pkg.travel_date && (
                  <Badge variant="outline" className="border-amber-300/60 text-amber-200 backdrop-blur-sm bg-black/20">
                    <Calendar size={12} className="mr-1" />
                    Saída: {formatPackageDate(pkg.travel_date)}
                  </Badge>
                )}
                {regionalSchedule && (
                  <Badge variant="outline" className="border-amber-300/60 text-amber-200 backdrop-blur-sm bg-black/20">
                    <Calendar size={12} className="mr-1" />
                    {formatPackageDate(regionalSchedule.date)} às {regionalSchedule.time}
                  </Badge>
                )}
                {isSoldOut && (
                  <Badge className="bg-red-600 text-white border-0 animate-pulse">
                    <Ban size={12} className="mr-1" />
                    Esgotado
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-amber-400 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-sm font-medium border border-white/10">
                  {avgRating ? (
                    <>
                      <Star size={14} className="fill-amber-400" />
                      {avgRating} <span className="text-white/70 text-xs ml-1">({reviewsData?.length || 0})</span>
                    </>
                  ) : (
                    <span className="text-white/80 text-xs px-1">Novo</span>
                  )}
                </div>
              </motion.div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">Evastur · Viagens que ficam em você</p>
              <motion.h1 custom={1} variants={fadeUp} className="experience-title text-white mb-5 text-shadow-hero">
                {pkg.title}
              </motion.h1>

              {destinationName && (
                <motion.div custom={2} variants={fadeUp} className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin size={14} />
                  {destinationName}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="experience-facts">
        <div><Clock size={21} /><span>Duração<strong>{pkg.duration || "Consulte o roteiro"}</strong></span></div>
        <div><MapPin size={21} /><span>Seu próximo destino<strong>{destinationName || scopeLabel || "Explore com a Evastur"}</strong></span></div>
        <div><Compass size={21} /><span>Uma viagem do seu jeito<strong>{isRegional ? "Vivência regional" : "Viagem planejada"}</strong></span></div>
        <div><CreditCard size={21} /><span>Por pessoa, a partir de<strong>{Number(pkg.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></span></div>
      </div>
      <nav className="experience-navigation" aria-label="Seções do pacote">
        <a href="#visao-geral">Visão geral</a>
        {images.length > 0 && <a href="#fotos">Fotografias</a>}
        {itinerary.length > 0 && <a href="#roteiro">Seu roteiro</a>}
        {inclusions.length > 0 && <a href="#inclusoes">O que está incluso</a>}
        <a href="#reserva">Planejar minha viagem <ArrowRight size={14} /></a>
      </nav>
      {/* Content */}
      <div className="experience-content max-w-7xl mx-auto px-5 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Main Content */}
        <div id="visao-geral" className="experience-editorial lg:col-span-2 space-y-14">
          <div className="experience-introduction">
            <span className="experience-eyebrow">O extraordinário começa aqui</span>
            <h2>{isRegional ? "Desacelere. Explore. Viva o lugar." : "Uma nova paisagem. Uma nova história."}</h2>
          </div>
          {/* Overview */}
          {(pkg.short_description || pkg.full_description) && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <motion.h2 custom={0} variants={fadeUp} className="text-2xl font-bold text-primary">
                {isRegional ? "Sobre a experiência" : "Sobre o pacote"}
              </motion.h2>
              {pkg.short_description && (
                <motion.p custom={1} variants={fadeUp} className="text-muted-foreground leading-relaxed text-lg">
                  {pkg.short_description}
                </motion.p>
              )}
              {pkg.full_description && (
                <motion.p custom={2} variants={fadeUp} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {pkg.full_description}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Gallery */}
          {images.length > 0 && (
            <motion.div id="fotos" initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <span className="experience-eyebrow">Um olhar sobre a viagem</span>
              <motion.h2 custom={0} variants={fadeUp} className="text-2xl font-bold text-primary">
                Imagine-se aqui
              </motion.h2>
              <motion.div custom={1} variants={fadeUp} className="grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <button
                    type="button"
                    key={img.image_url}
                    aria-label={`Ampliar fotografia ${i + 1} de ${pkg.title}`}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`group relative rounded-2xl overflow-hidden bg-secondary/30 ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                  >
                    <img loading="lazy" src={img.image_url} alt={`${pkg.title} — fotografia ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <Maximize2 size={22} className="text-white" />
                        </div>
                        <span className="text-white text-xs font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                          Ampliar fotografia
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {itinerary.length > 0 && (
            <PackageItinerary days={itinerary} isRegional={isRegional} />
          )}

          {/* Inclusions */}
          {inclusions.length > 0 && (
            <motion.div id="inclusoes" initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <motion.h2 custom={0} variants={fadeUp} className="text-2xl font-bold text-primary">
                O que está incluso
              </motion.h2>
              <motion.div custom={1} variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {inclusions.map((inc) => {
                  const IconComp = inclusionIcons[inc.inclusion_key] || Map;
                  return (
                    <Card key={inc.inclusion_key} className="shadow-sm border-0 bg-secondary/30">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-evastur-red/10 flex items-center justify-center flex-shrink-0">
                          <IconComp size={20} className="text-evastur-red" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{inc.label}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Menu Items (internal packages only) */}
          {isRegional && menuItems.length > 0 && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <motion.div custom={0} variants={fadeUp} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                  <UtensilsCrossed size={18} className="text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary">Cardápio do Passeio</h2>
                  <p className="text-sm text-muted-foreground">Adicione itens ao seu passeio — o valor é somado ao total</p>
                </div>
              </motion.div>
              <motion.div custom={1} variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {menuItems.map((item) => {
                  const isSelected = selectedMenuItemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleMenuItem(item.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-border bg-card hover:border-orange-300 hover:bg-orange-50/30"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${isSelected ? "text-orange-700" : "text-foreground"}`}>
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-sm font-bold ${isSelected ? "text-orange-600" : "text-primary"}`}>
                            R$ {Number(item.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-orange-500 border-orange-500" : "border-muted-foreground/30"
                            }`}>
                            {isSelected && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
              {selectedMenuItemIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-orange-700">
                    <UtensilsCrossed size={16} />
                    <span className="text-sm font-medium">{selectedMenuItemIds.length} item(s) selecionado(s)</span>
                  </div>
                  <span className="font-bold text-orange-700">
                    + R$ {menuExtrasTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Reviews Section */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6 pt-8 border-t">
            <motion.h2 custom={0} variants={fadeUp} className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
              Avaliações <Badge variant="secondary" className="ml-2 font-mono">{avgRating}</Badge>
            </motion.h2>

            {/* Review Form for Eligible Users */}
            {hasConfirmedReservation && !userHasReviewed && (
              <motion.div custom={1} variants={fadeUp}>
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Avalie sua experiência</CardTitle>
                    <CardDescription>Compartilhe o que achou {isRegional ? "desta experiência" : "desta viagem"} com outros clientes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                          <Star size={24} className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Deixe um comentário curto (opcional)..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="resize-none"
                    />
                    <Button
                      onClick={() => submitReview.mutate()}
                      disabled={submitReview.isPending}
                      className="w-full sm:w-auto"
                    >
                      {submitReview.isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : "Enviar Avaliação"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* List Reviews */}
            <motion.div custom={2} variants={fadeUp} className="space-y-4">
              {reviewsData && reviewsData.length > 0 ? (
                reviewsData.map((review) => (
                  <div key={review.id} className="bg-secondary/20 p-5 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0 border">
                          {review.profiles?.avatar_url ? (
                            <img src={review.profiles.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle size={40} className="text-muted-foreground/50" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.profiles?.full_name || "Cliente Evastur"}</p>
                          <div className="flex text-amber-400 mt-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={12} className={star <= review.rating ? "fill-amber-400" : "text-muted-foreground/30"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground text-sm leading-relaxed mt-3 bg-white/50 p-3 rounded-lg border shadow-sm">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-6 bg-secondary/10 rounded-xl border border-dashed">
                  Ainda não há avaliações para {isRegional ? "esta experiência" : "este pacote"}.
                </p>
              )}
            </motion.div>

          </motion.div>
        </div>

        {/* Sidebar - Pricing */}
        <div id="reserva" className="lg:col-span-1">
          <div className="lg:sticky lg:top-36">
            <Card className="experience-booking border-primary/10 bg-white">
              <CardContent className="p-6 space-y-5">
                <div className="experience-booking-heading"><span className="experience-eyebrow">Sua próxima história</span><h2>Vamos viver essa viagem?</h2><p>Confira os detalhes e reserve com a Evastur.</p></div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">A partir de</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold tracking-tight text-primary">
                      R$ {Number(pkg.price).toLocaleString("pt-BR")}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">/pessoa</span>
                  </div>
                  {menuExtrasTotal > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{isRegional ? "Experiência base" : "Pacote base"}</span>
                        <span>R$ {Number(pkg.price).toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between text-xs text-orange-600 font-medium">
                        <span className="flex items-center gap-1"><UtensilsCrossed size={10} /> Extras do cardápio</span>
                        <span>+ R$ {menuExtrasTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-primary border-t pt-1 mt-1">
                        <span>Total</span>
                        <span>R$ {totalWithExtras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 bg-secondary/50 p-2 rounded border border-secondary">
                    ou {installments}x de <strong className="text-foreground">R$ {installmentValue.toLocaleString("pt-BR")}</strong>
                  </p>
                </div>

                {/* Vagas disponíveis */}
                {!isSoldOut && availableSlots != null && availableSlots > 0 && (
                  <div className={`flex items-center gap-2 text-sm py-3 px-3 rounded-xl border ${availableSlots <= 5
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}>
                    <Users size={16} className={availableSlots <= 5 ? "text-amber-500" : "text-emerald-500"} />
                    <div>
                      <span className={`font-bold ${availableSlots <= 5 ? "animate-pulse" : ""}`}>
                        {availableSlots <= 5 ? `Últimas ${availableSlots} vaga${availableSlots !== 1 ? "s" : ""}!` : `${availableSlots} vagas disponíveis`}
                      </span>
                      {totalSlots && (
                        <p className="text-xs opacity-70">de {totalSlots} no total</p>
                      )}
                    </div>
                  </div>
                )}

                {isSoldOut && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Ban size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-700">{productLabel} esgotado</p>
                      <p className="text-xs text-red-600/80">Este produto não está mais disponível para reserva.</p>
                    </div>
                  </div>
                )}

                {pkg.duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-2 border-b">
                    <Clock size={16} className="text-primary" />
                    <span className="font-medium">Duração:</span> {pkg.duration}
                  </div>
                )}

                {/* For non-internal packages: show admin-defined travel date */}
                {isExternal && pkg.travel_date && (
                  <div className="flex items-center gap-2 text-sm py-2 border-b">
                    <Calendar size={16} className="text-amber-500" />
                    <span className="font-medium text-amber-700">Data da Viagem:</span>
                    <span className="font-semibold text-amber-600">
                      {formatPackageDate(pkg.travel_date, true)}
                    </span>
                  </div>
                )}

                {regionalSchedule && (
                  <div className="flex items-start gap-3 py-3 border-b">
                    <Calendar size={17} className="mt-0.5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data e horário</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatPackageDate(regionalSchedule.date, true)} às {regionalSchedule.time}
                      </p>
                    </div>
                  </div>
                )}

                <PackageFlightSummary routeInfo={isExternal ? (pkg.route_info as RouteInfo | null) : null} />

                {/* Mantido temporariamente para compatibilidade enquanto o novo resumo de voo é validado. */}
                {SHOW_LEGACY_FLIGHT_SUMMARY && (() => {
                  const ri = pkg.route_info as RouteInfo | null;
                  if (!ri || typeof ri !== "object") return null;
                  const dep = ri.departure;
                  const ret = ri.return;
                  // Retrocompat: suporta dados antigos (from/to) e novos (cityFrom/cityTo/airportCodeFrom/airportCodeTo)
                  const getAirport = (leg: RouteLeg | undefined, dir: "From" | "To") => leg?.[`airportCode${dir}`] || "";
                  const getCity = (leg: RouteLeg | undefined, dir: "From" | "To") => leg?.[`city${dir}`] || leg?.[dir === "From" ? "from" : "to"] || "";
                  const getDepTime = (leg: RouteLeg | undefined) => leg?.departureTime || leg?.time || "";
                  const getArrTime = (leg: RouteLeg | undefined) => leg?.arrivalTime || "";

                  const hasDep = dep && (getCity(dep, "From") || getCity(dep, "To") || getAirport(dep, "From"));
                  const hasRet = ret && (getCity(ret, "From") || getCity(ret, "To") || getAirport(ret, "From"));
                  if (!hasDep && !hasRet) return null;

                  const formatFullDate = (d: string) => {
                    if (!d) return "";
                    const date = new Date(d + "T12:00:00");
                    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
                  };

                  const FlightLeg = ({ leg, label, color }: { leg: RouteLeg; label: string; color: "indigo" | "emerald" }) => {
                    const airFrom = getAirport(leg, "From");
                    const airTo = getAirport(leg, "To");
                    const cityFrom = getCity(leg, "From");
                    const cityTo = getCity(leg, "To");
                    const depTime = getDepTime(leg);
                    const arrTime = getArrTime(leg);
                    const airline = leg?.airline || "";
                    const stops = leg?.stops || "";
                    const duration = leg?.duration || "";
                    const baggage = leg?.baggage || "";
                    const dateStr = leg?.date ? formatFullDate(leg.date) : "";

                    const colorMap = {
                      indigo: {
                        border: "border-indigo-200",
                        bg: "bg-gradient-to-br from-indigo-50/80 to-white",
                        label: "text-indigo-600",
                        labelBg: "bg-indigo-600",
                        code: "text-slate-800",
                        city: "text-slate-500",
                        line: "border-indigo-300",
                        dot: "border-indigo-400 bg-indigo-100",
                        time: "text-slate-800",
                        meta: "text-slate-500",
                        duration: "text-indigo-600",
                      },
                      emerald: {
                        border: "border-emerald-200",
                        bg: "bg-gradient-to-br from-emerald-50/80 to-white",
                        label: "text-emerald-600",
                        labelBg: "bg-emerald-600",
                        code: "text-slate-800",
                        city: "text-slate-500",
                        line: "border-emerald-300",
                        dot: "border-emerald-400 bg-emerald-100",
                        time: "text-slate-800",
                        meta: "text-slate-500",
                        duration: "text-emerald-600",
                      },
                    };
                    const c = colorMap[color];

                    return (
                      <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
                        {/* Header: Label + Date + Bagagem */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 ${c.label}`}>
                              <Plane size={14} className={label === "IDA" ? "" : "rotate-180"} />
                              <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                            </div>
                            {dateStr && (
                              <span className="text-xs text-slate-400 ml-1">{dateStr}</span>
                            )}
                          </div>
                          {baggage && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span className="font-medium">Bagagem</span>
                              <div className="flex items-center gap-1">
                                <Luggage size={16} className="text-emerald-500" />
                                <Briefcase size={14} className="text-sky-500" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Body: Airline + Times + Route */}
                        <div className="px-4 py-4">
                          {/* Airline row */}
                          {airline && (() => {
                            const info = getAirlineInfo(airline);
                            return (
                              <div className="flex items-center gap-2 mb-3">
                                <div className={`w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0`}>
                                  {info?.logo ? (
                                    <img src={info.logo} alt={airline} className="w-5 h-5 object-contain" />
                                  ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full ${c.labelBg}`} />
                                  )}
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{airline}</span>
                                {info?.iata && (
                                  <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">{info.iata}</span>
                                )}
                              </div>
                            );
                          })()}

                          {/* Times + Stops + Duration row */}
                          <div className="flex items-center gap-3">
                            {/* Departure time */}
                            <div className="text-center min-w-[52px]">
                              <p className={`text-xl font-bold ${c.time} leading-none`}>{depTime || "--:--"}</p>
                            </div>

                            {/* Timeline connector */}
                            <div className="flex-1 flex flex-col items-center gap-0.5 px-1">
                              {stops && (
                                <span className="text-[10px] text-slate-400 font-medium">{stops}</span>
                              )}
                              <div className="w-full flex items-center gap-0">
                                <div className={`w-2 h-2 rounded-full border-2 ${c.dot} shrink-0`} />
                                <div className={`flex-1 border-t-2 border-dashed ${c.line}`} />
                                <div className={`w-2 h-2 rounded-full border-2 ${c.dot} shrink-0`} />
                              </div>
                            </div>

                            {/* Arrival time */}
                            <div className="text-center min-w-[52px]">
                              <p className={`text-xl font-bold ${c.time} leading-none`}>{arrTime || "--:--"}</p>
                            </div>

                            {/* Duration */}
                            {duration && (
                              <span className={`text-xs font-semibold ${c.duration} ml-1 whitespace-nowrap`}>{duration}</span>
                            )}

                            {/* Baggage detail */}
                            {baggage && (
                              <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-1">{baggage}</span>
                            )}
                          </div>

                          {/* Airport codes + cities row */}
                          {(airFrom || airTo) && (
                            <div className="flex items-start mt-2">
                              <div className="min-w-[52px] text-center">
                                <p className="text-sm font-bold text-slate-700 font-mono">{airFrom}</p>
                                <p className="text-[10px] text-slate-400 leading-tight">{cityFrom}</p>
                              </div>
                              <div className="flex-1" />
                              <div className="min-w-[52px] text-center">
                                <p className="text-sm font-bold text-slate-700 font-mono">{airTo}</p>
                                <p className="text-[10px] text-slate-400 leading-tight">{cityTo}</p>
                              </div>
                              {/* Spacers to align with duration/baggage columns */}
                              {duration && <div className="ml-1 min-w-[40px]" />}
                              {baggage && <div className="ml-1 min-w-[40px]" />}
                            </div>
                          )}

                          {/* Fallback: if no airport codes, show city names */}
                          {!airFrom && !airTo && (cityFrom || cityTo) && (
                            <div className="flex items-center mt-2">
                              <div className="min-w-[52px] text-center">
                                <p className="text-xs font-semibold text-slate-600">{cityFrom}</p>
                              </div>
                              <div className="flex-1" />
                              <div className="min-w-[52px] text-center">
                                <p className="text-xs font-semibold text-slate-600">{cityTo}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-3 py-3 border-b">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Plane size={15} className="text-indigo-500" />
                        Informações de Voo
                      </div>
                      {hasDep && <FlightLeg leg={dep} label="IDA" color="indigo" />}
                      {hasRet && <FlightLeg leg={ret} label="VOLTA" color="emerald" />}
                    </div>
                  );
                })()}


                {isSoldOut ? (
                  <>
                    <Button
                      className="w-full gap-2 bg-gray-400 text-white cursor-not-allowed"
                      size="lg"
                      disabled
                    >
                      <Ban size={20} />
                      Esgotado — Indisponível
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
                      size="lg"
                      onClick={() => {
                        const phone = siteSettings?.agencyWhatsapp?.replace(/\D/g, "") || "5568999872973";
                        const msg = encodeURIComponent(`Olá! Vi no site que ${isRegional ? "a experiência" : "o pacote"} *${pkg.title}* está esgotado. Gostaria de saber se há previsão de novas vagas ou opções similares. Obrigado!`);
                        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                      }}
                    >
                      <MessageCircle size={20} />
                      Falar com a Evastur
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                      size="lg"
                      onClick={async () => {
                        if (!user) {
                          navigate(`/login?redirect=/pacote/${slugParam}`);
                          return;
                        }
                        // Adiciona ao carrinho e vai direto pro checkout
                        await addToCart.mutateAsync();
                        navigate("/checkout");
                      }}
                      disabled={addToCart.isPending}
                    >
                      {addToCart.isPending ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <CreditCard size={20} />
                          {isRegional ? "Reservar experiência" : "Reservar pacote"}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full gap-2 border-primary text-primary hover:bg-primary/5 hover:text-primary transition-all"
                      size="lg"
                      onClick={() => addToCart.mutate()}
                      disabled={addToCart.isPending}
                    >
                      {addToCart.isPending ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                      {isRegional ? "Adicionar experiência ao carrinho" : "Adicionar pacote ao carrinho"}
                    </Button>
                  </>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Pagamento 100% seguro via PIX, Crédito ou Débito
                </p>
              </CardContent>
            </Card>

            {/* Package Details — Detalhes do Pacote */}
            {(() => {
              const pd = pkg.package_details as PackageDetail[] | null;
              if (!pd || !Array.isArray(pd) || pd.length === 0) return null;

              return (
                <div className="mt-4 p-5 rounded-xl border border-border bg-white shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                    <Info size={16} />
                    Detalhes Importantes
                  </h3>
                  <div className="space-y-3">
                    {pd.map((item, i) => (
                      <div key={i} className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{item.label}</span>
                        <span className="text-sm text-foreground font-medium leading-tight">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>
      <section className="experience-closing">
        <Compass size={32} strokeWidth={1} />
        <p>O próximo capítulo começa com uma viagem.</p>
        <a href="#reserva">Encontre seu lugar no mundo <ArrowRight size={16} /></a>
      </section>
      <Footer />
      <div className="experience-mobile-reserve lg:hidden">
        <div><span>{isSoldOut ? "Vagas esgotadas" : "Sua viagem, por pessoa"}</span><strong>{totalWithExtras.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
        <a href="#reserva">{isSoldOut ? "Consultar opções" : "Ver reserva"}<ArrowRight size={16} /></a>
      </div>
      <Dialog open={Boolean(selectedImage)} onOpenChange={(open) => { if (!open) setSelectedImage(null); }}>
        <DialogContent className="max-w-5xl border-0 bg-slate-950 p-3 text-white">
          <DialogTitle className="pr-8 text-sm">{pkg.title} · Fotografias</DialogTitle>
          <DialogDescription className="sr-only">Imagem ampliada da viagem. Use Escape para fechar.</DialogDescription>
          {selectedImage && <img src={selectedImage} alt={`Fotografia de ${pkg.title}`} className="max-h-[75vh] w-full object-contain" />}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => <button key={image.image_url} aria-label={`Ver fotografia ${index + 1}`} aria-pressed={selectedImage === image.image_url} onClick={() => setSelectedImage(image.image_url)} className="shrink-0 rounded border-2 border-transparent focus-visible:border-white aria-pressed:border-white"><img src={image.image_url} alt="" className="h-14 w-20 rounded object-cover" /></button>)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageDetails;
