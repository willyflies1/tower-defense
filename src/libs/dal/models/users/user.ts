import { Role } from './role';

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  createdOn?: string;
  lastLogin?: string;
  roles?: Role[];
}
