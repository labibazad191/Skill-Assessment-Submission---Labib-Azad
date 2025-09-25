import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentEvent } from '../models/event.model';


@Injectable({ providedIn: 'root' })
export class EventService {
private apiUrl = 'http://localhost:3000/events';


constructor(private http: HttpClient) {}


getEvents(): Observable<StudentEvent[]> {
return this.http.get<StudentEvent[]>(this.apiUrl);
}


getEvent(id: string): Observable<StudentEvent> {
return this.http.get<StudentEvent>(`${this.apiUrl}/${id}`);
}


createEvent(event: StudentEvent): Observable<StudentEvent> {
return this.http.post<StudentEvent>(this.apiUrl, event);
}


updateEvent(id: string, event: StudentEvent): Observable<StudentEvent> {
return this.http.put<StudentEvent>(`${this.apiUrl}/${id}`, event);
}


deleteEvent(id: string): Observable<void> {
return this.http.delete<void>(`${this.apiUrl}/${id}`);
}


// helper to check title uniqueness
findByTitle(title: string): Observable<StudentEvent[]> {
// json-server supports ?title_like= for simple matching
return this.http.get<StudentEvent[]>(`${this.apiUrl}?title=${encodeURIComponent(title)}`);
}
}