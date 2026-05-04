-- ============================================
-- NEARMEE SEED DATA
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================

-- Create test merchant users in auth.users
INSERT INTO auth.users (id, aud, role, phone, phone_confirmed_at, created_at, updated_at, encrypted_password, confirmation_token, recovery_token)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'authenticated', 'authenticated', '+63917000001', NOW(), NOW(), NOW(), '', '', ''),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'authenticated', 'authenticated', '+63917000002', NOW(), NOW(), NOW(), '', '', ''),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'authenticated', 'authenticated', '+63917000003', NOW(), NOW(), NOW(), '', '', ''),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'authenticated', 'authenticated', '+63917000004', NOW(), NOW(), NOW(), '', '', ''),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'authenticated', 'authenticated', '+63917000005', NOW(), NOW(), NOW(), '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Update profiles (trigger auto-created them)
UPDATE profiles SET full_name = 'Ana Garcia',     city = 'Bayawan City'    WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001';
UPDATE profiles SET full_name = 'Nestor Reyes',   city = 'Bayawan City'    WHERE id = 'aaaaaaaa-0000-0000-0000-000000000002';
UPDATE profiles SET full_name = 'Leny Santos',    city = 'Bayawan City'    WHERE id = 'aaaaaaaa-0000-0000-0000-000000000003';
UPDATE profiles SET full_name = 'Mark Villanueva',city = 'Dumaguete City'  WHERE id = 'aaaaaaaa-0000-0000-0000-000000000004';
UPDATE profiles SET full_name = 'Joy Fernandez',  city = 'Dumaguete City'  WHERE id = 'aaaaaaaa-0000-0000-0000-000000000005';

-- Create merchants
INSERT INTO merchants (id, user_id, business_name, phone, service_area, category, bio, tier, is_verified, rating_avg, rating_count, is_active)
VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Fresh Fold Laundry',         '+63917000001', 'Bayawan City, Poblacion',    'laundry',     'Same-day laundry pickup and delivery. Quality detergent. Minimum 3 kilos.',      'pro',      TRUE,  4.5, 88, TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'Mang Nestor Plumbing',       '+63917000002', 'Bayawan City, Proper',       'plumbing',    'Licensed plumber. 10+ years experience. Available for emergency calls.',         'free',     TRUE,  4.8, 42, TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', 'Ate Leny Homemade Meals',    '+63917000003', 'Bayawan City, Ubos',         'meals',       'Fresh home-cooked Filipino meals. Lunch boxes and catering available.',          'pro',      FALSE, 4.7, 63, TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000004', 'Mark Electrical Works',      '+63917000004', 'Dumaguete City, Downtown',   'electrical',  'Licensed electrician. Wiring, installation, repair. Residential & commercial.',  'business', TRUE,  4.9, 31, TRUE),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000005', 'Joy Rides Dumaguete',        '+63917000005', 'Dumaguete City, Proper',     'ride',        'Safe and reliable tricycle rides around Dumaguete City.',                        'free',     FALSE, 4.3, 19, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Create services
INSERT INTO services (id, merchant_id, title, description, category, price, price_unit, status, is_boosted, city)
VALUES
  -- Bayawan services
  ('cccccccc-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Laundry Pick-up & Delivery',
   'We pick up your dirty laundry, wash, dry, and fold it, then deliver back to your door. Uses quality detergent. Minimum 3 kilos per pick-up. Same-day available for morning drop-offs.',
   'laundry', 45.00, 'per kilo', 'active', TRUE, 'Bayawan City'),

  ('cccccccc-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002',
   'Plumbing Repair & Pipe Fixing',
   'Emergency and scheduled plumbing repairs. Leaky pipes, faucet replacement, drain unclogging, and more. Tools and materials included for standard jobs.',
   'plumbing', 350.00, 'per visit', 'active', TRUE, 'Bayawan City'),

  ('cccccccc-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Home-cooked Lunch Box Delivery',
   'Fresh Filipino home-cooked meals delivered to your doorstep. Rice, viand, and soup. Order before 9AM for 12NN delivery. Minimum order of 3 boxes.',
   'meals', 85.00, 'per meal', 'active', FALSE, 'Bayawan City'),

  ('cccccccc-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000003',
   'Party Catering – Filipino Fiesta',
   'Full catering service for birthdays, fiestas, and reunions. Menu includes lechon, pancit, and more. Good for 50–200 guests. Book 3 days in advance.',
   'meals', 8500.00, 'per event', 'active', FALSE, 'Bayawan City'),

  ('cccccccc-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000001',
   'Dry Cleaning & Pressing',
   'Professional dry cleaning for barongs, formal wear, and delicate fabrics. Same-day pressing available. Free pickup within 2km.',
   'laundry', 120.00, 'per piece', 'active', FALSE, 'Bayawan City'),

  -- Dumaguete services
  ('cccccccc-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Electrical Wiring & Installation',
   'Professional electrical wiring for new constructions and renovations. Panel upgrades, outlet installation, lighting fixtures. Licensed and insured.',
   'electrical', 800.00, 'per visit', 'active', TRUE, 'Dumaguete City'),

  ('cccccccc-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Aircon Installation & Repair',
   'Split-type and window AC installation, cleaning, and repair. Refrigerant refill available. All brands serviced.',
   'electrical', 650.00, 'per visit', 'active', TRUE, 'Dumaguete City'),

  ('cccccccc-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Tricycle Ride – Dumaguete City',
   'Reliable tricycle transport within Dumaguete City. Airport, pier, and school routes available. Safe, clean, and on time.',
   'ride', 30.00, 'per trip', 'active', FALSE, 'Dumaguete City'),

  ('cccccccc-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000005',
   'Habal-habal – Sibulan Route',
   'Motorcycle ride service along Dumaguete–Sibulan route. Quick and affordable. Available 6AM–9PM daily.',
   'ride', 50.00, 'per trip', 'active', FALSE, 'Dumaguete City'),

  ('cccccccc-0000-0000-0000-000000000010', 'bbbbbbbb-0000-0000-0000-000000000004',
   'Home Generator Installation',
   'Standby generator setup and wiring for homes and small businesses. Transfer switch included. All brands.',
   'electrical', 1200.00, 'per visit', 'active', FALSE, 'Dumaguete City')

ON CONFLICT (id) DO NOTHING;

-- Create availability slots
INSERT INTO availability (service_id, day_of_week, time_slot, is_available)
SELECT s.id, d.day, t.slot, TRUE
FROM services s
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS d(day)
CROSS JOIN (VALUES ('8:00 AM'),('9:00 AM'),('10:00 AM'),('2:00 PM'),('3:00 PM')) AS t(slot)
ON CONFLICT DO NOTHING;
