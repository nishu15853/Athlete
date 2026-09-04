export interface UserSession {
  email: string;
  isDemo?: boolean;
  timestamp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  session: UserSession | null;
}
