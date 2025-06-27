import { ProfileData } from "../profile";

export interface Issues {
  issueId: number;
  title: string;
  startDate: string;
  deadline: string;
  description: string;
  category: string;
  priority: string;
  priorityIcon: string;
  status: string;
  isBacklog: boolean;
  assignedUsers?: ProfileData[];
}
