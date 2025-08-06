-- Function to get user analytics data
CREATE OR REPLACE FUNCTION get_user_analytics(p_user_id UUID, p_time_range TEXT DEFAULT '7d')
RETURNS JSON AS $$
DECLARE
  days_back INTEGER;
  current_stats JSON;
  previous_stats JSON;
  result JSON;
BEGIN
  -- Parse time range
  days_back := CASE 
    WHEN p_time_range = '7d' THEN 7
    WHEN p_time_range = '30d' THEN 30
    WHEN p_time_range = '90d' THEN 90
    WHEN p_time_range = '1y' THEN 365
    ELSE 7
  END;

  -- Get current period stats
  SELECT json_build_object(
    'total_roasts', COUNT(*),
    'average_score', COALESCE(AVG((market_readiness->>'overall_score')::NUMERIC), 0),
    'average_processing_time', COALESCE(AVG(processing_time_seconds), 0),
    'success_rate', COALESCE(COUNT(*) FILTER (WHERE (market_readiness->>'overall_score')::NUMERIC > 70) * 100.0 / NULLIF(COUNT(*), 0), 0)
  ) INTO current_stats
  FROM roast_responses 
  WHERE user_id = p_user_id 
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;

  -- Get previous period stats for comparison
  SELECT json_build_object(
    'total_roasts', COUNT(*),
    'average_score', COALESCE(AVG((market_readiness->>'overall_score')::NUMERIC), 0),
    'average_processing_time', COALESCE(AVG(processing_time_seconds), 0),
    'success_rate', COALESCE(COUNT(*) FILTER (WHERE (market_readiness->>'overall_score')::NUMERIC > 70) * 100.0 / NULLIF(COUNT(*), 0), 0)
  ) INTO previous_stats
  FROM roast_responses 
  WHERE user_id = p_user_id 
    AND created_at >= NOW() - INTERVAL '1 day' * (days_back * 2)
    AND created_at < NOW() - INTERVAL '1 day' * days_back;

  -- Calculate changes
  result := json_build_object(
    'total_roasts', (current_stats->>'total_roasts')::INTEGER,
    'average_score', (current_stats->>'average_score')::NUMERIC,
    'average_processing_time', (current_stats->>'average_processing_time')::NUMERIC,
    'success_rate', (current_stats->>'success_rate')::NUMERIC,
    'score_change', CASE 
      WHEN (previous_stats->>'average_score')::NUMERIC > 0 
      THEN ((current_stats->>'average_score')::NUMERIC - (previous_stats->>'average_score')::NUMERIC) / (previous_stats->>'average_score')::NUMERIC * 100
      ELSE 0 
    END,
    'processing_time_change', (current_stats->>'average_processing_time')::NUMERIC - (previous_stats->>'average_processing_time')::NUMERIC,
    'success_rate_change', (current_stats->>'success_rate')::NUMERIC - (previous_stats->>'success_rate')::NUMERIC
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get category breakdown
CREATE OR REPLACE FUNCTION get_category_breakdown(p_user_id UUID)
RETURNS TABLE(category_name TEXT, average_score NUMERIC, feedback_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH feedback_categories AS (
    SELECT 
      jsonb_array_elements(feedback_points) AS feedback_point
    FROM roast_responses 
    WHERE user_id = p_user_id
      AND created_at >= NOW() - INTERVAL '30 days'
  ),
  category_scores AS (
    SELECT 
      feedback_point->>'category' AS category,
      (feedback_point->>'score')::NUMERIC AS score
    FROM feedback_categories
    WHERE feedback_point->>'category' IS NOT NULL
      AND feedback_point->>'score' IS NOT NULL
  )
  SELECT 
    category::TEXT,
    AVG(score) AS average_score,
    COUNT(*)::INTEGER AS feedback_count
  FROM category_scores
  GROUP BY category
  ORDER BY average_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get score trend over time
CREATE OR REPLACE FUNCTION get_score_trend(p_user_id UUID, p_time_range TEXT DEFAULT '30d')
RETURNS TABLE(date DATE, average_score NUMERIC, roast_count INTEGER) AS $$
DECLARE
  days_back INTEGER;
BEGIN
  days_back := CASE 
    WHEN p_time_range = '7d' THEN 7
    WHEN p_time_range = '30d' THEN 30
    WHEN p_time_range = '90d' THEN 90
    WHEN p_time_range = '1y' THEN 365
    ELSE 30
  END;

  RETURN QUERY
  SELECT 
    created_at::DATE AS date,
    AVG((market_readiness->>'overall_score')::NUMERIC) AS average_score,
    COUNT(*)::INTEGER AS roast_count
  FROM roast_responses 
  WHERE user_id = p_user_id 
    AND created_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY created_at::DATE
  ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user benchmark data
CREATE OR REPLACE FUNCTION get_user_benchmark(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_avg NUMERIC;
  platform_avg NUMERIC;
  top_percentile NUMERIC;
  result JSON;
BEGIN
  -- Get user's average score
  SELECT AVG((market_readiness->>'overall_score')::NUMERIC)
  INTO user_avg
  FROM roast_responses 
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '30 days';

  -- Get platform average
  SELECT AVG((market_readiness->>'overall_score')::NUMERIC)
  INTO platform_avg
  FROM roast_responses 
  WHERE created_at >= NOW() - INTERVAL '30 days';

  -- Get top 10% threshold
  SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY (market_readiness->>'overall_score')::NUMERIC)
  INTO top_percentile
  FROM roast_responses 
  WHERE created_at >= NOW() - INTERVAL '30 days';

  result := json_build_object(
    'user_average', COALESCE(user_avg, 0),
    'platform_average', COALESCE(platform_avg, 0),
    'top_percentile', COALESCE(top_percentile, 0)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get community stats
CREATE OR REPLACE FUNCTION get_community_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'daily_roasts', (
      SELECT COUNT(*) 
      FROM roast_responses 
      WHERE created_at >= CURRENT_DATE
    ),
    'active_users', (
      SELECT COUNT(DISTINCT user_id) 
      FROM roast_responses 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    ),
    'success_stories', (
      SELECT COUNT(*) 
      FROM roast_responses 
      WHERE (market_readiness->>'overall_score')::NUMERIC > 85
        AND created_at >= NOW() - INTERVAL '30 days'
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
