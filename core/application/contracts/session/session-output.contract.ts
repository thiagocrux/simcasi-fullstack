/** Common session output properties used across authentication contracts. */
export interface SessionOutput {
  /** JWT access token for API authorization. */
  accessToken: string;
  /** Opaque refresh token for session renewal. */
  refreshToken: string;
  /** Whether the session should be persistent. */
  rememberMe?: boolean;
  /** Expiration time for the access token in seconds. */
  accessTokenExpiresIn: number;
  /** Expiration time for the refresh token in seconds. */
  refreshTokenExpiresIn: number;
  /** Basic information of the authenticated user. */
  user: {
    /** Unique user identifier. */
    id: string;
    /** Full name of the user. */
    name: string;
    /** Email address of the user. */
    email: string;
    /** ID of the user's current role. */
    roleId: string;
  };
  /** List of permission codes assigned to the user. */
  permissions: string[];
}
