import { Component, Input } from '@angular/core';
import { SingleDay } from 'src/app/models/singleDay.model';

@Component({
  selector: 'app-one-day',
  templateUrl: './one-day.component.html',
  styleUrls: ['./one-day.component.css'],
})
export class OneDayComponent {
  @Input() singleDay?: SingleDay;
  @Input() weekday?: string;
  @Input() isSunday?: boolean = false;

  today: Date = new Date();
  showHolidays: boolean = false;
}
