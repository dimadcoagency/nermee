'use client';

export default function TimePicker({ slots, selected, onSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <p className="text-sm text-nermee-text-sec text-center py-4">
        No available slots for this day.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => {
        const active = selected === slot;
        return (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
              active
                ? 'bg-nermee-green border-nermee-green text-white'
                : 'bg-white border-nermee-border text-nermee-text hover:border-nermee-green'
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
