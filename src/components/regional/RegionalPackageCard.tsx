import { ArrowUpRight, Ban, Clock3, MapPin, Route } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import fallbackImage from "@/assets/acre-gallery/rio-croa-cover.webp";
import type { Database } from "@/integrations/supabase/types";

type RegionalPackage = Database["public"]["Tables"]["packages"]["Row"];

interface RegionalPackageCardProps {
  packageData: RegionalPackage;
  index: number;
}

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export default function RegionalPackageCard({
  packageData,
  index,
}: RegionalPackageCardProps) {
  const isSoldOut =
    packageData.sales_status === "sold_out" || packageData.status === "esgotado";
  const location = packageData.destination_name || "Cruzeiro do Sul, Acre";

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.07, 0.28),
        ease: [0.25, 0, 0.2, 1],
      }}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.42)]"
    >
      <Link
        to={`/pacote/${packageData.slug}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-label={`Ver experiência ${packageData.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-emerald-950">
          <img
            src={packageData.cover_image_url || fallbackImage}
            alt={packageData.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-900/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              Experiência regional
            </span>
            {isSoldOut ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700">
                <Ban size={11} /> Esgotado
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex items-start gap-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-emerald-800">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>{location}</span>
          </div>

          <h2 className="text-xl font-bold leading-tight tracking-[-0.02em] text-slate-950 transition-colors group-hover:text-primary sm:text-2xl">
            {packageData.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {packageData.short_description ||
              "Uma experiência regional preparada para você conhecer o Acre com conforto e acompanhamento local."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
            <div className="flex items-center gap-2.5">
              <Clock3 size={17} className="shrink-0 text-emerald-800" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Duração
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-800">
                  {packageData.duration || "Consulte"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 border-l border-slate-100 pl-3">
              <Route size={17} className="shrink-0 text-emerald-800" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Modalidade
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-800">Passeio local</p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div className={isSoldOut ? "opacity-55" : ""}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                A partir de
              </p>
              <p
                className={`mt-1 text-xl font-extrabold leading-none ${
                  isSoldOut ? "text-slate-500 line-through" : "text-primary"
                }`}
              >
                {formatPrice(Number(packageData.price))}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">por pessoa</p>
            </div>

            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:shadow-md">
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

