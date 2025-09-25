import { v4 as uuidv4 } from 'uuid';

export type UUID = string;

export enum Category {
  Workshop = 'Workshop',
  Seminar = 'Seminar',
  Social = 'Social',
  ClubMeeting = 'Club Meeting'
}

export enum Status {
  Draft = 'Draft',
  Scheduled = 'Scheduled',
  Ongoing = 'Ongoing',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface EventModel {
  id: UUID;
  title: string;
  description?: string;
  category: Category;
  status: Status;
  eventDate?: string;
  createdAt: string;
  attendees?: number;
  location?: string;
}

export function createNewEvent(partial: Partial<EventModel> = {}): EventModel {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title: partial.title || '',
    description: partial.description,
    category: partial.category ?? Category.Workshop,
    status: partial.status ?? Status.Draft,
    eventDate: partial.eventDate,
    createdAt: now,
    attendees: partial.attendees ?? 0,
    location: partial.location ?? '',
  };
}
