import { Metadata } from 'next';
import Link from 'next/link';

import { GitHubIcon, LinkedInIcon } from '@/app/components/common/BrandIcons';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';

export const metadata: Metadata = {
  title: 'Sobre o sistema | SIMCASI',
  description:
    'Conheça a missão do sistema e informações sobre a versão atual da plataforma de monitoramento.',
};

export default async function AboutPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <ReturnLink />
      <PageHeader
        title="Sobre o sistema"
        description={SYSTEM_CONSTANTS.DESCRIPTION}
      />

      {/* Motivação */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Motivação</h4>
        <p className="text-muted-foreground text-sm">
          O sistema surgiu da necessidade de substituir ferramentas genéricas,
          como planilhas eletrônicas, utilizadas pelas unidades de saúde para
          catalogar pacientes com sífilis. A ausência de um sistema centralizado
          dificultava a recuperação ágil de históricos clínicos, comprometia a
          rastreabilidade das atualizações e impedia a geração de indicadores
          precisos para reporte às esferas governamentais. O SIMCASI resolve
          esses problemas ao oferecer:
        </p>
        <ul className="space-y-1 pl-5 text-muted-foreground text-sm list-disc">
          <li>
            Registro centralizado em substituição a processos manuais
            fragmentados
          </li>
          <li>Recuperação ágil de históricos clínicos completos</li>
          <li>Rastreabilidade por trilha de auditoria em todas as operações</li>
          <li>Controle de acesso granular por papéis e permissões</li>
          <li>
            Indicadores consolidados no dashboard para monitoramento
            epidemiológico
          </li>
          <li>Dados auditáveis para reporte a órgãos governamentais</li>
        </ul>
      </div>

      <Separator />

      {/* Versão */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Versão</h4>
        <p className="text-muted-foreground text-sm">
          {SYSTEM_CONSTANTS.VERSION}
        </p>
      </div>

      <Separator />

      {/* Direito autoral */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Direito autoral</h4>
        <p className="text-muted-foreground text-sm">
          {SYSTEM_CONSTANTS.COPYRIGHT}
        </p>
      </div>

      <Separator />

      {/* Sobre o desenvolvedor */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">
          Sobre o desenvolvedor
        </h4>
        <p className="text-muted-foreground text-sm">
          Sou o Thiago, desenvolvedor fullstack atuando profissionalmente desde
          2022. Para mais informações, acesse meu LinkedIn ou GitHub abaixo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Card className="px-6 py-2">
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 py-2">
            <LinkedInIcon
              size={18}
              className="text-muted-foreground shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">LinkedIn</p>
              <Link
                href="https://linkedin.com/in/thiagocrux"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                linkedin.com/in/thiagocrux
              </Link>
            </div>
          </div>
        </Card>

        <Card className="px-6 py-2">
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 py-2">
            <GitHubIcon size={18} className="text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">GitHub</p>
              <Link
                href="https://github.com/thiagocrux"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                github.com/thiagocrux
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
