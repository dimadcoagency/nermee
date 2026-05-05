-- ============================================
-- NEARMEE MESSAGES
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_created ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Booking parties can read messages
CREATE POLICY "Booking parties can read messages" ON messages FOR SELECT USING (
  booking_id IN (
    SELECT id FROM bookings
    WHERE customer_id = auth.uid()
    OR merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  )
);

-- Booking parties can send messages
CREATE POLICY "Booking parties can send messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  booking_id IN (
    SELECT id FROM bookings
    WHERE customer_id = auth.uid()
    OR merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  )
);

-- Recipients can mark messages as read
CREATE POLICY "Recipients can mark messages read" ON messages FOR UPDATE USING (
  sender_id != auth.uid() AND
  booking_id IN (
    SELECT id FROM bookings
    WHERE customer_id = auth.uid()
    OR merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  )
);
