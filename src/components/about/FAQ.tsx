import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "A Evastur é uma agência de verdade?",
    answer: "Sim. Atuamos desde 1996 com CNPJ, certificações do trade e parcerias oficiais com operadoras, hotéis e cias aéreas.",
  },
  {
    question: "Vocês dão suporte durante a viagem?",
    answer: "100%. Do planejamento ao retorno, nossa equipe acompanha tudo: documentação, check-ins, remarcações e emergências.",
  },
  {
    question: "Consigo um roteiro personalizado?",
    answer: "Esse é o nosso padrão. Ajustamos cada etapa ao seu estilo, orçamento e tempo — com dicas locais e experiências únicas.",
  },
  {
    question: "E se eu já tiver passagens?",
    answer: "Sem problema. Podemos cuidar do resto: hospedagem, transfers, seguro, passeios e concierge no destino.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-blue-50/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70 mb-4">
            <HelpCircle size={13} />
            Dúvidas frequentes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
            Perguntas frequentes
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 rounded-2xl px-6 bg-card hover:shadow-md transition-shadow duration-300 data-[state=open]:shadow-lg data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline py-5 text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
