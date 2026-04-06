export function formatPrice(amount) {
  return `₱${Number(amount).toLocaleString()}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getDatesAhead(days = 7) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(d),
      dayOfWeek: d.getDay(),
    };
  });
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
