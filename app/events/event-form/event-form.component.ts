import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { StudentEvent, EventCategory, EventStatus } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { titleUniqueValidator } from '../../validators/title-unique.validator';


@Component({
selector: 'app-event-form',
templateUrl: './event-form.component.html',
styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
@Input() initial?: StudentEvent | null;


categories: EventCategory[] = ['Workshop','Seminar','Social','Club Meeting'];
statuses: EventStatus[] = ['Draft','Scheduled','Ongoing','Completed','Cancelled'];


form = this.fb.group({
id: [''],
title: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(100)],],
description: ['',[Validators.maxLength(500)]],
category: ['Workshop', Validators.required],
status: ['Draft', Validators.required],
eventDate: ['', Validators.required],
createdAt: [''],
attendees: [0, [Validators.min(0), Validators.max(500)]],
location: ['', Validators.maxLength(200)]
});


constructor(private fb: FormBuilder, private eventService: EventService) {}


ngOnInit(): void {
// attach async validator after service is available
this.form.get('title')!.setAsyncValidators(titleUniqueValidator(this.eventService, this.initial?.id));


}if (this.initial) {              