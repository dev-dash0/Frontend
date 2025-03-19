import { Issues } from './issues';

export interface IssueCategory {
  name: string;
  icon: string;
  class: string;
  status: 'backlog' | 'todo' | 'completed';
  issues: Issues[];
}
