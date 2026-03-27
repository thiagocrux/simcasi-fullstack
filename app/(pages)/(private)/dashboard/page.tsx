import { PageHeader } from '@/app/components/common/PageHeader';
import { LatestActionsPerformed } from '@/app/components/features/dashboard/LatestActionsPerformed';
import { LatestPatientsRegistered } from '@/app/components/features/dashboard/LatestPatientsRegistered';
import { MedicalRecordsChart } from '@/app/components/features/dashboard/MedicalRecordsChart';
import { PatientsChart } from '@/app/components/features/dashboard/PatientsChart';
import { QuickStartSection } from '@/app/components/features/dashboard/QuickStartSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | SIMCASI',
  description:
    'Acompanhe indicadores e informações consolidadas sobre pacientes, exames, tratamentos, observações e notificações no SIMCASI. Gerencie e visualize dados essenciais em um só lugar.',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pt-6 w-full max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="Acompanhe indicadores e informações consolidadas sobre pacientes, exames, tratamentos, observações e notificações no SIMCASI. Gerencie e visualize dados essenciais em um só lugar."
      />

      <div className="gap-8 grid grid-cols-2">
        <div className="flex flex-col gap-2 col-span-full">
          <p className="font-bold text-lg text-center">Acesso rápido</p>
          <QuickStartSection />
        </div>

        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-bold text-lg text-center">Pacientes</p>
          <PatientsChart />
        </div>

        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-bold text-lg text-center">Registros médicos</p>
          <MedicalRecordsChart />
        </div>

        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-bold text-lg text-center">
            Últimos pacientes cadastrados
          </p>
          <LatestPatientsRegistered />
        </div>

        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-bold text-lg text-center">
            Últimos registros do sistema
          </p>
          <LatestActionsPerformed />
        </div>
      </div>
    </div>
  );
}
