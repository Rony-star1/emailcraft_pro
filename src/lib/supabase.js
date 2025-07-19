import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nwtqmzsnvzmiqyfkowyi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dHFtenNudnptaXF5Zmtvd3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTkyOTYsImV4cCI6MjA2NzQ3NTI5Nn0.0j_olYSPOTp831ImSUgGCnu--JBKNEV7OYkLa3KJplM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
