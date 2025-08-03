import { supabase } from '../lib/supabase'

// Define AICreation interface locally to avoid import issues
interface AICreation {
  id: string
  user_id: string
  input_text: string
  generated_image_url?: string
  generated_3d_url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export const aiCreationService = {
  // Create a new AI creation record
  async createCreation(userId: string, inputText: string): Promise<{ data: AICreation | null; error: any }> {
    const { data, error } = await supabase
      .from('ai_creations')
      .insert([
        {
          user_id: userId,
          input_text: inputText,
          status: 'pending'
        }
      ])
      .select()
      .single()

    return { data, error }
  },

  // Update creation with generated image
  async updateWithImage(creationId: string, imageUrl: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('ai_creations')
      .update({
        generated_image_url: imageUrl,
        status: 'processing'
      })
      .eq('id', creationId)

    return { error }
  },

  // Update creation with 3D model
  async updateWith3DModel(creationId: string, modelUrl: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('ai_creations')
      .update({
        generated_3d_url: modelUrl,
        status: 'completed'
      })
      .eq('id', creationId)

    return { error }
  },

  // Get user's creations
  async getUserCreations(userId: string): Promise<{ data: AICreation[] | null; error: any }> {
    const { data, error } = await supabase
      .from('ai_creations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Get a specific creation
  async getCreation(creationId: string): Promise<{ data: AICreation | null; error: any }> {
    const { data, error } = await supabase
      .from('ai_creations')
      .select('*')
      .eq('id', creationId)
      .single()

    return { data, error }
  },

  // Add to print queue
  async addToPrintQueue(userId: string, creationId: string, productName: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('print_jobs')
      .insert([
        {
          user_id: userId,
          creation_id: creationId,
          product_name: productName,
          status: 'queued'
        }
      ])

    return { error }
  }
} 