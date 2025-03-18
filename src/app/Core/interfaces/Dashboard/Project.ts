import { Tenant } from "./Tenant";

export interface Project {
    id: number;
    name: string;
    description: string;
    projectCode: string;
    startDate: string;
    endDate: string;
    creationDate: Date;
    priority: string;
    status: string;

    tenant: Tenant;

}
