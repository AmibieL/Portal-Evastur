import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * ESTRUTURA GLOBAL CONFIGURÁVEL
 * 
 * Define todos os campos que a agência pode editar no banco de dados.
 */
export interface SiteSettings {
    agencyName: string;
    agencyEmail: string;
    agencyPhone: string;
    agencyWhatsapp: string;
    agencyAddress: string;
    agencyDescription: string;
    cadastur: string;
    socialInstagram: string;
    socialFacebook: string;
    socialYoutube: string;
    seoTitle: string;
    seoDescription: string;
    whatsappLink: string;
}

/**
 * O BUSCADOR DE CONFIGS (USE SITE SETTINGS)
 * 
 * Juan, este hook é a mão na roda que pega tudo que o dono da agência configurou:
 * Nome, e-mail, telefone, links de redes sociais... Ele já entrega tudo mastigado.
 * Se o site aparecer com nome "Evastur" mas era pra ser outro, a culpa é do banco de dados kkk.
 */
export function useSiteSettings() {
    return useQuery({
        queryKey: ["site-settings-global"],
        queryFn: async (): Promise<SiteSettings> => {
            // Busca todas as chaves e valores da tabela de settings
            const { data, error } = await supabase.from("site_settings").select("key, value");
            if (error) throw error;

            // Transforma o array de linhas [{key: '...', value: '...'}] em um objeto JS
            const map = data.reduce((acc, row) => {
                acc[row.key] = row.value;
                return acc;
            }, {} as Record<string, string>);

            // Limpa o número de WhatsApp para gerar o link wa.me
            const phoneOnlyNumbers = (map.company_whatsapp || "5568999872973").replace(/\D/g, "");

            // Retorna o objeto estruturado com valores padrão (fallbacks) caso o banco esteja vazio
            return {
                agencyName: map.company_name || "Evastur",
                agencyEmail: map.company_email || "contato@evastur.com.br",
                agencyPhone: map.company_phone || "(68) 99987-2973",
                agencyWhatsapp: map.company_whatsapp || "5568999872973",
                agencyAddress: map.company_address || "Cruzeiro do Sul – AC, Brasil",
                agencyDescription: map.company_description || "Agência de turismo especializada em experiências autênticas na Amazônia Ocidental.",
                cadastur: map.company_cadastur || "AC.00.00.0000-0",
                socialInstagram: map.social_instagram || "https://instagram.com/evastur",
                socialFacebook: map.social_facebook || "https://facebook.com/evastur",
                socialYoutube: map.social_youtube || "https://youtube.com/@evastur",
                seoTitle: map.seo_title || "Evastur – Turismo na Amazônia",
                seoDescription: map.seo_description || "Descubra pacotes de turismo ecológico e cultural na Amazônia com a Evastur.",
                whatsappLink: `https://wa.me/${phoneOnlyNumbers}`,
            };
        },
        // Como o admin não muda essas infos a cada minuto, deixamos em cache por 1 hora
        staleTime: 1000 * 60 * 60,
    });
}
