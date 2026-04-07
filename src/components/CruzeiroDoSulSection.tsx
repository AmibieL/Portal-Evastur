import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { MapPin, Leaf, Car, Home, Coffee, Map, ArrowRight, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

// Mapeia índices do array para as classes específicas do mosaico
const getBentoClasses = (index: number) => {
  const pattern = index % 4;
  switch (pattern) {
    case 0: return "md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[420px]";
    case 1: return "min-h-[200px] md:min-h-0";
    case 2: return "min-h-[200px] md:min-h-0";
    case 3: return "md:col-span-2 min-h-[200px] md:min-h-[200px]";
    default: return "";
  }
};

const inclusionIcons: Record<string, typeof Car> = {
  translado: Car,
  hospedagem: Home,
  alimentacao: Coffee,
  guia: Map,
};

const CruzeiroDoSulSection = () => {
  // Busca as categorias dinamicamente
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["cruzeiro-categories-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cruzeiro_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ["cruzeiro-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*, package_inclusions(inclusion_key, label)")
        .eq("active", true)
        .eq("status", "ativo")
        .eq("category", "interno")
        .order("price")
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 bg-secondary text-accent px-4 py-2 rounded-full mb-5">
            <Leaf size={14} />
            <span className="text-sm font-semibold uppercase tracking-wider">Descubra o Acre</span>
          </motion.div>
          <motion.h2 custom={1} variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Visite Cruzeiro do Sul
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} className="text-muted-foreground text-lg">
            A jóia do Extremo Ocidente. Natureza intocada, cultura rica e paisagens que vão tirar o seu fôlego.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {isLoadingCategories ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Em breve: Novas categorias e passeios.
            </div>
          ) : (
            categories.map((item, i) => (
              <motion.div key={item.id} custom={i} variants={fadeUp} className={`group relative rounded-2xl overflow-hidden cursor-pointer ${getBentoClasses(i)}`}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-secondary transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                  )}
                  <div className="overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                    <Link to={`/cruzeiro/${item.slug}`} className="mt-2 inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-foreground/30 transition-colors">
                      Ver Roteiros
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Packages */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <motion.div custom={0} variants={fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-evastur-red mb-4">
              <MapPin size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">Experiências Exclusivas</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-primary">Pacotes Regionais Exclusivos</h3>
          </motion.div>

          {isLoadingPackages ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Em breve: Novos roteiros
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <motion.div key={pkg.id} custom={i + 1} variants={fadeUp} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    {pkg.cover_image_url ? (
                      <img src={pkg.cover_image_url} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-secondary group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {pkg.category === "interno" ? "Regional" : "Externo"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-primary text-lg mb-3">{pkg.title}</h4>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {((pkg as any).package_inclusions || []).slice(0, 4).map((inc: any) => {
                        const IconComp = inclusionIcons[inc.inclusion_key] || Map;
                        return (
                          <div key={inc.inclusion_key} className="flex items-center gap-2 text-muted-foreground text-sm">
                            <IconComp size={14} className="text-evastur-lightBlue shrink-0" />
                            {inc.label}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground">A partir de</span>
                        <p className="text-xl font-bold text-primary">R$ {Number(pkg.price).toLocaleString("pt-BR")}</p>
                      </div>
                      <Link to={`/pacote/${pkg.slug}`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
                        <Eye size={16} />
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CruzeiroDoSulSection;
