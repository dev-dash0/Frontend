import { ProfileData } from '../profile';
export interface Issue {
    id: number;
    title: string;
    description: string;
    // projectCode: string;
    startDate: string;
    deadline: string;
    deliveredDate: Date;
    lastUpdate: Date;
    type: string;
    priority: string;
    status: string;
    projectName: string;
    createdBy?: ProfileData;
    creationDate: Date;
    labels: string;
    attachments: string;
    assignedUsers: ProfileData[];
    projectId: number;
    sprintId: number;
    attachment: string;
    attachmentPath: string;

}