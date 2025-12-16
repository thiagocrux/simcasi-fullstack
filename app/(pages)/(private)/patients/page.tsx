import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lista de pacientes | SIMCASI',
  description:
    'Visualize todos os pacientes cadastrados, exclua registros ou acesse a página de edição e criação de pacientes no SIMCASI.',
};

export default function PatientsPage() {
  return <p>PatientsPage</p>;
}
