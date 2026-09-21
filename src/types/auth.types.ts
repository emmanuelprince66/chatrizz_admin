/** The signed-in admin. Tokens are never part of this object; they live in cookies only. */
export interface AuthUser {
  id: string;
  email: string;
  is_verified: boolean;
  profile: boolean;
  role?: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthUser {
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}
