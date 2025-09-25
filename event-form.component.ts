import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Category, Status, EventModel } from '../../models/event.model';
import { noLeadingOrTrailingSpace, maxLengthIfPresent, titleUniqueValidator, futureDateIfNeeded } from '../../validators/event-validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;
  categories = Object.values(Category);
  statuses = Object.values(Status);
  editingEventId?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private evSrv: EventService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), noLeadingOrTrailingSpace()]],
      description: ['', [maxLengthIfPresent(500)]],
      category: [this.categories[0], Validators.required],
      status: [this.statuses[0], Validators.required],
      eventDate: ['', [futureDateIfNeeded('status')]],
      attendees: [0, [Validators.min(0), Validators.max(500)]],
      location: ['', [maxLengthIfPresent(200)]]
    });

    this.form.get('title')!.setAsyncValidators(titleUniqueValidator(this.evSrv));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingEventId = id;
      this.loading = true;
      this.evSrv.events$.subscribe(list => {
        const e = list.find(x => x.id === id);
        if (e) {
          this.form.patchValue({
            title: e.title,
            description: e.description,
            category: e.category,
            status: e.status,
            eventDate: e.eventDate ? e.eventDate.slice(0,16) : '',
            attendees: e.attendees,
            location: e.location
          });
          this.form.get('title')!.setAsyncValidators(titleUniqueValidator(this.evSrv, id));
          this.loading = false;
        }
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Please fix form errors', 'OK', { duration: 3000 });
      return;
    }
    const raw = this.form.value;
    const payload: Partial<EventModel> = {
      title: raw.title.trim(),
      description: raw.description,
      category: raw.category,
      status: raw.status,
      eventDate: raw.eventDate ? new Date(raw.eventDate).toISOString() : undefined,
      attendees: raw.attendees,
      location: raw.location
    };

    if (this.editingEventId) {
      this.evSrv.updateEvent(this.editingEventId, payload).subscribe(() => {
        this.snack.open('Event updated', 'OK', { duration: 2000 });
        this.router.navigate(['/']);
      });
    } else {
      this.evSrv.createEvent(payload).subscribe(() => {
        this.snack.open('Event created', 'OK', { duration: 2000 });
        this.router.navigate(['/']);
      });
    }
  }
}
