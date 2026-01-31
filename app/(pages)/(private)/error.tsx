'use client';

import { useEffect } from 'react';

import { LucideRefreshCcw } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { logger } from '@/lib/logger.utils';

export default function PrivateErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('[PRIVATE_ERROR_BOUNDARY]', error);
  }, [error]);

  return (
    <Card className="grid grid-cols-1 md:grid-cols-2 my-auto p-0 max-w-4xl">
      <div className="relative flex flex-col gap-6 px-6 sm:px-12 pt-20 pb-6 sm:pb-12 w-full overflow-hidden">
        <p className="-top-7 left-1 z-0 absolute font-extrabold text-accent text-8xl select-none">
          Erro
        </p>
        <p className="z-10 font-bold text-5xl">Algo deu errado!</p>
        <p className="text-muted-foreground">
          {error.message ||
            'Ocorreu um erro inesperado ao carregar esta página. Nossa equipe técnica já foi notificada.'}
        </p>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => (window.location.href = '/dashboard')}
          >
            Voltar ao dashboard
          </Button>
          <Button
            onClick={() => reset()}
            size="lg"
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <LucideRefreshCcw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
      <div className="hidden md:flex flex-col justify-center items-center gap-8 bg-accent sm:p-12 px-6 w-full text-center">
        <Image src="/icons/error-page.svg" width={500} height={500} alt="" />
      </div>
    </Card>
  );
}
