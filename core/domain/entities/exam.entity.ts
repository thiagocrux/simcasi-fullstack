export interface Exam {
  id: string;
  patientId: string;
  treponemalTestType: string;
  treponemalTestResult: string;
  treponemalTestDate: Date;
  treponemalTestLocation: string;
  nontreponemalVdrlTest: string;
  nontreponemalTestTitration: string;
  nontreponemalTestDate: Date;
  otherNontreponemalTest?: string | null;
  otherNontreponemalTestDate?: Date | null;
  referenceObservations: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}
