-- Create ai_creations table
CREATE TABLE IF NOT EXISTS ai_creations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_text TEXT NOT NULL,
  generated_image_url TEXT,
  generated_3d_url TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create print_jobs table
CREATE TABLE IF NOT EXISTS print_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creation_id UUID REFERENCES ai_creations(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued', 'printing', 'completed', 'failed')) DEFAULT 'queued',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ai_creations_updated_at 
  BEFORE UPDATE ON ai_creations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_print_jobs_updated_at 
  BEFORE UPDATE ON print_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on tables
ALTER TABLE ai_creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_creations
CREATE POLICY "Users can view their own creations" ON ai_creations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own creations" ON ai_creations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own creations" ON ai_creations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own creations" ON ai_creations
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for print_jobs
CREATE POLICY "Users can view their own print jobs" ON print_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own print jobs" ON print_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own print jobs" ON print_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own print jobs" ON print_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_creations_user_id ON ai_creations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_creations_status ON ai_creations(status);
CREATE INDEX IF NOT EXISTS idx_ai_creations_created_at ON ai_creations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_print_jobs_user_id ON print_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_print_jobs_status ON print_jobs(status);
CREATE INDEX IF NOT EXISTS idx_print_jobs_created_at ON print_jobs(created_at DESC);