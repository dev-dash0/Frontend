import { Projects } from './projects';

export interface ProjectCategory {
  name: string;
  icon: string;
  class: string;
  status:
    | 'completed'
    | 'overdue'
    | 'working on'
    | 'planning'
    | 'canceled'
    | 'postponed';
  projects: Projects[];
}
