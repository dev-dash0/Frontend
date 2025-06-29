import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

// to can show every add to sprint or issue without refresh the page
export class ProjectStateService {
  private sprintAddedSource = new BehaviorSubject<any>(null);
  sprintAdded$ = this.sprintAddedSource.asObservable();

  notifySprintCreated(sprint: any) {
    this.sprintAddedSource.next(sprint);
  }
}
