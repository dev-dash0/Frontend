import { Component } from '@angular/core';
import { CalendarComponent } from "../calendar/calendar.component";

@Component({
  selector: 'app-dashboard-test',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './dashboard-test.component.html',
  styleUrl: './dashboard-test.component.css'
})
export class DashboardTestComponent {

}
