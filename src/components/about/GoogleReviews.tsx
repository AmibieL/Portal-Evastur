import { Star, ExternalLink, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  name: string;
  rating: number;
  text: string;
  initials: string;
  color: string;
}

const reviews: Review[] = [
  {
    name: "Geneci de S Ermita",
    rating: 5,
    text: "Que viagem inesquecível! San Andrés superou todas as expectativas com aquele mar de sete cores de tirar o fôlego. A hospedagem no Hotel Decameron Isleño foi o ponto alto: serviço de hotelaria impecável, acomodações confortáveis e uma alimentação simplesmente fantástica. Tudo pensado para o nosso total descanso e prazer. Um agradecimento especial à nossa agência Evastour! Atendimento nota 10, suporte sensacional e organização perfeita. Recomendamos de olhos fechados para quem busca uma experiência de viagem sem preocupações.",
    initials: "GE",
    color: "hsl(200 80% 50%)",
  },
  {
    name: "Edenise Andrade",
    rating: 5,
    text: "Atendimento excelente.",
    initials: "EA",
    color: "hsl(330 75% 55%)",
  },
  {
    name: "Bruno Melo",
    rating: 5,
    text: "Melhor agência de viagens e turismo da cidade",
    initials: "BM",
    color: "hsl(145 65% 45%)",
  },
  {
    name: "Jonatan Fernandes",
    rating: 5,
    text: "Ótimo atendimento e suporte.",
    initials: "JF",
    color: "hsl(260 70% 60%)",
  },
  {
    name: "Paulo Moll",
    rating: 5,
    text: "Foi excelente porquê atendeu rápido e com competência.",
    initials: "PM",
    color: "hsl(15 85% 55%)",
  },
  {
    name: "Ronei Alves Pequeno",
    rating: 5,
    text: "Ótima empresa, o proprietário perde o sono para lembrar vc de sua passagem 👏👏",
    initials: "RP",
    color: "hsl(45 90% 50%)",
  },
  {
    name: "Ingride Maria",
    rating: 5,
    text: "Maravilhosa, melhor agência de viagem de CZS, sempre solícitos e buscando a melhor forma de atender...",
    initials: "IM",
    color: "hsl(170 70% 45%)",
  },
  {
    name: "Elielson Araujo",
    rating: 5,
    text: "Sem dúvidas, a melhor agência de CZS e região. Atendimento das funcionárias é muito bom, e os preços das passagens mais ainda.",
    initials: "EL",
    color: "hsl(220 75% 55%)",
  },
  {
    name: "Luiz Augusto Batista",
    rating: 5,
    text: "Pioneiros no Vale do Juruá. Competentes e honestos liderados pelo Sr Francisco. A melhor agência do Vale do Juruá.",
    initials: "LA",
    color: "hsl(350 75% 50%)",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "text-amber-400 fill-amber-400" : "text-white/15"}
      />
    ))}
  </div>
);

const GoogleReviews = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-background via-blue-50/20 to-background">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70 mb-4">
            <Star size={13} className="fill-current" />
            Avaliações reais
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Nota real do Google — direto de quem viajou com a Evastur.
          </p>

          {/* Overall Rating Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-5 bg-card border border-border/50 rounded-2xl px-8 py-5 shadow-lg"
          >
            {/* Google "G" logo */}
            <div className="flex-shrink-0">
              <svg viewBox="0 0 48 48" className="w-10 h-10">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-extrabold text-foreground">4.9</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Baseado em <span className="font-semibold text-foreground">29 avaliações</span> no Google
              </p>
            </div>

            <a
              href="https://www.google.com/search?q=Evastur+Ag%C3%AAncia+de+Viagens+e+Turismo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 ml-2 text-primary hover:text-primary/80 transition-colors"
              title="Ver no Google"
            >
              <ExternalLink size={18} />
            </a>
          </motion.div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote
                size={28}
                className="absolute top-5 right-5 text-primary/8 group-hover:text-primary/15 transition-colors duration-300"
              />

              {/* Header: Avatar + Name + Rating */}
              <div className="flex items-start gap-3.5 mb-4">
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: review.color }}
                >
                  {review.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-sm truncate">{review.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                "{review.text.length > 150 ? review.text.slice(0, 150).trimEnd() + '...' : review.text}"
                {review.text.length > 150 && (
                  <a
                    href="https://www.google.com/search?q=Evastur+Ag%C3%AAncia+de+Viagens+e+Turismo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 ml-1 text-primary font-semibold hover:underline"
                  >
                    Ler mais
                    <ExternalLink size={12} />
                  </a>
                )}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${review.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* See all link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.google.com/search?q=Evastur+Ag%C3%AAncia+de+Viagens+e+Turismo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
          >
            Ver todas as avaliações no Google
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviews;
