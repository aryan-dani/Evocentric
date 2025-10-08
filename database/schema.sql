-- ================================================
-- EVOCENTRIC DATABASE SCHEMA
-- Smart EV Charging & Parking Management System
-- ================================================

-- Drop existing tables if they exist (for clean install)
DROP TABLE IF EXISTS penalties CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS charging_stations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  wallet_balance NUMERIC(10, 2) DEFAULT 0 CHECK (wallet_balance >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ================================================
-- CHARGING STATIONS TABLE
-- ================================================
CREATE TABLE charging_stations (
  station_id SERIAL PRIMARY KEY,
  station_name VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  total_slots INTEGER NOT NULL CHECK (total_slots > 0),
  available_slots INTEGER NOT NULL CHECK (available_slots >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_available_slots CHECK (available_slots <= total_slots)
);

-- Add indexes
CREATE INDEX idx_stations_name ON charging_stations(station_name);
CREATE INDEX idx_stations_location ON charging_stations(location);

-- ================================================
-- RESERVATIONS TABLE
-- ================================================
CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  slot_id INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  overstay_penalty NUMERIC(10, 2) DEFAULT 0 CHECK (overstay_penalty >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_slot ON reservations(slot_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created_at ON reservations(created_at);

-- ================================================
-- PENALTIES TABLE
-- ================================================
CREATE TABLE penalties (
  penalty_id SERIAL PRIMARY KEY,
  reservation_id INTEGER NOT NULL REFERENCES reservations(reservation_id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  reason VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_penalties_reservation ON penalties(reservation_id);
CREATE INDEX idx_penalties_status ON penalties(status);
CREATE INDEX idx_penalties_created_at ON penalties(created_at);

-- ================================================
-- TRIGGERS FOR UPDATED_AT
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for users table
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Triggers for charging_stations table
CREATE TRIGGER update_stations_updated_at 
BEFORE UPDATE ON charging_stations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Triggers for reservations table
CREATE TRIGGER update_reservations_updated_at 
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (DEVELOPMENT ONLY)
-- TODO: Update these policies for production with proper authentication

CREATE POLICY "Enable all operations for all users" 
ON users FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" 
ON charging_stations FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" 
ON reservations FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable all operations for all users" 
ON penalties FOR ALL 
USING (true) 
WITH CHECK (true);

-- ================================================
-- VIEWS FOR ANALYTICS
-- ================================================

-- View for station occupancy
CREATE OR REPLACE VIEW station_occupancy AS
SELECT 
  station_id,
  station_name,
  location,
  total_slots,
  available_slots,
  (total_slots - available_slots) AS occupied_slots,
  ROUND(((total_slots - available_slots)::NUMERIC / total_slots * 100), 2) AS occupancy_rate
FROM charging_stations
WHERE total_slots > 0;

-- View for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  u.user_id,
  u.name,
  u.email,
  u.wallet_balance,
  COUNT(DISTINCT r.reservation_id) AS total_reservations,
  COUNT(DISTINCT CASE WHEN r.status = 'active' THEN r.reservation_id END) AS active_reservations,
  COUNT(DISTINCT p.penalty_id) AS total_penalties,
  COALESCE(SUM(CASE WHEN p.status = 'unpaid' THEN p.amount ELSE 0 END), 0) AS unpaid_penalty_amount
FROM users u
LEFT JOIN reservations r ON u.user_id = r.user_id
LEFT JOIN penalties p ON r.reservation_id = p.reservation_id
GROUP BY u.user_id, u.name, u.email, u.wallet_balance;

-- ================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ================================================

-- Function to automatically update paid_at when penalty is paid
CREATE OR REPLACE FUNCTION update_penalty_paid_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status = 'unpaid' THEN
    NEW.paid_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_penalty_paid
BEFORE UPDATE ON penalties
FOR EACH ROW
EXECUTE FUNCTION update_penalty_paid_at();

-- ================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================

COMMENT ON TABLE users IS 'Stores user account information with wallet balance';
COMMENT ON TABLE charging_stations IS 'Stores EV charging station locations and slot availability';
COMMENT ON TABLE reservations IS 'Stores charging slot reservations made by users';
COMMENT ON TABLE penalties IS 'Stores penalties associated with reservations';

COMMENT ON COLUMN users.wallet_balance IS 'User wallet balance for payments (must be non-negative)';
COMMENT ON COLUMN charging_stations.available_slots IS 'Number of currently available slots (must be <= total_slots)';
COMMENT ON COLUMN reservations.overstay_penalty IS 'Penalty amount for overstaying the reservation';
COMMENT ON COLUMN penalties.paid_at IS 'Timestamp when penalty was paid (automatically set)';

-- ================================================
-- END OF SCHEMA
-- ================================================
