import { redirect } from 'next/navigation';

export default async function RootPage() {
  // O middleware já garante que se chegarmos aqui, o usuário está autenticado.
  // Portanto, redirecionamos para a página principal do sistema (Dashboard).
  redirect('/dashboard');
}
