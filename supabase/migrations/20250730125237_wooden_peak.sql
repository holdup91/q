/*
  # Insert Mock Data for Queue Management System

  This migration populates the database with realistic mock data for testing and development.
*/

-- Insert Organizations
INSERT INTO organizations (id, name, slug, logo_url, primary_color, secondary_color) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Downtown Bank', 'downtown-bank', null, '#1E40AF', '#6B7280'),
  ('550e8400-e29b-41d4-a716-446655440002', 'City Medical Center', 'city-medical', null, '#059669', '#6B7280'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Metro DMV', 'metro-dmv', null, '#DC2626', '#6B7280');

-- Insert Locations
INSERT INTO locations (id, organization_id, name, address, city, state, zip_code, phone, timezone) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Main Branch', '123 Main St', 'Downtown', 'CA', '90210', '(555) 123-4567', 'America/Los_Angeles'),
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'North Plaza', '456 North Ave', 'Uptown', 'CA', '90211', '(555) 234-5678', 'America/Los_Angeles'),
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', 'Emergency Department', '789 Health Blvd', 'Medical District', 'CA', '90212', '(555) 345-6789', 'America/Los_Angeles'),
  ('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 'License Services', '321 Government Way', 'Civic Center', 'CA', '90213', '(555) 456-7890', 'America/Los_Angeles');

-- Insert Queues
INSERT INTO queues (id, location_id, name, description, queue_type, status, avg_service_time) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'Customer Service', 'General banking services', 'general', 'active', 8),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'Account Opening', 'New account setup', 'specialized', 'active', 15),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', 'Loan Applications', 'Loan consultations', 'specialized', 'active', 25),
  ('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', 'Premium Services', 'VIP banking services', 'premium', 'active', 12),
  ('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440013', 'Triage', 'Initial patient assessment', 'medical', 'active', 5),
  ('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440014', 'License Renewal', 'Driver license renewals', 'government', 'active', 10);

-- Insert Customers
INSERT INTO customers (id, email, phone, first_name, last_name, total_xp, current_level) VALUES
  ('550e8400-e29b-41d4-a716-446655440031', 'sarah.johnson@email.com', '(555) 111-2222', 'Sarah', 'Johnson', 450, 2),
  ('550e8400-e29b-41d4-a716-446655440032', 'mike.chen@email.com', '(555) 222-3333', 'Mike', 'Chen', 280, 1),
  ('550e8400-e29b-41d4-a716-446655440033', 'emily.rodriguez@email.com', '(555) 333-4444', 'Emily', 'Rodriguez', 720, 3),
  ('550e8400-e29b-41d4-a716-446655440034', 'david.kim@email.com', '(555) 444-5555', 'David', 'Kim', 150, 1),
  ('550e8400-e29b-41d4-a716-446655440035', 'lisa.wang@email.com', '(555) 555-6666', 'Lisa', 'Wang', 890, 4);

-- Insert current active tickets
INSERT INTO tickets (id, queue_id, customer_id, ticket_number, customer_name, customer_phone, purpose, status, estimated_wait_time, joined_at) VALUES
  -- Customer Service Queue (active tickets)
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440031', 'A001', 'Sarah Johnson', '(555) 111-2222', 'Balance inquiry', 'waiting', 15, now() - interval '5 minutes'),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440032', 'A002', 'Mike Chen', '(555) 222-3333', 'Wire transfer', 'waiting', 20, now() - interval '3 minutes'),
  ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440021', null, 'A003', 'Anonymous Customer', null, 'Account inquiry', 'waiting', 25, now() - interval '1 minute'),
  
  -- Account Opening Queue
  ('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440033', 'B001', 'Emily Rodriguez', '(555) 333-4444', 'Business account', 'waiting', 30, now() - interval '8 minutes'),
  ('550e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440022', null, 'B002', 'John Smith', '(555) 777-8888', 'Savings account', 'waiting', 45, now() - interval '2 minutes'),
  
  -- Loan Applications Queue
  ('550e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440034', 'C001', 'David Kim', '(555) 444-5555', 'Home mortgage', 'waiting', 50, now() - interval '10 minutes'),
  
  -- Premium Services Queue
  ('550e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440035', 'D001', 'Lisa Wang', '(555) 555-6666', 'Investment consultation', 'waiting', 20, now() - interval '4 minutes'),
  
  -- Some served tickets for analytics
  ('550e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440021', null, 'A004', 'Robert Taylor', '(555) 888-9999', 'Deposit', 'served', 0, now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440021', null, 'A005', 'Jennifer Lee', '(555) 999-0000', 'Check cashing', 'served', 0, now() - interval '1 hour'),
  
  -- Some parked tickets
  ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440022', null, 'B003', 'Michael Davis', '(555) 000-1111', 'Credit card application', 'parked', 0, now() - interval '30 minutes');

-- Insert Mini Quests
INSERT INTO mini_quests (id, organization_id, title, description, quest_type, xp_reward, icon, content) VALUES
  ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440001', 'Watch Promo Video', 'Learn about our new mobile banking features', 'video', 50, '📺', '{"video_url": "https://example.com/promo", "duration": 30}'),
  ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440001', 'Complete Survey', 'Help us improve our customer service', 'survey', 75, '📝', '{"questions": 5, "estimated_time": 3}'),
  ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440001', 'NBA Trivia Quiz', 'Test your basketball knowledge', 'trivia', 60, '🏀', '{"category": "nba", "questions": 5}'),
  ('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440001', 'Follow Social Media', 'Stay updated with our latest news', 'social', 25, '📱', '{"platforms": ["twitter", "instagram", "linkedin"]}'),
  ('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440002', 'Health Tips Quiz', 'Learn about wellness and health', 'trivia', 40, '🏥', '{"category": "health", "questions": 3}'),
  ('550e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440003', 'DMV Knowledge Test', 'Brush up on driving rules', 'trivia', 80, '🚗', '{"category": "driving", "questions": 10}');

-- Insert XP Rewards
INSERT INTO xp_rewards (id, organization_id, title, description, cost, reward_type, icon, effect_data) VALUES
  ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440001', '10% Service Discount', 'Save on your next banking transaction', 200, 'discount', '🎁', '{"discount_percent": 10, "valid_days": 30}'),
  ('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440001', 'Skip 3 Places', 'Move ahead in the queue', 150, 'skip', '🚀', '{"skip_count": 3}'),
  ('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440001', 'Golden Ticket Skin', 'Customize your ticket appearance', 100, 'cosmetic', '🎨', '{"skin_type": "golden", "effects": ["glow", "animation"]}'),
  ('550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440001', 'Free Coffee Voucher', 'Enjoy complimentary refreshments', 75, 'voucher', '☕', '{"voucher_type": "coffee", "location": "lobby"}'),
  ('550e8400-e29b-41d4-a716-446655440065', '550e8400-e29b-41d4-a716-446655440002', 'Priority Scheduling', 'Get priority for next appointment', 300, 'skip', '⭐', '{"priority_level": "high", "valid_days": 7}'),
  ('550e8400-e29b-41d4-a716-446655440066', '550e8400-e29b-41d4-a716-446655440003', 'Express Lane Access', 'Use the express service lane', 250, 'skip', '⚡', '{"lane_type": "express", "uses": 1}');

-- Insert some customer quest completions
INSERT INTO customer_quests (customer_id, quest_id, ticket_id, xp_earned, completion_data) VALUES
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440041', 50, '{"completed_at": "2024-01-15T10:30:00Z", "video_watched": true}'),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440042', 75, '{"completed_at": "2024-01-15T11:15:00Z", "survey_score": 4.5}'),
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440044', 60, '{"completed_at": "2024-01-15T09:45:00Z", "quiz_score": 4, "total_questions": 5}');

-- Insert some customer purchases
INSERT INTO customer_purchases (customer_id, reward_id, ticket_id, xp_cost, is_used) VALUES
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440041', 75, false),
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440044', 100, true),
  ('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440047', 150, true);

-- Insert queue analytics for the past week
INSERT INTO queue_analytics (queue_id, date, total_tickets, served_tickets, cancelled_tickets, no_show_tickets, avg_wait_time, max_wait_time, peak_queue_length, total_xp_earned) VALUES
  -- Customer Service Queue
  ('550e8400-e29b-41d4-a716-446655440021', CURRENT_DATE - 1, 45, 42, 2, 1, 12.5, 35, 8, 1250),
  ('550e8400-e29b-41d4-a716-446655440021', CURRENT_DATE - 2, 38, 35, 1, 2, 15.2, 42, 6, 980),
  ('550e8400-e29b-41d4-a716-446655440021', CURRENT_DATE - 3, 52, 48, 3, 1, 11.8, 28, 9, 1680),
  
  -- Account Opening Queue
  ('550e8400-e29b-41d4-a716-446655440022', CURRENT_DATE - 1, 12, 11, 0, 1, 22.3, 45, 4, 420),
  ('550e8400-e29b-41d4-a716-446655440022', CURRENT_DATE - 2, 15, 14, 1, 0, 18.7, 38, 5, 560),
  
  -- Loan Applications Queue
  ('550e8400-e29b-41d4-a716-446655440023', CURRENT_DATE - 1, 8, 7, 0, 1, 28.5, 55, 3, 280),
  ('550e8400-e29b-41d4-a716-446655440023', CURRENT_DATE - 2, 6, 6, 0, 0, 25.2, 48, 2, 240);

-- Update customer XP totals based on quest completions
UPDATE customers SET total_xp = (
  SELECT COALESCE(SUM(xp_earned), 0) 
  FROM customer_quests 
  WHERE customer_id = customers.id
) WHERE id IN (
  SELECT DISTINCT customer_id FROM customer_quests
);

-- Update customer levels based on XP (every 500 XP = 1 level)
UPDATE customers SET current_level = GREATEST(1, (total_xp / 500) + 1);