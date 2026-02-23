'use client';

import Image from 'next/image';

/**
 * Componente reutilizável para exibir estado "não encontrado" em Dialogs de preview.
 * Centraliza a lógica de apresentação quando uma entidade não é encontrada ou foi removida.
 */
export function NotFoundPreviewContent() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto sm:p-12 px-6 rounded-md max-w-lg text-center">
      <Image
        src="/icons/no-results-found.svg"
        width={150}
        height={150}
        alt="Nenhum registro encontrado"
      />
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">Nenhum registro encontrado</p>
        <p className="text-muted-foreground">
          Este recurso não foi encontrado ou foi removido.
        </p>
      </div>
    </div>
  );
}
