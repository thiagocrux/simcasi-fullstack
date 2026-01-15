export interface ValidateSessionInput {
  token: string;
}

export interface ValidateSessionOutput {
  userId: string;
  roleId: string;
  sessionId: string;
}
