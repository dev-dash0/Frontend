import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectVisitService {
  private visitKey = 'projectVisits';

  incrementVisit(projectId: number): void {
    const data = JSON.parse(localStorage.getItem(this.visitKey) || '{}');
    data[projectId] = (data[projectId] || 0) + 1;
    localStorage.setItem(this.visitKey, JSON.stringify(data));
  }

  getVisitCounts(): Record<number, number> {
    return JSON.parse(localStorage.getItem(this.visitKey) || '{}');
  }
}
