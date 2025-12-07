export const CLIENT_MODE = {
  NEW: 'new',
  EXISTING: 'existing',
} as const;

export type ClientMode = typeof CLIENT_MODE[keyof typeof CLIENT_MODE];

