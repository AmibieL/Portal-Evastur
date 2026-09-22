import { Anchor, ArrowDownRight, Globe2, Map } from "lucide-react";
import { motion } from "framer-motion";

const collections = [
  {
    number: "01",
    icon: Map,
    title: "Brasil",
    description: "Praias, serras e cidades escolhidas para viajar pelo país com tranquilidade.",
    href: "#pacotes",
  },
  {
    number: "02",
    icon: Globe2,
    title: "Mundo",
    description: "Roteiros internacionais com suporte desde o planejamento até o seu retorno.",
    href: "#pacotes",
  },
  {
    number: "03",
    icon: Anchor,
    title: "Cruzeiros",
    description: "Temporadas selecionadas para descobrir novos lugares a bordo.",
    href: "#cruzeiros",
  },
];

const CategoriesSection = () => (
  <section className="border-b border-[#dddcd6] bg-[#f7f6f2] py-16 sm:py-20">
    <div className="container mx-auto px-5 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d50030]">
          Escolha seu caminho
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:justify-self-end md:text-right">
          Encontre a viagem certa pelo tipo de experiência. Os roteiros do Acre ficam em uma coleção própria, criada por quem conhece a região.
        </p>
      </motion.div>

      <div className="grid border-y border-[#d6d4cc] md:grid-cols-3 md:divide-x md:divide-[#d6d4cc]">
        {collections.map((collection, index) => (
          <motion.a
            key={collection.title}
            href={collection.href}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="group border-b border-[#d6d4cc] py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.18em] text-slate-400">{collection.number}</span>
              <collection.icon size={19} strokeWidth={1.5} className="text-primary" />
            </div>
            <div className="flex items-end justify-between gap-5">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{collection.title}</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">{collection.description}</p>
              </div>
              <ArrowDownRight size={21} className="mb-1 shrink-0 text-slate-400 transition-colors group-hover:text-[#d50030]" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
