-- ================================================
-- SAMPLE SEED DATA FOR EVOCENTRIC
-- Run this after schema.sql
-- ================================================

-- ================================================
-- USERS
-- ================================================
INSERT INTO users (name, email, phone, wallet_balance) VALUES
('John Doe', 'john.doe@example.com', '555-0101', 150.00),
('Jane Smith', 'jane.smith@example.com', '555-0102', 200.50),
('Bob Johnson', 'bob.johnson@example.com', '555-0103', 75.25),
('Alice Williams', 'alice.williams@example.com', '555-0104', 300.00),
('Charlie Brown', 'charlie.brown@example.com', '555-0105', 125.75),
('Diana Prince', 'diana.prince@example.com', '555-0106', 180.00),
('Eve Martinez', 'eve.martinez@example.com', '555-0107', 95.50),
('Frank Garcia', 'frank.garcia@example.com', '555-0108', 220.00),
('Grace Lee', 'grace.lee@example.com', '555-0109', 160.25),
('Henry Davis', 'henry.davis@example.com', '555-0110', 140.00);

-- ================================================
-- CHARGING STATIONS
-- ================================================
INSERT INTO charging_stations (station_name, location, total_slots, available_slots) VALUES
('Downtown Hub', '123 Main Street, Downtown', 20, 15),
('Airport Terminal', '456 Airport Road, Terminal 1', 30, 22),
('Shopping Mall Center', '789 Mall Boulevard', 25, 18),
('Business District', '321 Corporate Avenue', 15, 10),
('University Campus', '654 College Way', 18, 14),
('Beach Front Station', '987 Ocean Drive', 12, 9),
('Stadium Parking', '147 Sports Complex', 40, 30),
('Hospital Zone', '258 Medical Center Drive', 10, 7),
('Train Station Hub', '369 Railway Street', 22, 16),
('City Park', '741 Park Avenue', 8, 6);

-- ================================================
-- RESERVATIONS
-- ================================================
INSERT INTO reservations (user_id, slot_id, start_time, end_time, status, overstay_penalty) VALUES
-- Active reservations
(1, 1, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '1 hour', 'active', 0),
(2, 2, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '1.5 hours', 'active', 0),
(3, 1, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '30 minutes', 'active', 15.00),
(4, 3, NOW() - INTERVAL '45 minutes', NOW() + INTERVAL '2 hours', 'active', 0),
(5, 4, NOW() - INTERVAL '15 minutes', NOW() + INTERVAL '2 hours', 'active', 0),

-- Completed reservations
(1, 2, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours', 'completed', 0),
(2, 1, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '6 hours', 'completed', 0),
(3, 3, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '10 hours', 'completed', 25.00),
(4, 2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', 'completed', 0),
(5, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '1 hour', 'completed', 0),
(6, 4, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '3 hours', 'completed', 0),
(7, 3, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '2 hours', 'completed', 10.00),
(8, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '1 hour', 'completed', 0),

-- Cancelled reservations
(9, 5, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours', 'cancelled', 0),
(10, 6, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '2 hours', 'cancelled', 0);

-- ================================================
-- PENALTIES
-- ================================================
INSERT INTO penalties (reservation_id, amount, reason, status, paid_at) VALUES
-- Paid penalties
(3, 15.00, 'Overstay penalty - exceeded reservation time by 30 minutes', 'paid', NOW() - INTERVAL '1 hour'),
(8, 25.00, 'Overstay penalty - exceeded reservation time by 1 hour', 'paid', NOW() - INTERVAL '10 hours'),
(13, 10.00, 'Overstay penalty - exceeded reservation time by 15 minutes', 'paid', NOW() - INTERVAL '3 days'),

-- Unpaid penalties
(3, 20.00, 'Late payment fee', 'unpaid', NULL),
(8, 15.00, 'Improper parking at charging station', 'unpaid', NULL),
(13, 30.00, 'Failure to complete charging session properly', 'unpaid', NULL),
(1, 10.00, 'Reservation cancellation fee (late cancellation)', 'unpaid', NULL),
(2, 5.00, 'Station equipment damage report', 'unpaid', NULL);

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Uncomment these to verify the data was inserted correctly

-- SELECT 'Users Count' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'Stations Count', COUNT(*) FROM charging_stations
-- UNION ALL
-- SELECT 'Reservations Count', COUNT(*) FROM reservations
-- UNION ALL
-- SELECT 'Penalties Count', COUNT(*) FROM penalties;

-- SELECT * FROM station_occupancy;
-- SELECT * FROM user_statistics;

-- ================================================
-- END OF SEED DATA
-- ================================================
