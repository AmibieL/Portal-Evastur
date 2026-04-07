import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Instagram } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import logoEvastur from "@/assets/logo-evastur.png";

/**
 * O RODAPÉ (ONDE TUDO TERMINA)
 * 
 * Juan, este é o Footer. Ele é dinâmico, então se você mudar o telefone da agência
 * lá no banco de dados (tabela site_settings), ele atualiza aqui sozinho. 
 * Não precisa sofrer trocando string no código kkk.
 */
const Footer = () => {
  // Puxa as configurações do site (nome da vitrine, links, etc)
  const { data: settings } = useSiteSettings();

  return (
    <footer className="bg-[hsl(232,100%,5%)] text-[hsl(220,14%,75%)]">
      {/* Grid Principal do Rodapé */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Coluna 1: Sobre a Agência */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={logoEvastur} 
                alt={settings?.agencyName || "Evastur"} 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              {settings?.agencyDescription}
            </p>
            {/* Redes Sociais Dinâmicas */}
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/evastur.turismo" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links de Navegação */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Navegação</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/destinos" className="hover:text-white transition-colors">Destinos</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/#contato" className="hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Links de Suporte */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Suporte</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/sobre#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/minha-conta" className="hover:text-white transition-colors">Minha Conta</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Informações de Contato */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contato</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={16} className="shrink-0 mt-0.5" />
                <a href={`mailto:${settings?.agencyEmail}`} className="hover:text-white transition-colors">
                  {settings?.agencyEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="shrink-0 mt-0.5" />
                <a href={settings?.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {settings?.agencyPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>{settings?.agencyAddress}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra Inferior (Copyright e Desenvolvedor) */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[hsl(220,14%,55%)]">
          <div className="flex items-center gap-3 flex-wrap justify-center w-full">
            <span>© {new Date().getFullYear()} {settings?.agencyName}. Todos os direitos reservados.</span>
            <span className="hidden sm:inline">•</span>
            <span>Certificado Cadastur: {settings?.cadastur}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
