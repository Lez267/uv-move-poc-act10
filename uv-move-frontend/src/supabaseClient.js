import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://surwvkpzpnbrnkhynbkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cnd2a3B6cG5icm5raHluYmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MTE4MzgsImV4cCI6MjEwNTA4NzgzOH0.uXDZvhqD8pG0UItLR6xA9JDMX9LJdp_HtPZ8HMsKEYo'

// conectamos nuestra app con supabase
export const supabase = createClient(supabaseUrl, supabaseKey)
