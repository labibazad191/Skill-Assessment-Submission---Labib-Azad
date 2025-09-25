export type EventCategory = 'Workshop' | 'Seminar' | 'Social' | 'Club Meeting';
export type EventStatus = 'Draft' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface StudentEvent {
  id: string; // UUID v4
  title: string; // 5–100 chars
  description?: string; // optional, max 500 chars
  category: EventCategory;
  status: EventStatus;
  eventDate: Date; // future date if Draft/Scheduled
  createdAt: Date; // auto set
  attendees?: number; // optional, 0–500
  location?: string; // optional, max 200 chars
}
export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  dateRange?: { start: Date; end: Date };
  minAttendees?: number;
  maxAttendees?: number;
}

export interface Pagination {
  page: number; // 1-based
  pageSize: number; // 1–100
}

export interface EventQueryParams extends Pagination {
  filters?: EventFilters;
  sortBy?: 'eventDate' | 'createdAt' | 'attendees';
  sortOrder?: 'asc' | 'desc';
}   