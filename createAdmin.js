import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  console.log("Criando usuario:", supabaseUrl)
  const { data, error } = await supabase.auth.signUp({
    email: 'contato@evastur.com',
    password: 'Evastur2026',
  })
  console.log("Data:", data)
  console.log("Error:", error)
}

createAdmin()
