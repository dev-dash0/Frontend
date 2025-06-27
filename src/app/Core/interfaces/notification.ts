export interface Notification {
    id: number;
    userId: number;
    message: string;
    createdAt: string;
    isRead: boolean;
}

export interface UserProject {
  userId: number;
  projectId: number;
  role: string;
  joinedDate: string;
}
export interface User {
  id: number;
  imageUrl: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}

export interface Project {
  id: number;
  name: string;
  userProjects: UserProject[];
  creator: User;
}