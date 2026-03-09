'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usePermission } from '@/hooks/usePermission';
import { NewMedicalRecordDialog } from '../../common/NewMedicalRecordDialog';
import { Button } from '../../ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';

export function QuickStartSection() {
  const { can } = usePermission();
  const router = useRouter();

  // Avoid hydration mismatch by only rendering after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const data = [
    {
      entity: 'patients',
      permission: 'create:patient',
      label: 'Cadastrar paciente',
    },
    {
      entity: 'exams',
      permission: 'create:exam',
      label: 'Cadastrar exame',
    },
    {
      entity: 'notifications',
      permission: 'create:notification',
      label: 'Cadastrar notificação',
    },
    {
      entity: 'observations',
      permission: 'create:observation',
      label: 'Cadastrar observação',
    },
    {
      entity: 'treatments',
      permission: 'create:treatment',
      label: 'Cadastrar tratamento',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="mx-auto w-full">
      <Carousel className="w-full">
        <div className="left-0 z-1 absolute bg-background backdrop-blur-md w-8 h-9" />
        <div className="right-0 z-1 absolute bg-background backdrop-blur-md w-8 h-9" />
        <CarouselContent>
          {(() => {
            const visibleItems = data.filter((item) => can(item.permission));
            return visibleItems.map((item, index) => {
              const isLast = index === visibleItems.length - 1;
              return (
                <CarouselItem
                  key={item.entity}
                  className={`basis-1/1 xs:basis-1/2 sm:basis-1/3 ${isLast ? ' pr-9' : ''}`}
                >
                  {item.entity === 'patients' ? (
                    <Button
                      variant="default"
                      className="w-full cursor-pointer select-none"
                      onClick={() => router.push(`/${item.entity}/new`)}
                    >
                      <Plus />
                      {item.label}
                    </Button>
                  ) : (
                    <NewMedicalRecordDialog
                      variant={
                        item.entity as
                          | 'exams'
                          | 'notifications'
                          | 'observations'
                          | 'treatments'
                      }
                    >
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer select-none"
                      >
                        <Plus />
                        {item.label}
                      </Button>
                    </NewMedicalRecordDialog>
                  )}
                </CarouselItem>
              );
            });
          })()}
        </CarouselContent>
        <CarouselPrevious className="z-2 cursor-pointer" />
        <CarouselNext className="z-2 cursor-pointer" />
      </Carousel>
    </div>
  );
}
