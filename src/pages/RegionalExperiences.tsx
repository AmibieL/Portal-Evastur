import { useEffect, useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Compass, Leaf, Loader2, MessageCircle, Trees } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegionalPackageCard from "@/components/regional/RegionalPackageCard";
import rioCroaImage from "@/assets/acre-gallery/rio-croa-cover.webp";
import { supabase } from "@/integrations/supabase/client";

export default function RegionalExperiences() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Experiências em Cruzeiro do Sul e no Acre | Evastur";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const {
    data: packages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["regional-packages-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("active", true)
        .in("status", ["ativo", "esgotado"])
        .or("package_type.eq.regional,category.eq.interno")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-[#f6f7f3] text-slate-950">
      <Navbar />

      <main>
        <section className="relative flex min-h-[620px] items-end overflow-hidden pt-16 text-white lg:min-h-[720px] lg:pt-20">
          <img
            src={rioCroaImage}
            alt="Passeio regional de canoa em meio à natureza do Rio Croa"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,16,13,0.91)_0%,rgba(2,16,13,0.66)_48%,rgba(2,16,13,0.28)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07120f]/95 via-transparent to-black/20" />

          <div className="container relative z-10 mx-auto px-4 pb-16 pt-24 lg:px-8 lg:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
                <span className="h-px w-9 bg-emerald-300" />
                Cruzeiro do Sul &amp; Vale do Juruá
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Viva o Acre de um jeito inesquecível
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                Passeios regionais selecionados para aproximar você dos rios, da floresta e da cultura do nosso lugar.
              </p>

              <a
                href="#experiencias"
                className="mt-8 inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-emerald-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950 motion-reduce:transform-none"
              >
                Ver experiências
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </section>

        <section id="experiencias" className="scroll-mt-20 py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.5 }}
              className="mb-12 flex flex-col gap-6 border-b border-slate-200 pb-9 md:flex-row md:items-end md:justify-between"
            >
              <div className="max-w-2xl">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-emerald-800">
                  <Leaf size={15} /> Experiências regionais
                </p>
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl">
                  Escolha sua próxima experiência
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Pacotes criados pela equipe Evastur para quem quer descobrir o Acre com praticidade e acompanhamento local.
                </p>
              </div>

              {!isLoading && !isError ? (
                <p className="shrink-0 text-sm font-medium text-slate-500">
                  <strong className="mr-1 text-2xl font-extrabold text-primary">
                    {packages.length}
                  </strong>
                  {packages.length === 1 ? "experiência disponível" : "experiências disponíveis"}
                </p>
              ) : null}
            </motion.div>

            {isLoading ? (
              <div className="flex min-h-72 items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto animate-spin text-emerald-800" size={34} />
                  <p className="mt-4 text-sm text-slate-500">Buscando experiências...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-rose-200 bg-white px-6 py-14 text-center">
                <Compass className="mx-auto text-rose-600" size={34} />
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Não foi possível carregar as experiências
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                  Tente novamente em alguns instantes ou fale com nossa equipe para conhecer os passeios disponíveis.
                </p>
              </div>
            ) : packages.length === 0 ? (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-64 overflow-hidden">
                    <img
                      src={rioCroaImage}
                      alt="Natureza do Rio Croa"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-950/20" />
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-12">
                    <Trees className="text-emerald-800" size={34} />
                    <h3 className="mt-5 text-2xl font-bold tracking-tight text-primary">
                      Novas experiências estão sendo preparadas
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
                      Nossa equipe está organizando os próximos passeios regionais. Enquanto isso, conte para a gente o que você gostaria de conhecer.
                    </p>
                    <Link
                      to="/contato"
                      className="mt-6 inline-flex w-fit items-center gap-2 font-bold text-accent transition-colors hover:text-primary"
                    >
                      Falar com a Evastur <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {packages.map((packageData, index) => (
                  <RegionalPackageCard
                    key={packageData.id}
                    packageData={packageData}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-primary py-16 text-white sm:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  Atendimento próximo
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Precisa de ajuda para escolher?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                  Nossa equipe conhece a região e ajuda você a encontrar o passeio ideal para o seu ritmo.
                </p>
              </div>
              <Link
                to="/contato"
                className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 motion-reduce:transform-none"
              >
                <MessageCircle size={18} /> Falar com a equipe
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
