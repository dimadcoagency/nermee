'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useChat(bookingId, userId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!bookingId || !userId) return;

    async function init() {
      const { data } = await supabase
        .from('messages')
        .select('id, content, sender_id, is_read, created_at, sender:profiles(full_name)')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      setMessages(data ?? []);
      setLoading(false);

      // Mark all received messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('booking_id', bookingId)
        .neq('sender_id', userId)
        .eq('is_read', false);
    }

    init();

    // Real-time subscription
    const channel = supabase
      .channel(`chat:${bookingId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${bookingId}`,
      }, async (payload) => {
        // Fetch sender name for new message
        const { data: sender } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', payload.new.sender_id)
          .single();

        setMessages((prev) => [...prev, { ...payload.new, sender }]);

        // Auto-mark as read if it's from the other person
        if (payload.new.sender_id !== userId) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', payload.new.id);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [bookingId, userId]);

  async function sendMessage(content) {
    if (!content.trim()) return false;
    const { error } = await supabase.from('messages').insert({
      booking_id: bookingId,
      sender_id: userId,
      content: content.trim(),
    });
    return !error;
  }

  return { messages, loading, sendMessage };
}

export function useChats(userId, merchantId) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function fetch() {
      // Get all confirmed/in-progress bookings for this user
      let query = supabase
        .from('bookings')
        .select(`
          id, status, booking_date, booking_time,
          service:services(title, category),
          customer:profiles!bookings_customer_id_fkey(id, full_name),
          merchant:merchants(id, business_name, user_id)
        `)
        .in('status', ['confirmed', 'in_progress', 'completed'])
        .order('created_at', { ascending: false });

      if (merchantId) {
        query = query.or(`customer_id.eq.${userId},merchant_id.eq.${merchantId}`);
      } else {
        query = query.eq('customer_id', userId);
      }

      const { data: bookings } = await query;
      if (!bookings?.length) { setChats([]); setLoading(false); return; }

      // Get last message + unread count for each booking
      const chatData = await Promise.all(
        bookings.map(async (b) => {
          const [lastMsgRes, unreadRes] = await Promise.all([
            supabase
              .from('messages')
              .select('content, created_at, sender_id')
              .eq('booking_id', b.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single(),
            supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('booking_id', b.id)
              .neq('sender_id', userId)
              .eq('is_read', false),
          ]);

          const isMerchantChat = b.merchant?.user_id === userId;
          const otherParty = isMerchantChat
            ? b.customer?.full_name
            : b.merchant?.business_name;

          return {
            bookingId: b.id,
            serviceTitle: b.service?.title,
            otherParty,
            isMerchantChat,
            lastMessage: lastMsgRes.data?.content ?? null,
            lastMessageTime: lastMsgRes.data?.created_at ?? b.booking_date,
            unread: unreadRes.count ?? 0,
            status: b.status,
          };
        })
      );

      setChats(chatData);
      setLoading(false);
    }

    fetch();
  }, [userId, merchantId]);

  return { chats, loading };
}

export function useUnreadCount(userId, merchantId) {
  const [count, setCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function fetch() {
      let bookingQuery = supabase.from('bookings').select('id');
      if (merchantId) {
        bookingQuery = bookingQuery.or(`customer_id.eq.${userId},merchant_id.eq.${merchantId}`);
      } else {
        bookingQuery = bookingQuery.eq('customer_id', userId);
      }

      const { data: bookings } = await bookingQuery;
      if (!bookings?.length) { setCount(0); return; }

      const { count: unread } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('booking_id', bookings.map((b) => b.id))
        .neq('sender_id', userId)
        .eq('is_read', false);

      setCount(unread ?? 0);
    }

    fetch();

    const channel = supabase
      .channel('unread-watch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetch)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, merchantId]);

  return count;
}
