import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Página não encontrada | SIMCASI',
  description: 'A página que você está tentando acessar não existe.',
};

export default function NotFoundPage() {
  return (
    <>
      <p>NotFoundPage</p>
      <Link href="/">Retornar ao início</Link>
    </>
  );
}
