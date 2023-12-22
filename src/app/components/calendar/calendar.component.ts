import { Component } from '@angular/core';
import { CreateCalendarService } from 'src/app/services/create-calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  constructor(public calendarService: CreateCalendarService) {}
  ngOnInit() {
    this.calendarService.createCalendar();
  }
}
