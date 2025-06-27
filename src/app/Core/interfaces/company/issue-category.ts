import { Issue } from '../Dashboard/Issue';
export interface IssueCategory {
  name: string;
  icon: string;
  class: string;
  status:  'to do' | 'Completed' |'In Progress'| 'Reviewing' | 'Canceled' |'Postponed' | 'Backlog';
  issues: Issue[];
}
