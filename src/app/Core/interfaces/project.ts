export interface Project {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: any[];
    result: ProjectResult[];
}

export interface ProjectResult {
    id: number;
    name: string;
    description: string;
    projectCode: string;
    startDate: string;
    endDate: string;
    creationDate: string;
    priority: string;
    status: string;
    tenantId: number;
    creatorId: number;
    tenant: ProjectTenant;
    creator: Creator;
    userProjects: UserProject[];
}

export interface ProjectTenant {
  id: number;
  name: string;
  description: string;
  tenantUrl: string;
  tenantCode: string;
  keywords: string;
  image: string;
  ownerID: number;
  owner: ProjectOwner;
  joinedUsers: any[];
}

export interface ProjectOwner {
    id: number;
    imageUrl: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    birthday: string;
}

export interface Creator {
    id: number;
    imageUrl: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    birthday: string;
}

export interface UserProject {
    userId: number;
    projectId: number;
    role: string;
    joinedDate: string;
}


export interface fetchedProject {
  statusCode: number;
  isSuccess: boolean;
  errorMessages: any[];
  result: fetchedProjectDetails;
}

export interface fetchedProjectDetails {
  id: number;
  name: string;
  description: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  creationDate: string;
  priority: string;
  status: string;
  tenantId: number;
  creatorId: number;
  tenant: ProjectTenant;
  creator: Creator;
  userProjects: UserProject[];
  role: string;
}


