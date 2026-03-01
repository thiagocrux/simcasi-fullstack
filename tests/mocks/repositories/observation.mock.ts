import { Observation } from '@/core/domain/entities/observation.entity';

export const observationMock: Observation = {
  id: 'o1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  patientId: 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
  observations: 'Patient follow-up notes',
  hasPartnerBeingTreated: true,
  createdBy: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  createdAt: new Date('2026-02-01T10:00:00Z'),
  updatedBy: null,
  updatedAt: null,
  deletedAt: null,
};
