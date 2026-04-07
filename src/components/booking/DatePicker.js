'use client';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getDatesAhead(count = 10) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      day: DAYS[d.getDay()],
      date: d.getDate(),
      month: MONTHS[d.getMonth()],
      isToday: i === 0,
    };
  });
}

export default function DatePicker({ selected, onSelect }) {
  const dates = getDatesAhead(10);

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {dates.map(({ iso, day, date, month, isToday }) => {
        const active = selected === iso;
        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className={`flex flex-col items-center px-3 py-2.5 rounded-xl shrink-0 min-w-[56px] transition-colors border ${
              active
                ? 'bg-nermee-green border-nermee-green text-white'
                : 'bg-white border-nermee-border text-nermee-text-sec'
            }`}
          >
            <span className={`text-[10px] font-semibold uppercase ${active ? 'text-green-100' : 'text-nermee-text-sec'}`}>
              {isToday ? 'Today' : day}
            </span>
            <span className={`text-lg font-extrabold leading-tight ${active ? 'text-white' : 'text-nermee-text'}`}>
              {date}
            </span>
            <span className={`text-[10px] font-medium ${active ? 'text-green-100' : 'text-nermee-text-sec'}`}>
              {month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
