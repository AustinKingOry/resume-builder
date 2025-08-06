-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'hustler', 'pro')),
  plan_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage_tracking table
CREATE TABLE public.usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  roast_count INTEGER NOT NULL DEFAULT 0,
  plan_at_time TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create cv_uploads table
CREATE TABLE public.cv_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  page_count INTEGER,
  word_count INTEGER NOT NULL,
  extracted_text TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'completed' CHECK (upload_status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roast_responses table
CREATE TABLE public.roast_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cv_upload_id UUID REFERENCES public.cv_uploads(id) ON DELETE CASCADE NOT NULL,
  roast_tone TEXT NOT NULL CHECK (roast_tone IN ('light', 'heavy')),
  focus_areas JSONB NOT NULL DEFAULT '[]',
  show_emojis BOOLEAN NOT NULL DEFAULT true,
  user_context JSONB,
  
  -- Analysis results
  overall_feedback TEXT NOT NULL,
  feedback_points JSONB NOT NULL DEFAULT '[]',
  market_readiness JSONB NOT NULL,
  kenyan_job_market_tips JSONB NOT NULL DEFAULT '[]',
  
  -- Processing metadata
  processing_time_seconds DECIMAL(5,2),
  ai_tokens_used INTEGER,
  ai_model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  finish_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_feedback table for thumbs up/down on roast responses
CREATE TABLE public.user_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  roast_response_id UUID REFERENCES public.roast_responses(id) ON DELETE CASCADE NOT NULL,
  feedback_point_index INTEGER NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, roast_response_id, feedback_point_index)
);

-- Create payment_transactions table
CREATE TABLE public.payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('hustler', 'pro')),
  amount_ksh INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  transaction_reference TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_usage_tracking_user_date ON public.usage_tracking(user_id, date);
CREATE INDEX idx_cv_uploads_user_created ON public.cv_uploads(user_id, created_at DESC);
CREATE INDEX idx_roast_responses_user_created ON public.roast_responses(user_id, created_at DESC);
CREATE INDEX idx_roast_responses_cv_upload ON public.roast_responses(cv_upload_id);
CREATE INDEX idx_user_feedback_roast_response ON public.user_feedback(roast_response_id);
CREATE INDEX idx_payment_transactions_user ON public.payment_transactions(user_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roast_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own usage tracking" ON public.usage_tracking
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own CV uploads" ON public.cv_uploads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own roast responses" ON public.roast_responses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own feedback" ON public.user_feedback
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Create functions for automatic user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
