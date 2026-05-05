'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChats } from '@/lib/hooks/useMessages';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export default function MessagesPage() {
  const router = useRouter();
  const { user, merchant, loading: authLoading } = useAuth();
  const { chats, loading } = useChats(user?.id, merchant?.id);

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="px-4 pt-12 pb-4 border-b border-nearmee-border">
          <h1 className="text-2xl font-extrabold text-nearmee-text">Messages</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
          <span className="text-5xl mb-4">💬</span>
          <p className="text-sm font-semibold text-nearmee-text">Sign in to see messages</p>
          <button onClick={() => router.push('/auth/login')}
            className="mt-4 px-6 py-2.5 bg-nearmee-coral text-white text-sm font-bold rounded-xl">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 pt-12 pb-4 border-b border-nearmee-border sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-extrabold text-nearmee-text">Messages</h1>
        <p className="text-xs text-nearmee-text-sec mt-0.5">Chat with providers on confirmed bookings</p>
      </header>

      <main className="flex-1 pb-28">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-nearmee-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <span className="text-5xl mb-4">💬</span>
            <p className="text-sm font-semibold text-nearmee-text">No messages yet</p>
            <p className="text-xs text-nearmee-text-sec mt-1 leading-relaxed">
              Once a merchant confirms your booking, you can chat with them here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-nearmee-border">
            {chats.map((chat) => (
              <button key={chat.bookingId}
                onClick={() => router.push(`/messages/${chat.bookingId}`)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-nearmee-surface">
                <div className="w-12 h-12 rounded-full bg-nearmee-coral flex items-center justify-center shrink-0 text-white font-bold text-base">
                  {chat.otherParty?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-nearmee-text truncate">{chat.otherParty}</p>
                    <span className="text-[10px] text-nearmee-text-sec shrink-0">{timeAgo(chat.lastMessageTime)}</span>
                  </div>
                  <p className="text-xs text-nearmee-text-sec mt-0.5 truncate">{chat.serviceTitle}</p>
                  <p className={`text-xs mt-0.5 truncate ${chat.unread > 0 ? 'font-semibold text-nearmee-text' : 'text-nearmee-text-sec'}`}>
                    {chat.lastMessage ?? 'Tap to start chatting'}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-nearmee-coral flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
