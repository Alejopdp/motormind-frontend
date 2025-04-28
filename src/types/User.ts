export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export type User = {
  _id: string;
  email: string;
  name: string;
  workshopId: string;
  role: UserRole;
};
