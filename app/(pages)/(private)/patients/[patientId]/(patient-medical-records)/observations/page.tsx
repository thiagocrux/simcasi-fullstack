import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Observações do paciente | SIMCASI',
  description:
    'Visualize todas as observações cadastradas, exclua registros ou acesse a página de edição e criação de observações para este paciente no SIMCASI.',
};

export default function PatientObservationsPage() {
  return <p>PatientObservationsPage</p>;
}
