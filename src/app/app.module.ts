import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OneDayComponent } from './components/one-day/one-day.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarControlsComponent } from './components/calendar-controls/calendar-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { ControlButtonComponent } from './components/control-button/control-button.component';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  declarations: [
    AppComponent,
    OneDayComponent,
    CalendarComponent,
    CalendarControlsComponent,
    TooltipComponent,
    ControlButtonComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
