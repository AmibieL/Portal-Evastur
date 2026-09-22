import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Anchor, Loader2 } from "lucide-react";

import DestinationCard from "@/components/DestinationCard";
import { supabase } from "@/integrations/supabase/client";

const CruiseCarousel = () => {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["cruise-carousel-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("active", true)
        .in("status", ["ativo", "esgotado"])
        .eq("category", "cruzeiro")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  if (!isLoading && packages.length === 0) return null;

  return (
    <section id="cruzeiros" className="scroll-mt-20 overflow-hidden bg-[#071440] py-20 text-white sm:py-24 lg:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 grid gap-6 border-b border-white/15 pb-9 lg:grid-cols-[1fr_0.65fr] lg:items-end"
        >
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              <Anchor size={15} strokeWidth={1.6} /> Temporada de cruzeiros
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Novos horizontes, vistos do mar
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-white/65 lg:justify-self-end">
            De expedições fluviais a travessias internacionais, selecionamos viagens para quem quer descobrir o percurso tanto quanto o destino.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-white/40" size={34} strokeWidth={1.5} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                custom={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: (itemIndex: number) => ({
                    opacity: 1,
                    y: 0,
                    transition: { delay: itemIndex * 0.07, duration: 0.42 },
                  }),
                }}
              >
                <DestinationCard
                  id={pkg.id}
                  image={pkg.cover_image_url || ""}
                  title={pkg.title}
                  location={pkg.destination_name || "Cruzeiro"}
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

export default CruiseCarousel;
