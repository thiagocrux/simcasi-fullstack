export interface ValidateSessionInput {
  token: string;
}

export interface ValidateSessionOutput {
  userId: string;
  roleId: string;
  roleCode: string;
  sessionId: string;
}
