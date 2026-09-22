import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import rioCroaImage from "@/assets/acre-gallery/rio-croa-cover.webp";

const experiences = ["Ecoturismo", "Vivências indígenas", "Expedições fluviais", "Sabores locais"];

export default function RegionalDestinationsSection() {
  return (
    <section className="bg-[#f7f6f2] py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden bg-[#0b352d] text-white lg:grid lg:min-h-[610px] lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="relative min-h-[390px] overflow-hidden lg:min-h-full">
            <img
              src={rioCroaImage}
              alt="Passeio de canoa no Rio Croa, em Cruzeiro do Sul"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061f1a]/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0b352d]/20" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs font-medium text-white/80">
              <MapPin size={14} /> Rio Croa · Acre
            </div>
          </div>

          <div className="flex flex-col justify-center px-7 py-12 sm:px-10 lg:px-14 lg:py-16 xl:px-20">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
              Uma coleção à parte
            </p>
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              O Acre começa em Cruzeiro do Sul
            </h2>
            <p className="mt-6 text-base leading-relaxed text-emerald-50/72">
              Passeios regionais criados pela equipe Evastur para aproximar você dos rios, da floresta e da cultura do Vale do Juruá. Uma página exclusiva, com experiências cadastradas diretamente como pacotes.
            </p>

            <div className="mt-8 grid grid-cols-2 border-y border-white/15 py-2">
              {experiences.map((experience) => (
                <span key={experience} className="border-b border-white/10 py-3 text-xs font-medium text-white/72 even:pl-4 [&:nth-last-child(-n+2)]:border-b-0">
                  {experience}
                </span>
              ))}
            </div>

            <Link
              to="/cruzeiro-do-sul"
              className="group mt-9 inline-flex min-h-12 w-fit items-center gap-4 bg-white px-6 py-3 text-sm font-semibold text-[#0b352d] transition-colors hover:bg-emerald-50"
            >
              Ver experiências regionais
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
