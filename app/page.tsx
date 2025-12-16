import { redirect } from 'next/navigation';

export default async function RootPage() {
  // TODO: Implement real check to verify if there is an active session and remove the hardcoded value.
  const hasActiveSession = true;

  if (hasActiveSession) {
    redirect('/auth/sign-in');
  } else {
    redirect('/auth/sign-in');
  }
}
