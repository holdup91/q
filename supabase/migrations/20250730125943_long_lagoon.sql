/*
  # Complete Queue Management System Schema

  1. New Tables
    - `organizations` - Companies/businesses using the system
    - `locations` - Physical locations within organizations  
    - `queues` - Individual queues at locations
    - `customers` - Customer profiles with XP system
    - `tickets` - Queue tickets/entries with full lifecycle
    - `mini_quests` - Available mini-quests for gamification
    - `customer_quests` - Customer quest completions
    - `xp_rewards` - Available XP shop rewards
    - `customer_purchases` - Customer reward purchases
    - `staff_users` - Staff member profiles
    - `queue_analytics` - Queue performance metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate staff and customer access levels

  3. Features
    - Real-time queue updates
    - XP and gamification system
    - Analytics and reporting
    - Multi-tenant organization support
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#000000',
  secondary_color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  city text,
  state text,
  zip_code text,
  phone text,
  email text,
  timezone text DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Queues table
CREATE TABLE IF NOT EXISTS queues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  queue_type text DEFAULT 'general',
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped')),
  max_capacity integer DEFAULT 100,
  avg_service_time integer DEFAULT 5, -- minutes
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE,
  phone text,
  first_name text,
  last_name text,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id uuid REFERENCES queues(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  ticket_number text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  customer_email text,
  purpose text DEFAULT 'General service',
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'served', 'cancelled', 'no_show', 'parked')),
  priority integer DEFAULT 0,
  estimated_wait_time integer DEFAULT 0, -- minutes
  actual_wait_time integer DEFAULT 0, -- minutes
  joined_at timestamptz DEFAULT now(),
  called_at timestamptz,
  served_at timestamptz,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mini quests table
CREATE TABLE IF NOT EXISTS mini_quests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  quest_type text NOT NULL CHECK (quest_type IN ('video', 'survey', 'social', 'trivia', 'review')),
  xp_reward integer DEFAULT 0,
  icon text DEFAULT '🎯',
  content jsonb DEFAULT '{}', -- Quest-specific content (video URL, questions, etc.)
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer quest completions
CREATE TABLE IF NOT EXISTS customer_quests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES mini_quests(id) ON DELETE CASCADE,
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  xp_earned integer DEFAULT 0,
  completion_data jsonb DEFAULT '{}',
  UNIQUE(customer_id, quest_id, ticket_id)
);

-- XP Rewards table
CREATE TABLE IF NOT EXISTS xp_rewards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  cost integer NOT NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('discount', 'skip', 'cosmetic', 'voucher')),
  icon text DEFAULT '🎁',
  effect_data jsonb DEFAULT '{}', -- Reward-specific data
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer purchases
CREATE TABLE IF NOT EXISTS customer_purchases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  reward_id uuid REFERENCES xp_rewards(id) ON DELETE CASCADE,
  ticket_id uuid REFERENCES tickets(id) ON DELETE SET NULL,
  xp_cost integer NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  used_at timestamptz,
  is_used boolean DEFAULT false
);

-- Staff users table
CREATE TABLE IF NOT EXISTS staff_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  role text DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  permissions jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Queue analytics table
CREATE TABLE IF NOT EXISTS queue_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id uuid REFERENCES queues(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_tickets integer DEFAULT 0,
  served_tickets integer DEFAULT 0,
  cancelled_tickets integer DEFAULT 0,
  no_show_tickets integer DEFAULT 0,
  avg_wait_time numeric DEFAULT 0,
  max_wait_time integer DEFAULT 0,
  peak_queue_length integer DEFAULT 0,
  total_xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(queue_id, date)
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mini_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations: Public read, authenticated write
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Organizations are editable by authenticated users"
  ON organizations FOR ALL
  TO authenticated
  USING (true);

-- Locations: Public read, staff write
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Locations are editable by staff"
  ON locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND (location_id = locations.id OR organization_id = locations.organization_id)
    )
  );

-- Queues: Public read, staff write
CREATE POLICY "Queues are viewable by everyone"
  ON queues FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Queues are editable by staff"
  ON queues FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users s
      JOIN locations l ON l.id = s.location_id
      WHERE s.user_id = auth.uid() 
      AND l.id = queues.location_id
    )
  );

-- Customers: Own data only
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create customer profile"
  ON customers FOR INSERT
  TO public
  WITH CHECK (true);

-- Tickets: Public read, customers can create, staff can manage
CREATE POLICY "Tickets are viewable by everyone"
  ON tickets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create tickets"
  ON tickets FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Staff can manage tickets"
  ON tickets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users s
      JOIN locations l ON l.id = s.location_id
      JOIN queues q ON q.location_id = l.id
      WHERE s.user_id = auth.uid() 
      AND q.id = tickets.queue_id
    )
  );

-- Mini quests: Public read, org admins write
CREATE POLICY "Mini quests are viewable by everyone"
  ON mini_quests FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Organization admins can manage mini quests"
  ON mini_quests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND organization_id = mini_quests.organization_id
      AND role IN ('admin', 'manager')
    )
  );

-- Customer quests: Own data only
CREATE POLICY "Customers can view own quest completions"
  ON customer_quests FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create quest completions"
  ON customer_quests FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- XP Rewards: Public read, org admins write
CREATE POLICY "XP rewards are viewable by everyone"
  ON xp_rewards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Organization admins can manage XP rewards"
  ON xp_rewards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND organization_id = xp_rewards.organization_id
      AND role IN ('admin', 'manager')
    )
  );

-- Customer purchases: Own data only
CREATE POLICY "Customers can view own purchases"
  ON customer_purchases FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create purchases"
  ON customer_purchases FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Staff users: Own data and org data
CREATE POLICY "Staff can view org staff"
  ON staff_users FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND organization_id = staff_users.organization_id
    )
  );

CREATE POLICY "Staff can manage own profile"
  ON staff_users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Queue analytics: Staff read only
CREATE POLICY "Staff can view queue analytics"
  ON queue_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff_users s
      JOIN locations l ON l.id = s.location_id
      JOIN queues q ON q.location_id = l.id
      WHERE s.user_id = auth.uid() 
      AND q.id = queue_analytics.queue_id
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_locations_organization_id ON locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_queues_location_id ON queues(location_id);
CREATE INDEX IF NOT EXISTS idx_tickets_queue_id ON tickets(queue_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_joined_at ON tickets(joined_at);
CREATE INDEX IF NOT EXISTS idx_customer_quests_customer_id ON customer_quests(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_quests_quest_id ON customer_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_customer_purchases_customer_id ON customer_purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_staff_users_user_id ON staff_users(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_users_organization_id ON staff_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_queue_analytics_queue_id_date ON queue_analytics(queue_id, date);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queues_updated_at BEFORE UPDATE ON queues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_users_updated_at BEFORE UPDATE ON staff_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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