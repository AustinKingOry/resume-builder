-- Create views for analytics and reporting

-- User analytics view
CREATE OR REPLACE VIEW public.user_analytics AS
SELECT 
  u.user_id,
  u.email,
  u.full_name,
  u.plan,
  u.created_at as user_since,
  COUNT(DISTINCT cv.id) as total_cv_uploads,
  COUNT(DISTINCT rr.id) as total_roasts,
  AVG((rr.market_readiness->>'score')::numeric) as avg_market_readiness_score,
  MAX(rr.created_at) as last_roast_date,
  SUM(ut.roast_count) as total_historical_roasts
FROM public.profiles u
LEFT JOIN public.cv_uploads cv ON u.user_id = cv.user_id
LEFT JOIN public.roast_responses rr ON u.user_id = rr.user_id
LEFT JOIN public.usage_tracking ut ON u.user_id = ut.user_id
GROUP BY u.user_id, u.email, u.full_name, u.plan, u.created_at;

-- Daily usage analytics
CREATE OR REPLACE VIEW public.daily_usage_analytics AS
SELECT 
  date,
  COUNT(DISTINCT user_id) as active_users,
  SUM(roast_count) as total_roasts,
  AVG(roast_count) as avg_roasts_per_user,
  COUNT(CASE WHEN plan_at_time = 'free' THEN 1 END) as free_users,
  COUNT(CASE WHEN plan_at_time = 'hustler' THEN 1 END) as hustler_users,
  COUNT(CASE WHEN plan_at_time = 'pro' THEN 1 END) as pro_users
FROM public.usage_tracking
GROUP BY date
ORDER BY date DESC;

-- Roast performance analytics
CREATE OR REPLACE VIEW public.roast_performance_analytics AS
SELECT 
  DATE(rr.created_at) as date,
  rr.roast_tone,
  COUNT(*) as total_roasts,
  AVG((rr.market_readiness->>'score')::numeric) as avg_score,
  AVG(rr.processing_time_seconds) as avg_processing_time,
  AVG(rr.ai_tokens_used) as avg_tokens_used,
  COUNT(DISTINCT rr.user_id) as unique_users
FROM public.roast_responses rr
GROUP BY DATE(rr.created_at), rr.roast_tone
ORDER BY date DESC, roast_tone;
