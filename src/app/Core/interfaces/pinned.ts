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
    tenant: any;
    creator: ProjectCreator;
    userProjects: any[];
}

export interface ProjectCreator {
    id: number;
    imageUrl: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    birthday: string;
}

export interface Tenant {
    statusCode: number;
    isSuccess: boolean;
    errorMessages: any[];
    result: TenantResult[];
}

export interface TenantResult {
    id: number;
    name: string;
    description: string;
    tenantUrl: string;
    tenantCode: string;
    keywords: string;
    image: string;
    ownerID: number;
    owner: TenantOwner;
    joinedUsers: any[];
}

export interface TenantOwner {
    id: number;
    imageUrl: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    birthday: string;
}

