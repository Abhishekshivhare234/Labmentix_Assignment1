import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
// Use environment variables for security

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // use service role key for backend



export const supabase = createClient(supabaseUrl, supabaseKey)