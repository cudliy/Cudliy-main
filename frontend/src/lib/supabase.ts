import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iovvybpvctqlofnunsof.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdnZ5YnB2Y3RxbG9mbnVuc29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzQ2MzAsImV4cCI6MjA2OTc1MDYzMH0.PvW5VhnTVHxVjhVqpHI-8OpcTp_9c0oAeCGvT5P_SLc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  business_name?: string
  phone?: string
  created_at: string
}

export interface AICreation {
  id: string
  user_id: string
  input_text: string
  generated_image_url?: string
  generated_3d_url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface PrintJob {
  id: string
  user_id: string
  creation_id?: string
  product_name: string
  status: 'queued' | 'printing' | 'completed' | 'failed'
  file_url?: string
  created_at: string
  updated_at: string
} 