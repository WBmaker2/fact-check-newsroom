import { CalendarDays, ClipboardList, Maximize2, UserRound } from 'lucide-react';

export const dimensions = [
  { id: 'publisher', label: '누가 만들었나요?', icon: UserRound },
  { id: 'date', label: '언제 만들었나요?', icon: CalendarDays },
  { id: 'method', label: '어떻게 알아봤나요?', icon: ClipboardList },
  { id: 'scope', label: '누구·어디 이야기인가요?', icon: Maximize2 },
] as const;
