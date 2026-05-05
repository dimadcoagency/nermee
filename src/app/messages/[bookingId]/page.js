'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/lib/hooks/useMessages';
import { createClient } from '@/lib/supabase/client';

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
}

function formatDay(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function ChatPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const { user, merchant } = useAuth();
  const { messages, loading, sendMessage } = useChat(bookingId, user?.id);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [booking, setBooking] = useState(null);
  const bottomRef = useRef(null);
  const supabase = createClient();

  // Fetch booking info for header
  useEffect(() => {
    if (!bookingId) return;
    async function load() {
      const { data } = await supabase
        .from('bookings')
        .select(`
          id, status,
          service:services(title, category),
          customer:profiles!bookings_customer_id_fkey(id, full_name),
          merchant:merchants(id, business_name, user_id)
        `)
        .eq('id', bookingId)
        .single();
      setBooking(data);
    }
    load();
  }, [bookingId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || sending) return;
    setSending(true);
    await sendMessage(input);
    setInput('');
    setSending(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isMerchantUser = booking?.merchant?.user_id === user?.id;
  const otherParty = isMerchantUser
    ? booking?.customer?.full_name
    : booking?.merchant?.business_name;

  // Group messages by day
  let lastDay = null;

  return (
    <div className="flex flex-col min-h-screen bg-nearmee-surface">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-nearmee-border sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-nearmee-text-sec shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-nearmee-coral flex items-center justify-center shrink-0 text-white font-bold text-sm">
          {otherParty?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-nearmee-text truncate">{otherParty ?? '...'}</p>
          <p className="text-xs text-nearmee-text-sec truncate">{booking?.service?.title ?? ''}</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Booking info banner */}
            <div className="bg-white rounded-xl border border-nearmee-border p-3 mb-4 text-center">
              <p className="text-xs font-semibold text-nearmee-text">{booking?.service?.title}</p>
              <p className="text-[10px] text-nearmee-text-sec mt-0.5">
                Booking confirmed · Messages are visible to both parties
              </p>
            </div>

            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-nearmee-text-sec">No messages yet. Say hello! 👋</p>
              </div>
            )}

            {messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const day = formatDay(msg.created_at);
              const showDay = day !== lastDay;
              lastDay = day;

              return (
                <div key={msg.id}>
                  {showDay && (
                    <div className="text-center my-3">
                      <span className="text-[10px] font-semibold text-nearmee-text-sec bg-nearmee-surface px-3 py-1 rounded-full">
                        {day}
                      </span>
                    </div>
                  )}
                  <div className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-nearmee-coral flex items-center justify-center text-white text-xs font-bold shrink-0 mr-2 mt-1">
                        {(msg.sender?.full_name ?? otherParty ?? '?')[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className={`max-w-[75%]`}>
                      <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-nearmee-coral text-white rounded-br-sm'
                          : 'bg-white text-nearmee-text border border-nearmee-border rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-right' : 'text-left'} text-nearmee-text-sec`}>
                        {formatTime(msg.created_at)}
                        {isMe && <span className="ml-1">{msg.is_read ? '✓✓' : '✓'}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-nearmee-border px-4 py-3 z-10">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 bg-nearmee-surface rounded-2xl px-4 py-2.5 text-sm text-nearmee-text outline-none resize-none max-h-28 focus:ring-2 focus:ring-nearmee-coral"
            style={{ overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-opacity ${
              input.trim() ? 'bg-nearmee-coral active:opacity-80' : 'bg-nearmee-border'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
