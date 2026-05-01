import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uiktwbtwzotqduzwtjcb.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_ONXQyJvXKUIUqppaWnZG4w_epX1u7ml'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)