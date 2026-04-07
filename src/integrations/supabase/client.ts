/**
 * CONFIGURAÇÃO DO CLIENTE SUPABASE
 * 
 * Este arquivo estabelece a ponte entre o nosso app e o banco de dados/autenticação.
 * Ele já vem pré-configurado para gerenciar sessões e persistir o login no navegador.
 * 
 * ATENÇÃO: Se as variáveis de ambiente (URL ou KEY) mudarem no painel do Supabase,
 * você deve atualizar o arquivo .env do projeto.
 */

import { createClient } from '@supabase/supabase-js';
// @ts-ignore - Juan, se o TS reclamar, finge que não viu. Esses tipos do Supabase às vezes são temperamentais.
import type { Database } from './types';

/**
 * O CORAÇÃO DO BACKEND (OU ONDE A MÁGICA ACONTECE)
 * 
 * Fala Juan! Este é o cliente oficial do Supabase. É por aqui que a gente conversa
 * com o banco de dados. Se isso aqui quebrar, o site vira um monte de HTML estático.
 * 
 * Não toca na URL nem na Anon Key a menos que você saiba MUITO bem o que está fazendo,
 * ou queira passar a tarde depurando erro de conexão kkk.
 */

// Pegamos as credenciais lá das variáveis de ambiente (.env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Inicializamos o cliente para ser usado em todo o sistema.
// É só importar: import { supabase } from "@/integrations/supabase/client"
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage, // Mantém o usuário logado mesmo se fechar a aba
    persistSession: true,
    autoRefreshToken: true, // Renova o token de acesso automaticamente em background
  }
});