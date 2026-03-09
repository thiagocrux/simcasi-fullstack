'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { findPatients } from '@/app/actions/patient.actions';
import { FindPatientsOutput } from '@/core/application/contracts/patient/find-patients.contract';
import { ActionResponse } from '@/lib/actions.utils';
import { formatDate } from '@/lib/formatters.utils';
import { logger } from '@/lib/logger.utils';
import { getTimezoneOffset } from '@/lib/shared.utils';
import { CustomSkeleton } from '../../common/CustomSkeleton';
import { Button } from '../../ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../../ui/item';

interface LatestActionsPerformed {
  maxListSize?: number;
}

export function LatestPatientsRegistered({
  maxListSize = 5,
}: LatestActionsPerformed) {
  const router = useRouter();

  // Avoid hydration mismatch by only rendering after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const {
    data: patientList,
    isPending: isPatientListPending,
    error: patientListError,
  } = useQuery({
    queryKey: ['find-patients', 'dashboard'],
    queryFn: async () => {
      if (!mounted) {
        return {
          success: true,
          data: { items: [], total: 0 },
        } as ActionResponse<FindPatientsOutput>;
      }

      return await findPatients({
        skip: 0,
        take: maxListSize,
        timezoneOffset: getTimezoneOffset(),
        includeRelatedUsers: true,
        includeDeleted: false,
      });
    },
    enabled: mounted,
    placeholderData: keepPreviousData,
  });

  const patients = useMemo(() => {
    if (patientList?.success) {
      return patientList.data.items;
    }
    if (patientList && !patientList.success) {
      logger.error('Failed to fetch patients', {
        cause: 'An error occurred while fetching patients from the API.',
        error: patientListError,
        action: 'fetch_patients',
      });
    }
    return [];
  }, [patientList, patientListError]);

  function generatePatientMessage(patientName?: string) {
    if (!patientName) {
      return 'Um novo paciente foi cadastrado.';
    }
    return `O paciente ${patientName} foi cadastrado.`;
  }

  if (isPatientListPending) {
    return <CustomSkeleton variant="record-list" />;
  }

  if (patients.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center mx-auto py-4 max-w-80 text-center">
        <Image
          src="/icons/nothing-here.svg"
          width={150}
          height={150}
          alt="Sem pacientes"
        />
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-bold text-xl">Nenhum paciente encontrado</p>
          <p className="text-muted-foreground">
            Ainda não há pacientes cadastrados no sistema. Os novos registros
            aparecerão aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {patients.map((patient) => (
        <Item key={patient.id} variant="muted">
          <ItemMedia variant="icon">
            <User />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{generatePatientMessage(patient.name)}</ItemTitle>
            <ItemDescription>{formatDate(patient.createdAt)}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
      <Button
        variant="outline"
        className="self-center cursor-pointer select-none"
        onClick={() => router.push('/patients')}
      >
        <User />
        Ver todos os pacientes
      </Button>
    </>
  );
}
