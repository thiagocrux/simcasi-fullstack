'use client';

import { useUser } from '@/hooks/useUser';
import { LatestActionsPerformed } from './LatestActionsPerformed';
import { LatestPatientsRegistered } from './LatestPatientsRegistered';

export function RecentActivitySection() {
  const { isUserAdmin } = useUser();

  return (
    <div className="gap-8 grid grid-cols-2">
      <div
        className={`flex flex-col gap-2 ${isUserAdmin ? 'col-span-full xl:col-span-1' : 'col-span-full'}`}
      >
        <p className="font-semibold text-base">Últimos pacientes cadastrados</p>
        <LatestPatientsRegistered />
      </div>

      {isUserAdmin && (
        <div className="flex flex-col gap-2 col-span-full xl:col-span-1">
          <p className="font-semibold text-base">
            Últimos registros do sistema
          </p>
          <LatestActionsPerformed />
        </div>
      )}
    </div>
  );
}
