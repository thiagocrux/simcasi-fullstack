import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { AppFooter } from './components/layout/AppFooter';
import { AppHeader } from './components/layout/AppHeader';

export const metadata: Metadata = {
  title: '404 - Página não encontrada | SIMCASI',
  description: 'A página que você está tentando acessar não existe.',
};

export default function NotFound() {
  return (
    <>
      <AppHeader variant="public" />
      <main className="flex flex-col flex-1 items-center px-2 sm:px-6 py-2 sm:py-16 w-full">
        <Card className="grid grid-cols-1 md:grid-cols-2 my-auto p-0 max-w-4xl">
          <div className="relative flex flex-col gap-6 px-6 sm:px-12 pt-20 pb-6 sm:pb-12 w-full overflow-hidden">
            <p className="-top-7 left-1 z-0 absolute font-extrabold text-accent text-8xl select-none">
              404
            </p>
            <p className="z-10 font-bold text-5xl">
              Ops! Parece que nos perdemos.
            </p>
            <p className="text-muted-foreground">
              A página que você está procurando não existe ou foi movida para
              outro endereço
            </p>
            <Button
              size="lg"
              className="flex items-center gap-2 w-min cursor-pointer select-none"
            >
              <ArrowLeft />
              <Link href="/">Voltar para o início</Link>
            </Button>
          </div>
          <div className="hidden md:flex flex-col justify-center items-center gap-8 bg-accent sm:p-12 px-6 w-full text-center">
            <Image src="/icons/404.svg" width={500} height={500} alt="" />
          </div>
        </Card>
      </main>
      <AppFooter />
    </>
  );
}
