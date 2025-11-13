import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
// Use environment variables for security

dotenv.config();



export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// For auth/login/signup only
export const supabaseUser = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

