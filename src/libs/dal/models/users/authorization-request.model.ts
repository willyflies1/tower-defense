import { User } from "./user";

export interface AuthorizationRequest {
  accessJwt: string;
  refreshJwt: string;
  _user: User;
}
