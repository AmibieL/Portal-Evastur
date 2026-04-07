import * as React from "react";

// Juan, aqui a gente define o que é "tela de pobre" (mobile) kkk.
// Se for menor que 768px, a gente assume que é celular.
const MOBILE_BREAKPOINT = 768;

/**
 * DETECTOR DE CELULAR (O "POBROMETRO") kkk
 * 
 * Juan, este hook serve pra saber se o usuário está num celular ou no PC.
 * Muito útil pra esconder aquelas seções gigantes que quebram o layout no mobile.
 * 
 * Retorna 'true' se o cara estiver num dispositivo pequeno.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Usamos o MatchMedia pra não fritar o processador do usuário com eventos de resize.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
