'use client';

import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function CategoryPills({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors',
              isActive
                ? 'bg-nearmee-coral text-white'
                : 'bg-nearmee-surface text-nearmee-text-sec hover:bg-nearmee-border'
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
