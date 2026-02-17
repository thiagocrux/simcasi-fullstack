import { Metadata } from 'next';
import Link from 'next/link';

import { GitHubIcon, LinkedInIcon } from '@/app/components/common/BrandIcons';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';

export const metadata: Metadata = {
  title: 'Sobre o sistema | SIMCASI',
  description:
    'Conheça a missão do sistema e informações sobre a versão atual da plataforma de monitoramento.',
};

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Sobre o sistema"
        description={SYSTEM_CONSTANTS.DESCRIPTION}
      />
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Versão</h4>
        <p className="text-muted-foreground text-sm">
          {SYSTEM_CONSTANTS.VERSION}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Direito autoral</h4>
        <p className="text-muted-foreground text-sm">
          {SYSTEM_CONSTANTS.COPYRIGHT}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">
          Sobre o desenvolvedor
        </h4>
        <p className="text-muted-foreground text-sm">
          Sou o Thiago, desenvolvedor fullstack atuando profissionalmente desde
          2022. Para mais informações, acesse meu LinkedIn ou GitHub abaixo.
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Link
          href="https://linkedin.com/in/thiagocrux"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <LinkedInIcon size={18} />
          LinkedIn
        </Link>
        <Link
          href="https://github.com/thiagocrux"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <GitHubIcon size={18} />
          GitHub
        </Link>
      </div>
    </div>
  );
}
