export interface Company {
  id: number;
  name: string;
  description: string;
  tenantUrl: string;
  tenantCode: string;
  keywords: string;
  image: string;
  ownerID: number;
  owner: Owner;
  joinedUsers: JoinedUser[];
}

interface JoinedUser {
  id: number;
  imageUrl: null | string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}

interface Owner {
  id: number;
  imageUrl: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}
