-- Function to get or create today's usage tracking
CREATE OR REPLACE FUNCTION public.get_or_create_usage_tracking(p_user_id UUID)
RETURNS public.usage_tracking AS $$
DECLARE
  result public.usage_tracking;
  user_plan TEXT;
BEGIN
  -- Get user's current plan
  SELECT plan INTO user_plan FROM public.profiles WHERE user_id = p_user_id;
  
  -- Try to get existing record for today
  SELECT * INTO result 
  FROM public.usage_tracking 
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  -- If no record exists, create one
  IF result IS NULL THEN
    INSERT INTO public.usage_tracking (user_id, date, roast_count, plan_at_time)
    VALUES (p_user_id, CURRENT_DATE, 0, COALESCE(user_plan, 'free'))
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage_count(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage public.usage_tracking;
  plan_limits JSONB := '{"free": 5, "hustler": 50, "pro": 200}';
  current_limit INTEGER;
BEGIN
  -- Get or create today's usage record
  SELECT * INTO current_usage FROM public.get_or_create_usage_tracking(p_user_id);
  
  -- Get the limit for current plan
  current_limit := (plan_limits->>current_usage.plan_at_time)::INTEGER;
  
  -- Check if user has reached limit
  IF current_usage.roast_count >= current_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment the count
  UPDATE public.usage_tracking 
  SET roast_count = roast_count + 1, updated_at = NOW()
  WHERE id = current_usage.id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can make request
CREATE OR REPLACE FUNCTION public.can_make_request(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage public.usage_tracking;
  plan_limits JSONB := '{"free": 5, "hustler": 50, "pro": 200}';
  current_limit INTEGER;
BEGIN
  -- Get or create today's usage record
  SELECT * INTO current_usage FROM public.get_or_create_usage_tracking(p_user_id);
  
  -- Get the limit for current plan
  current_limit := (plan_limits->>current_usage.plan_at_time)::INTEGER;
  
  -- Return whether user can make request
  RETURN current_usage.roast_count < current_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user plan
CREATE OR REPLACE FUNCTION public.upgrade_user_plan(
  p_user_id UUID,
  p_new_plan TEXT,
  p_transaction_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate expiration date (30 days from now)
  expires_at := NOW() + INTERVAL '30 days';
  
  -- Update user plan
  UPDATE public.profiles 
  SET 
    plan = p_new_plan,
    plan_expires_at = expires_at,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Update payment transaction if provided
  IF p_transaction_id IS NOT NULL THEN
    UPDATE public.payment_transactions
    SET status = 'completed', updated_at = NOW()
    WHERE id = p_transaction_id AND user_id = p_user_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_roasts', COUNT(rr.id),
    'avg_score', ROUND(AVG((rr.market_readiness->>'score')::numeric), 1),
    'total_cvs', COUNT(DISTINCT rr.cv_upload_id),
    'avg_processing_time', ROUND(AVG(rr.processing_time_seconds), 2),
    'success_rate', ROUND(
      (COUNT(CASE WHEN (rr.market_readiness->>'score')::numeric >= 80 THEN 1 END) * 100.0 / 
       NULLIF(COUNT(rr.id), 0)), 0
    ),
    'last_roast', MAX(rr.created_at)
  ) INTO result
  FROM public.roast_responses rr
  WHERE rr.user_id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
