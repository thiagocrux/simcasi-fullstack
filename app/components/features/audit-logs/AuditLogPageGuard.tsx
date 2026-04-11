'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUser } from '@/hooks/useUser';

interface AuditLogPageGuardProps {
  children: React.ReactNode;
}

export function AuditLogPageGuard({ children }: AuditLogPageGuardProps) {
  const router = useRouter();
  const { isUserAdmin, isHydrated } = useUser();

  useEffect(() => {
    if (isHydrated && !isUserAdmin) {
      router.replace('/dashboard');
    }
  }, [isHydrated, isUserAdmin, router]);

  if (!isHydrated || !isUserAdmin) {
    return null;
  }

  return <>{children}</>;
}
