'use client';

import { useState } from 'react';

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    merchant: 'Mang Nestor Plumbing',
    lastMessage: 'Okay, I will be there at 10 AM. Please prepare access to the pipe.',
    time: '9:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: 'c2',
    merchant: "Ate Leny's Homemade Meals",
    lastMessage: 'Your order is ready! Rider is on the way.',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 'c3',
    merchant: "JM's Ride Service",
    lastMessage: 'Thank you for booking! See you tomorrow.',
    time: 'Apr 4',
    unread: 0,
    online: true,
  },
];

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function MessagesPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.merchant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-nearmee-border px-4 pt-12 pb-3 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-nearmee-text mb-3">Messages</h1>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-nearmee-text-sec"
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="w-full bg-nearmee-surface rounded-xl pl-9 pr-4 py-2.5 text-sm text-nearmee-text placeholder:text-nearmee-text-sec outline-none focus:ring-2 focus:ring-nearmee-coral"
          />
        </div>
      </header>

      <main className="flex-1 pb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <span className="text-5xl mb-4">💬</span>
            <p className="text-sm font-semibold text-nearmee-text">No conversations yet</p>
            <p className="text-xs text-nearmee-text-sec mt-1">
              When you book a service, you can message the provider here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-nearmee-border">
            {filtered.map((convo) => (
              <button
                key={convo.id}
                className="flex items-center gap-3 px-4 py-3.5 text-left active:bg-nearmee-surface transition-colors w-full"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-nearmee-light flex items-center justify-center text-sm font-bold text-nearmee-coral">
                    {getInitials(convo.merchant)}
                  </div>
                  {convo.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-nearmee-coral border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${convo.unread > 0 ? 'font-bold text-nearmee-text' : 'font-semibold text-nearmee-text'}`}>
                      {convo.merchant}
                    </p>
                    <span className={`text-[11px] shrink-0 ml-2 ${convo.unread > 0 ? 'text-nearmee-coral font-semibold' : 'text-nearmee-text-sec'}`}>
                      {convo.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate ${convo.unread > 0 ? 'text-nearmee-text font-medium' : 'text-nearmee-text-sec'}`}>
                      {convo.lastMessage}
                    </p>
                    {convo.unread > 0 && (
                      <span className="ml-2 shrink-0 bg-nearmee-coral text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
