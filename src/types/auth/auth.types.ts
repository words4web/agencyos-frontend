import { EUserRole } from "@/enums";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  designation: string;
}

export interface AuthState {
  accessToken: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface AuthResponseData {
  accessToken: string;
  user: IUser;
}

export interface AuthSuccessResponse {
  success: boolean;
  message?: string;
  data: AuthResponseData;
}
