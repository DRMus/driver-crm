export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string; // ISO 8601
  reminderAt?: string; // ISO 8601
  isCompleted: boolean;
  color?: string;
  relatedRepairId?: string;
  relatedClientId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

