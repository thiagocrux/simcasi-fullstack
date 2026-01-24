import { redirect } from 'next/navigation';

export default async function RootPage() {
  // The `proxy.ts` file ensures that if execution reaches this point, the user is authenticated.
  // Therefore, we redirect to the system's main page (Dashboard).
  redirect('/dashboard');
}
