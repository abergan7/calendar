import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CalendarTravel } from 'src/app/enums/calendarTravel.enum';
import { CreateCalendarService } from 'src/app/services/create-calendar.service';

@Component({
  selector: 'app-calendar-controls',
  templateUrl: './calendar-controls.component.html',
  styleUrls: ['./calendar-controls.component.css'],
})
export class CalendarControlsComponent implements OnInit {
  inputDate: string = '';
  travelDirection = CalendarTravel;

  months: string[] = [
    'Januar',
    'Februar',
    'Marec',
    'April',
    'Maj',
    'Junij',
    'Julij',
    'Avgust',
    'September',
    'Oktober',
    'November',
    'December',
  ];
  selectedMonth: string = '';
  year: string = '';

  constructor(public calendarService: CreateCalendarService) {}

  ngOnInit(): void {
    this.selectedMonth = this.months[new Date().getMonth()];
  }

  customDayFullDate() {
    this.calendarService.customDay(this.inputDate);
  }

  customDate() {
    this.calendarService.customDay(
      this.year + '-' + (this.months.indexOf(this.selectedMonth) + 1) + '-1'
    );
  }

  onFileSelected($event: Event) {
    this.calendarService.onFileSelected($event);
  }

  monthTravel(item: any) {
    this.calendarService.monthTravel(item);
  }
}
