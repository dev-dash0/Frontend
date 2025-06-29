export interface SearchResults {
  issues: Issue[];
  projects: Project[];
  tenants: Tenant[];
  sprints: any[];
}

export interface Issue {
  title: string;
  status: string;
  priority: string;
  projectName: string;
  tenantName: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  priority: string;
  projectCode: string;
  tenantName: string;
}

export interface Tenant {
  id: number;
  name: string;
  description: string;
  tenantCode: string;
}
export interface Sprint {
  id: number;
  title: string;
  status: string;
  description: null;
  summary: null;
  projectName: string;
}
