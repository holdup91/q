/*
  # Complete Queue Management System Schema

  1. New Tables
    - `organizations` - Companies/businesses using the system
    - `locations` - Physical locations within organizations
    - `queues` - Individual queues at locations
    - `customers` - Customer profiles
    - `tickets` - Queue tickets/entries
    - `mini_quests` - Available mini-quests
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