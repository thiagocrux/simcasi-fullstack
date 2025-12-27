'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

export function ReturnLink() {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="link"
      className="p-0! w-min cursor-pointer select-none"
      onClick={router.back}
    >
      <ArrowLeft />
      Voltar
    </Button>
  );
}
