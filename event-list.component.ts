import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/event.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

  items: EventModel[] = [];
  total = 0;
  page = 0;
  pageSize = 30;
  loading = false;

  search = new FormControl('');
  sortBy: { field: keyof EventModel; dir: 'asc'|'desc' }[] = [];

  constructor(private ev: EventService) {}

  ngOnInit() {
    this.ev.events$.subscribe(_ => {
      this.resetAndLoad();
    });

    this.search.valueChanges.subscribe(_ => {
      this.resetAndLoad();
    });

    this.resetAndLoad();
  }

  resetAndLoad() {
    this.items = [];
    this.page = 0;
    this.loadMore();
  }

  loadMore() {
    if (this.loading) return;
    this.loading = true;
    const q = this.search.value || '';
    this.ev.fetchEvents({ q }, this.sortBy, this.page, this.pageSize).pipe(
    ).subscribe(res => {
      this.items = [...this.items, ...res.items];
      this.total = res.total;
      this.page++;
      this.loading = false;
    }, () => { this.loading = false; });
  }

  onScroll() {
    const totalLoaded = this.items.length;
    if (totalLoaded < this.total) {
      this.loadMore();
    }
  }

  toggleSort(field: keyof EventModel) {
    const existing = this.sortBy.find(s => s.field === field);
    if (!existing) {
      this.sortBy.unshift({ field, dir: 'asc' });
    } else if (existing.dir === 'asc') {
      existing.dir = 'desc';
    } else {
      this.sortBy = this.sortBy.filter(s => s.field !== field);
    }
    this.resetAndLoad();
  }

  duplicate(ev: EventModel) {
    this.ev.duplicateEvent(ev.id).subscribe();
  }

  delete(ev: EventModel) {
    if (!confirm('Delete this event?')) return;
    this.ev.deleteEvent(ev.id).subscribe();
  }
}
