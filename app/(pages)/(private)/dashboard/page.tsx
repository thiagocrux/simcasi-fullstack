import { PageHeader } from '@/app/components/common/PageHeader';
import { LatestActionsPerformed } from '@/app/components/features/dashboard/LatestActionsPerformed';
import { LatestPatientsRegistered } from '@/app/components/features/dashboard/LatestPatientsRegistered';
import { MedicalRecordsChart } from '@/app/components/features/dashboard/MedicalRecordsChart';
import { PatientsChart } from '@/app/components/features/dashboard/PatientsChart';
import { QuickStartSection } from '@/app/components/features/dashboard/QuickStartSection';
import { Separator } from '@/app/components/ui/separator';
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

      {/* Quick start */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Acesso rápido</h4>
        <p className="text-muted-foreground text-sm">
          Atalhos para as operações mais comuns do sistema.
        </p>
      </div>

      <QuickStartSection />

      <Separator />

      {/* Charts */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Indicadores</h4>
        <p className="text-muted-foreground text-sm">
          Visão consolidada de pacientes e registros médicos cadastrados no
          sistema.
        </p>
      </div>

      <div className="gap-8 grid grid-cols-2">
        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-semibold text-base">Pacientes</p>
          <PatientsChart />
        </div>

        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-semibold text-base">Registros médicos</p>
          <MedicalRecordsChart />
        </div>
      </div>

      <Separator />

      {/* Latest entries */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Atividade recente</h4>
        <p className="text-muted-foreground text-sm">
          Últimos pacientes e registros de atividade cadastrados no sistema.
        </p>
      </div>

      <div className="gap-8 grid grid-cols-2">
        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-semibold text-base">
            Últimos pacientes cadastrados
          </p>
          <LatestPatientsRegistered />
        </div>

        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-semibold text-base">
            Últimos registros do sistema
          </p>
          <LatestActionsPerformed />
        </div>
      </div>
    </div>
  );
}
