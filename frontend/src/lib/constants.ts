export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  SNACKS: 'snacks',
  DINNER: 'dinner'
} as const;

export const SLOT_TIMINGS = {
  BREAKFAST: [
    { id: 1, start: '08:00', end: '09:00', label: '8 AM - 9 AM' },
    { id: 2, start: '09:00', end: '10:00', label: '9 AM - 10 AM' },
    { id: 3, start: '10:00', end: '11:00', label: '10 AM - 11 AM' },
    { id: 4, start: '11:00', end: '12:00', label: '11 AM - 12 PM' }
  ],
  LUNCH: [
    { id: 5, start: '12:00', end: '13:00', label: '12 PM - 1 PM' },
    { id: 6, start: '13:00', end: '14:00', label: '1 PM - 2 PM' },
    { id: 7, start: '14:00', end: '15:00', label: '2 PM - 3 PM' },
    { id: 8, start: '15:00', end: '16:00', label: '3 PM - 4 PM' }
  ],
  SNACKS: [
    { id: 9, start: '16:00', end: '17:00', label: '4 PM - 5 PM' },
    { id: 10, start: '17:00', end: '18:00', label: '5 PM - 6 PM' }
  ],
  DINNER: [
    { id: 11, start: '18:00', end: '19:00', label: '6 PM - 7 PM' },
    { id: 12, start: '19:00', end: '20:00', label: '7 PM - 8 PM' },
    { id: 13, start: '20:00', end: '21:00', label: '8 PM - 9 PM' }
  ]
} as const;

export const TOKEN_STATUS = {
  SERVING: 'serving',
  SERVED: 'served',
  ACTIVE: 'active',
  EXPIRED: 'expired'
} as const;

export const TOKEN_STATUS_COLORS = {
  [TOKEN_STATUS.SERVING]: 'var(--color-status-serving)',
  [TOKEN_STATUS.SERVED]: 'var(--color-status-served)',
  [TOKEN_STATUS.ACTIVE]: 'var(--color-status-active)',
  [TOKEN_STATUS.EXPIRED]: 'var(--color-status-expired)'
} as const;

export const COUNTERS = [
  { id: 1, name: 'Counter 1' },
  { id: 2, name: 'Counter 2' },
  { id: 3, name: 'Counter 3' },
  { id: 4, name: 'Counter 4' }
] as const;