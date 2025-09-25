import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventService } from '../services/event.service';

export function noLeadingOrTrailingSpace(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = c.value as string;
    if (typeof v === 'string' && (v !== v.trim())) {
      return { trim: true };
    }
    return null;
  };
}

export function maxLengthIfPresent(max: number): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = c.value;
    if (!v) return null;
    return v.length > max ? { maxlength: { requiredLength: max, actualLength: v.length } } : null;
  };
}

export function titleUniqueValidator(eventService: EventService, exceptId?: string): AsyncValidatorFn {
  return (c): Observable<ValidationErrors | null> => {
    const val = c.value as string;
    if (!val || val.trim().length < 5) return new Observable(obs => obs.next(null));
    return eventService.isTitleUnique(val, exceptId).pipe(map(isUnique => (isUnique ? null : { titleTaken: true })));
  };
}

export function futureDateIfNeeded(statusControlName = 'status'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;
    const status = parent.get(statusControlName)?.value;
    if (status === 'Draft' || status === 'Scheduled') {
      const v = control.value;
      if (!v) return { required: true };
      const date = new Date(v);
      if (isNaN(date.getTime()) || date <= new Date()) return { futureDate: true };
    }
    return null;
  };
}
