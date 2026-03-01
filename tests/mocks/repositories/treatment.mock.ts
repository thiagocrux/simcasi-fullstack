import { Treatment } from '@/core/domain/entities/treatment.entity';

export const treatmentMock: Treatment = {
  id: 't1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  patientId: 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
  medication: 'Penicillin G Benzathine',
  healthCenter: 'Health Center Central',
  startDate: new Date('2026-02-01'),
  dosage: '2.4 million IU',
  observations: 'First dose administered',
  partnerInformation: 'Partner notified and scheduled for treatment',
  createdBy: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
  createdAt: new Date('2026-02-01T10:00:00Z'),
  updatedBy: null,
  updatedAt: null,
  deletedAt: null,
};
