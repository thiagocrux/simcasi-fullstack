export interface DeleteObservationInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeleteObservationOutput = void;
