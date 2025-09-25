import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { EventModel, createNewEvent, Category, Status } from '../models/event.model';
import DOMPurify from 'dompurify';

const STORAGE_KEY = 'seu_events_store';
const SIMULATED_DELAY = 250; // ms

@Injectable({ providedIn: 'root' })
export class EventService {
  private store$ = new BehaviorSubject<EventModel[]>(this.loadInitial());
  public readonly events$ = this.store$.asObservable();

  constructor() {
    this.startRealtimeSimulation();
  }

  private loadInitial(): EventModel[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as EventModel[];
      } catch {
        return this.seedDemo();
      }
    }
    const seeded = this.seedDemo();
    this.saveToStorage(seeded);
    return seeded;
  }

  private seedDemo(): EventModel[] {
    const now = new Date();
    const make = (i: number, title: string, daysOffset = i+1) => {
      const e = createNewEvent({
        title,
        description: `Demo description for ${title}`,
        category: Object.values(Category)[i % Object.values(Category).length],
        status: i % 3 === 0 ? Status.Scheduled : Status.Draft,
        eventDate: new Date(now.getTime() + daysOffset * 24 * 3600 * 1000).toISOString(),
        attendees: Math.floor(Math.random() * 200),
        location: `Room ${100 + i}`,
      });
      return e;
    };
    return [
      make(0, 'Welcome Workshop', 5),
      make(1, 'Angular Seminar', 10),
      make(2, 'Club Social Night', 20),
      make(3, 'Project Showcase', 30),
      ...Array.from({length: 20}).map((_, i) => make(4+i, `Event ${i+1}`, 7+i)),
    ];
  }

  private saveToStorage(list: EventModel[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  fetchEvents(
    filter: { q?: string; category?: string } = {},
    sortBy: { field: keyof EventModel; dir: 'asc'|'desc' }[] = [],
    page = 0,
    pageSize = 50
  ): Observable<{ items: EventModel[]; total: number }> {
    return of(null).pipe(
      delay(SIMULATED_DELAY),
      map(() => {
        let items = [...this.store$.value];

        if (filter.q) {
          const q = filter.q.trim().toLowerCase();
          items = items.filter(i => i.title.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
        }
        if (filter.category) {
          items = items.filter(i => i.category === filter.category);
        }

        sortBy.forEach(s => {
          items.sort((a,b) => {
            const A = (a[s.field] ?? '') as any;
            const B = (b[s.field] ?? '') as any;
            if (A < B) return s.dir === 'asc' ? -1 : 1;
            if (A > B) return s.dir === 'asc' ? 1 : -1;
            return 0;
          });
        });

        const total = items.length;
        const start = page * pageSize;
        const paged = items.slice(start, start + pageSize);
        return { items: paged, total };
      })
    );
  }

  createEvent(ev: Partial<EventModel>): Observable<EventModel> {
    const cleanDesc = ev.description ? DOMPurify.sanitize(ev.description) : ev.description;
    const newE = createNewEvent({
      ...ev,
      description: cleanDesc,
    });
    const next = [newE, ...this.store$.value];
    this.store$.next(next);
    this.saveToStorage(next);
    return of(newE).pipe(delay(SIMULATED_DELAY));
  }

  updateEvent(id: string, patch: Partial<EventModel>): Observable<EventModel> {
    const list = [...this.store$.value];
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return throwError(() => new Error('Not found'));
    const updated: EventModel = {
      ...list[idx],
      ...patch,
      description: patch.description ? DOMPurify.sanitize(patch.description) : list[idx].description,
    };
    list[idx] = updated;
    this.store$.next(list);
    this.saveToStorage(list);
    return of(updated).pipe(delay(SIMULATED_DELAY));
  }

  deleteEvent(id: string): Observable<void> {
    const list = this.store$.value.filter(x => x.id !== id);
    this.store$.next(list);
    this.saveToStorage(list);
    return of(void 0).pipe(delay(SIMULATED_DELAY));
  }

  duplicateEvent(id: string): Observable<EventModel> {
    const orig = this.store$.value.find(x => x.id === id);
    if (!orig) return throwError(() => new Error('Not found'));
    const copy = createNewEvent({
      ...orig,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString(),
      attendees: 0,
    });
    const next = [copy, ...this.store$.value];
    this.store$.next(next);
    this.saveToStorage(next);
    return of(copy).pipe(delay(SIMULATED_DELAY));
  }

  isTitleUnique(title: string, exceptId?: string): Observable<boolean> {
    return of(null).pipe(
      delay(SIMULATED_DELAY),
      map(() => {
        const trimmed = (title || '').trim().toLowerCase();
        return !this.store$.value.some(ev => ev.title.trim().toLowerCase() === trimmed && ev.id !== exceptId);
      })
    );
  }

  private startRealtimeSimulation() {
    timer(20000, 25000).subscribe(() => {
      const list = [...this.store$.value];
      if (!list.length) return;
      const idx = Math.floor(Math.random() * list.length);
      list[idx] = { ...list[idx], attendees: Math.max(0, (list[idx].attendees ?? 0) + (Math.floor(Math.random() * 5) - 2)) };
      this.store$.next(list);
      this.saveToStorage(list);
    });
  }
}
