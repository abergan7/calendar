import { Component, Input } from '@angular/core';
import { CalendarTravel } from 'src/app/enums/calendarTravel.enum';
import { CreateCalendarService } from 'src/app/services/create-calendar.service';

@Component({
  selector: 'app-control-button',
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.css'],
})
export class ControlButtonComponent {
  @Input() travelDirection!: number;
  @Input() travelDirectionText: string = '';
  constructor(public calendarService: CreateCalendarService) {}
}
