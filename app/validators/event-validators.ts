import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { EventService } from '../services/event.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';


export function titleUniqueValidator(eventService: EventService, currentId?: string): AsyncValidatorFn {
return (control: AbstractControl) => {
const title = control.value?.trim();
if (!title) return of(null);


return eventService.findByTitle(title).pipe(
map(events => {
if (!events || events.length === 0) return null;
// if editing, allow same title for the same id
const conflict = events.find(e => e.title.trim().toLowerCase() === title.toLowerCase() && e.id !== currentId);
return conflict ? { titleTaken: true } : null;
})
);
};
}