import { CalendarDays, ClipboardList, Maximize2, UserRound } from 'lucide-react';

export const dimensions = [
  { id: 'publisher', label: '작성 주체', icon: UserRound },
  { id: 'date', label: '날짜', icon: CalendarDays },
  { id: 'method', label: '방법', icon: ClipboardList },
  { id: 'scope', label: '범위', icon: Maximize2 },
] as const;
