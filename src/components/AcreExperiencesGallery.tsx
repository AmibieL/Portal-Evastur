import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import navegacaoRioCroaImage from "@/assets/acre-gallery/navegacao-rio-croa.webp";
import florestaRioCroaImage from "@/assets/acre-gallery/floresta-rio-croa.webp";
import paisagemRibeirinhaImage from "@/assets/acre-gallery/paisagem-ribeirinha-acre.webp";
import comunidadeRibeirinhaImage from "@/assets/acre-gallery/comunidade-ribeirinha-acre.webp";

const galleryItems = [
  {
    src: navegacaoRioCroaImage,
    title: "Navegação no Rio Croa",
    alt: "Passeio de barco pelo Rio Croa em um dia de chuva",
    className: "md:col-span-2 xl:col-span-8 xl:row-span-1",
    imagePosition: "object-center",
  },
  {
    src: florestaRioCroaImage,
    title: "Encontro com a floresta",
    alt: "Barco navegando por águas cercadas pela floresta acreana",
    className: "xl:col-span-4 xl:row-span-1",
    imagePosition: "object-center",
  },
  {
    src: paisagemRibeirinhaImage,
    title: "Paisagens do Acre",
    alt: "Paisagem ribeirinha com vegetação amazônica e estrutura coberta ao fundo",
    className: "xl:col-span-4 xl:row-span-1",
    imagePosition: "object-center",
  },
  {
    src: comunidadeRibeirinhaImage,
    title: "Vida às margens do rio",
    alt: "Comunidade ribeirinha refletida nas águas de um rio acreano",
    className: "md:col-span-2 xl:col-span-8 xl:row-span-1",
    imagePosition: "object-center",
  },
];

const galleryAnimation = {
  hidden: { opacity: 0, y: 22 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.07,
      duration: 0.55,
      ease: [0.25, 0, 0.2, 1] as const,
    },
  }),
};

export default function AcreExperiencesGallery() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="experiencias-acre"
      aria-labelledby="acre-experiences-title"
      className="relative overflow-hidden bg-[#f8f9fb] py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"
      />

      <div className="container mx-auto px-4 lg:px-8">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 max-w-3xl sm:mb-12"
        >
          <span aria-hidden="true" className="mb-5 block h-0.5 w-12 bg-accent" />
          <h2
            id="acre-experiences-title"
            className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-primary sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Experiências no Acre
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Natureza, cultura e paisagens que fazem do Juruá um destino único.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-12 xl:grid-rows-[360px_270px]">
          {galleryItems.map((item, index) => (
            <motion.figure
              key={item.title}
              custom={index}
              variants={shouldReduceMotion ? undefined : galleryAnimation}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              viewport={{ once: true, margin: "-60px" }}
              className={`group relative min-h-[260px] overflow-hidden rounded-[10px] bg-slate-200 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] md:min-h-[320px] xl:min-h-0 ${item.className}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.025] ${item.imagePosition}`}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium tracking-[0.01em] text-white sm:p-6 sm:text-base">
                {item.title}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-10 flex justify-center sm:mt-12"
        >
          <Link
            to="/cruzeiro-do-sul"
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-16px_rgba(0,22,95,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[hsl(232_100%_28%)] hover:shadow-[0_18px_34px_-16px_rgba(0,22,95,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 motion-reduce:transform-none sm:px-9 sm:text-base"
          >
            Conheça Cruzeiro do Sul
            <ArrowRight
              aria-hidden="true"
              size={18}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
