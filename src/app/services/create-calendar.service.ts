import { Injectable } from '@angular/core';
import { SingleDay } from '../models/singleDay.model';
import { HolidayEvent } from '../models/holidayEvent.model';
import { CalendarTravel } from '../enums/calendarTravel.enum';
import { RecurringDays } from '../enums/recurringDays.enum';

@Injectable({
  providedIn: 'root',
})
export class CreateCalendarService {
  weekDays: string[] = [
    'Nedelja',
    'Ponedeljek',
    'Torek',
    'Sreda',
    'Četrtek',
    'Petek',
    'Sobota',
  ];
  weekdayStart!: number;
  daysInMonth!: number;

  calendar: SingleDay[] = [];
  holidaysFile: HolidayEvent[] = [];
  holidaysThisMonth: SingleDay[] = [];

  date: Date = new Date();
  loading: boolean = false;
  errorOccurred: boolean = false;
  fileReadSuccessfully: boolean = false;

  constructor() {}

  getDaysInMonth(date: Date): number {
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return lastDay.getDate();
  }

  addToCalendar(len: number, blank?: boolean) {
    for (let i = 1; i <= len; i++) {
      if (blank) {
        this.calendar.push({});
      } else {
        let tempHolidays: string[] = [];
        this.holidaysThisMonth
          .filter((item) => item.dayDate?.getDate() === i)
          .map((item) => tempHolidays.push(item.holiday!.toString()));

        if (tempHolidays) {
          this.calendar.push({
            dayDate: new Date(this.date.getFullYear(), this.date.getMonth(), i),
            holiday: tempHolidays,
          });
        } else {
          this.calendar.push({
            dayDate: new Date(this.date.getFullYear(), this.date.getMonth(), i),
          });
        }
      }
    }
    console.log(this.calendar);
  }

  customDay(inputDate: string) {
    try {
      this.date = new Date(Date.parse(inputDate));
    } catch (e) {
      return;
    }
    this.createCalendar();
  }

  monthTravel(monthTravel: CalendarTravel) {
    switch (monthTravel) {
      case CalendarTravel.BackwardsOneMonth:
        this.date = new Date(this.date.setMonth(this.date.getMonth() - 1));
        break;
      case CalendarTravel.Today:
        this.date = new Date();
        break;
      case CalendarTravel.ForwardOneMonth:
        this.date = new Date(this.date.setMonth(this.date.getMonth() + 1));
        break;
    }
    this.checkHolidaysMonth();
    this.createCalendar();
  }

  createCalendar() {
    this.calendar = [];
    this.weekdayStart = new Date(this.date.setDate(1)).getDay();
    this.daysInMonth = this.getDaysInMonth(this.date);
    this.addToCalendar(this.weekdayStart, true);
    this.addToCalendar(this.daysInMonth);
  }

  checkHolidaysMonth(): void {
    this.holidaysThisMonth = [];
    this.holidaysFile
      .filter(
        (event) =>
          (new Date(event.dateEnd) >
            new Date(this.date.getFullYear(), this.date.getMonth(), 0) &&
            event.recurringDays === RecurringDays.Infinite) ||
          (new Date(event.dateEnd) >
            new Date(this.date.getFullYear(), this.date.getMonth(), 0) &&
            event.recurringDays === RecurringDays.JustOne) ||
          event.dateEnd === undefined ||
          event.recurringDays > 0
      )
      .map((event) => {
        //When there is an event that is infinite
        if (event.recurringDays === RecurringDays.Infinite) {
          //Month and day (year does not matter)
          let eventDate: Date = new Date(event.dateStart);
          if (
            eventDate.getMonth() &&
            eventDate.getFullYear() === this.date.getMonth() &&
            this.date.getFullYear()
          ) {
            this.holidaysThisMonth.push({
              dayDate: new Date(
                this.date.getFullYear(),
                eventDate.getMonth() + 1,
                eventDate.getDate()
              ),
              holiday: [event.nameOfHoliday],
            });
          }
          //When there is only one event
        } else if (event.recurringDays === RecurringDays.JustOne) {
          let tempDate: Date = new Date(event.dateStart);
          if (
            tempDate.getFullYear() === this.date.getFullYear() &&
            tempDate.getMonth() === this.date.getMonth()
          )
            this.holidaysThisMonth.push({
              dayDate: new Date(event.dateStart),
              holiday: [event.nameOfHoliday],
            });
          //When there is recurring event
        } else if (event.recurringDays > RecurringDays.JustOne) {
          let tempDate: Date = new Date(event.dateEnd);
          for (
            let i = new Date(event.dateStart);
            i <=
            new Date(
              tempDate.getFullYear(),
              tempDate.getMonth(),
              tempDate.getDate() + 1
            );
            i.setDate(i.getDate() + event.recurringDays)
          ) {
            if (
              i.getFullYear() === this.date.getFullYear() &&
              i.getMonth() === this.date.getMonth()
            ) {
              this.holidaysThisMonth.push({
                dayDate: new Date(i),
                holiday: [event.nameOfHoliday],
              });
            }
          }
        }
      });
    console.log(this.holidaysThisMonth);
  }

  //When file is selected
  onFileSelected($event: Event) {
    this.fileReadSuccessfully = false;
    this.errorOccurred = false;
    this.holidaysFile = [];
    const inputEl: HTMLInputElement = $event.target as HTMLInputElement;
    const file: File = (inputEl.files as FileList)[0];

    //only plain text file accepted
    if (file && file.type === 'text/plain') {
      this.readAndParseFile(file);
    }
  }

  //Reading&Parsing file
  async readAndParseFile(file: File) {
    const reader: FileReader = new FileReader();
    this.loading = true;

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const jsonData: HolidayEvent[] = await JSON.parse(
          e.target?.result as string
        );
        this.holidaysFile = jsonData;
        this.checkHolidaysMonth();
        this.createCalendar();
        this.fileReadSuccessfully = true;
      } catch (error) {
        this.errorOccurred = true;
      } finally {
        reader.abort();
        this.loading = false;
      }
    };

    reader.readAsText(file);
  }
}
