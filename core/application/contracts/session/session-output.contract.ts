export interface SessionOutput {
  accessToken: string;
  refreshToken: string;
  rememberMe?: boolean;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    roleId: string;
  };
  permissions: string[];
}
