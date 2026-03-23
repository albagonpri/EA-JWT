export type UserRole = 'admin' | 'user';

export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  organizacion: string;
  role: UserRole;
}