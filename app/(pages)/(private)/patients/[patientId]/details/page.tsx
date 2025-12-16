import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhes do paciente | SIMCASI',
  description:
    'Consulte todas as informações detalhadas deste paciente no SIMCASI.',
};

export default function PatientDetails() {
  return <p>PatientDetailsPage</p>;
}
