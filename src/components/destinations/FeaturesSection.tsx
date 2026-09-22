import { Check } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Curadoria confiável",
    description: "Hospedagens, guias locais e experiências avaliadas pela nossa equipe.",
  },
  {
    number: "02",
    title: "Detalhes personalizados",
    description: "Cada viagem considera seu ritmo, companhia e motivo para viajar.",
  },
  {
    number: "03",
    title: "Assistência contínua",
    description: "Acompanhamento antes, durante e depois da viagem pelos nossos canais.",
  },
];

const checklist = [
  "Passagens aéreas e transfers",
  "Hospedagens selecionadas",
  "Guias locais especializados",
  "Seguro viagem e suporte",
];

const FeaturesSection = () => (
  <section className="border-y border-slate-200 bg-white py-20 sm:py-24 lg:py-28">
    <div className="container mx-auto px-5 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d50030]">Viaje com a Evastur</p>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-primary sm:text-5xl">
            Planejamento atento, do primeiro contato ao retorno
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
            Combinamos bons parceiros, serviços essenciais e atendimento próximo para que cada etapa aconteça com tranquilidade.
          </p>

          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                <Check size={15} strokeWidth={2} className="shrink-0 text-[#d50030]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="border-t border-slate-300">
          {features.map((feature, index) => (
            <motion.article
              key={feature.number}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="grid grid-cols-[auto_1fr] gap-5 border-b border-slate-300 py-7 sm:grid-cols-[56px_0.7fr_1fr] sm:items-start"
            >
              <span className="text-xs font-semibold tracking-[0.15em] text-slate-400">{feature.number}</span>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{feature.title}</h3>
              <p className="col-start-2 text-sm leading-relaxed text-slate-600 sm:col-start-3">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
