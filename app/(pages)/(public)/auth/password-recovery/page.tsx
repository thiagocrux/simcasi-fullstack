import { ArrowLeft, CircleAlert, CircleCheckBig } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import {
  requestNewPassword,
  resetPassword,
} from '@/app/actions/session.actions';
import { LockSection } from '@/app/components/features/auth/LockSection';
import { RequestNewPasswordForm } from '@/app/components/features/auth/RequestNewPasswordForm';
import { ResetPasswordForm } from '@/app/components/features/auth/ResetPasswordForm';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

import {
  RequestNewPasswordInput,
  ResetPasswordInput,
} from '@/core/application/validation/schemas/session.schema';

interface PasswordRecoverySectionProps {
  variant?:
    | 'new-password-request'
    | 'generated-link'
    | 'expired-link'
    | 'password-reset';
}

export const metadata: Metadata = {
  title: 'Página de recuperação de senha',
  description: '',
};

export default function SignInPage({
  variant = 'new-password-request',
}: PasswordRecoverySectionProps) {
  async function submitAction(
    input: RequestNewPasswordInput | ResetPasswordInput
  ) {
    'use server';

    switch (variant) {
      case 'new-password-request':
        await requestNewPassword(input as RequestNewPasswordInput);
        break;
      case 'generated-link':
        // TODO: Implement "generated-link" variant logic here.
        break;
      case 'expired-link':
        // TODO: Implement "expired-link" variant logic here.
        break;
      default:
        await resetPassword(input as ResetPasswordInput);
    }
  }

  return (
    <Card className="flex md:flex-row flex-col items-stretch gap-0 my-auto p-0 w-full max-w-md md:max-w-4xl">
      <div className="flex flex-col gap-y-6 p-6 sm:p-12 w-full">
        {variant === 'new-password-request' && (
          <>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Esqueceu a senha?</p>
              <p className="text-gray-500 text-sm">
                Não se preocupe, acontece. Digite seu e-mail abaixo para receber
                as instruções de recuperação.
              </p>
            </div>
            <RequestNewPasswordForm className="flex flex-col gap-y-6" />
            <Button
              variant="link"
              className="p-0 w-min cursor-pointer select-none"
              tabIndex={-1}
            >
              <Link href="/auth/sign-in" className="flex items-center gap-x-1">
                <ArrowLeft />
                <span>Voltar para o login</span>
              </Link>
            </Button>
          </>
        )}

        {variant === 'password-reset' && (
          <>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Criar nova senha</p>
              <p className="text-gray-500 text-sm">
                Sua nova senha deve ser diferente das senhas utilizadas
                anteriormente.
              </p>
            </div>
            <ResetPasswordForm />
            <Button
              variant="link"
              className="p-0 w-min cursor-pointer select-none"
            >
              <Link href="/auth/sign-in" className="flex items-center gap-x-1">
                <ArrowLeft />
                <span>Voltar para o login</span>
              </Link>
            </Button>
          </>
        )}

        {variant === 'generated-link' && (
          <>
            <div className="bg-green-100 p-6 border-2 border-green-600 rounded-full w-min">
              <CircleCheckBig size={32} className="text-green-600" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Verifique o seu e-mail</p>
              <p className="text-sm">
                Enviamos um link de recuperação para{' '}
                <strong>seu@email.com</strong>.
              </p>
            </div>
            <p className="text-sm">
              Não recebeu? Verifique sua caixa de spam ou tente novamente.
            </p>
            <Button className="w-full cursor-pointer select-none">
              <Link href="/auth/sign-in">Voltar para o login</Link>
            </Button>
          </>
        )}

        {variant === 'expired-link' && (
          <>
            <div className="bg-red-100 p-6 border-2 border-red-600 rounded-full w-min">
              <CircleAlert size={32} className="text-red-600" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Link expirado</p>
              <p className="text-sm">
                O link de recuperação perdeu a validade ou já foi utilizado. Por
                favor, solicite uma nova troca de senha.
              </p>
            </div>
            <div className="flex flex-col gap-y-4">
              {/* NOTE: Will this redirect to the solicitation page or extract the registered e-mail from the expired link and retry the request?  */}
              <form>
                <Button size="lg" className="w-full">
                  Solicitar novamente
                </Button>
              </form>
              <Button
                variant="link"
                className="p-0 w-min cursor-pointer select-none"
              >
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-x-1"
                >
                  <ArrowLeft />
                  <span>Voltar para o login</span>
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
      <Separator orientation="vertical" className="hidden md:flex gap-0" />
      <LockSection className="p-6 md:p-12" />
    </Card>
  );
}
