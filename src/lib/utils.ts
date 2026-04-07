import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A "FARMÁCIA" DE UTILITÁRIOS
 * 
 * Juan, aqui ficam as funções que a gente usa em todo canto pra não repetir código.
 */

/**
 * O FAMOSO 'CN' (O SALVADOR DO TAILWIND)
 * 
 * Sabe quando você quer passar uma classe por prop mas ela briga com a classe padrão?
 * Essa função resolve a treta. Ela junta as classes (clsx) e resolve os conflitos
 * do Tailwind (twMerge) pra você não ficar maluco com o CSS.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * GERADOR DE SLUG (PRA DEIXAR AS URLS BONITINHAS)
 * 
 * Pega um título tipo "Viagem para o Acre 2024" e transforma em "viagem-para-o-acre-2024".
 * Essencial pro SEO não chorar.
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos (adeus "ã", "é", etc)
    .trim()
    .replace(/\s+/g, "-") // Troca espaços por tracinhos
    .replace(/[^\w-]+/g, ""); // Remove tudo que não for letra ou número
};
