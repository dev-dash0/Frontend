export interface Sprint {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  summary: string;
  createdAt: Date;
  tenantId: number;
  projectId: number;
  createdById: number;
  createdBy: sprintCreatedBy;
  issues: any[];
}

export interface sprintCreatedBy {
  id: number;
  imageUrl: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthday: Date;
}

export interface SprintWithProgress extends Sprint {
  totalIssues: number;
  completedIssues: number;
  progress: number;
};
