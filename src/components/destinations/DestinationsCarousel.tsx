import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Map } from "lucide-react";

import DestinationCard from "@/components/DestinationCard";
import { supabase } from "@/integrations/supabase/client";

type PackageFilter = "todos" | "nacional" | "internacional";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.42, ease: [0.25, 0, 0.2, 1] as const },
  }),
};

const DestinationsCarousel = () => {
  const [activeFilter, setActiveFilter] = useState<PackageFilter>("todos");
  const { data: packages = [], isLoading, isError } = useQuery({
    queryKey: ["carousel-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("active", true)
        .in("status", ["ativo", "esgotado"])
        .in("category", ["nacional", "internacional"])
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  const counts = useMemo(
    () => ({
      nacional: packages.filter((item) => item.category === "nacional").length,
      internacional: packages.filter((item) => item.category === "internacional").length,
    }),
    [packages],
  );

  const visiblePackages = useMemo(
    () => activeFilter === "todos" ? packages : packages.filter((item) => item.category === activeFilter),
    [activeFilter, packages],
  );

  const filters = [
    { id: "todos" as const, label: "Todos" },
    ...(counts.nacional > 0 ? [{ id: "nacional" as const, label: "Brasil" }] : []),
    ...(counts.internacional > 0 ? [{ id: "internacional" as const, label: "Internacionais" }] : []),
  ];

  return (
    <section id="pacotes" className="scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-11 grid gap-8 border-b border-slate-200 pb-9 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d50030]">
              <Map size={15} strokeWidth={1.6} /> Curadoria Evastur
            </p>
            <h2 className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">
              Viagens pelo Brasil e pelo mundo
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
              Pacotes completos com datas, hospedagem e condições apresentadas de forma clara para você escolher com segurança.
            </p>
          </div>

          {!isLoading && packages.length > 0 && (
            <div className="flex flex-wrap gap-1 border-b border-slate-300" aria-label="Filtrar pacotes por categoria">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                    activeFilter === filter.id ? "text-primary" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {filter.label}
                  {activeFilter === filter.id && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#d50030]" />}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary/35" size={34} strokeWidth={1.5} />
          </div>
        ) : isError ? (
          <p className="border border-slate-200 py-12 text-center text-sm text-slate-500">
            Não foi possível carregar os pacotes agora. Tente novamente em instantes.
          </p>
        ) : visiblePackages.length === 0 ? (
          <p className="border border-slate-200 py-12 text-center text-sm text-slate-500">
            Novos roteiros serão publicados em breve.
          </p>
        ) : (
          <motion.div
            key={activeFilter}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visiblePackages.map((pkg, index) => (
              <motion.div key={pkg.id} custom={index} variants={cardVariants}>
                <DestinationCard
                  id={pkg.id}
                  image={pkg.cover_image_url || ""}
                  title={pkg.title}
                  location={pkg.destination_name || ""}
                  description={pkg.short_description || ""}
                  installments={pkg.installments || 10}
                  installmentValue={Math.round(pkg.price / (pkg.installments || 10))}
                  totalPrice={pkg.price}
                  slug={pkg.slug}
                  category={pkg.category}
                  status={pkg.status}
                  appearance="editorial"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DestinationsCarousel;
