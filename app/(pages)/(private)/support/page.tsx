import { Metadata } from 'next';
import Link from 'next/link';

import { ClipboardCopyButton } from '@/app/components/common/ClipboardCopyButton';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

export const metadata: Metadata = {
  title: 'Suporte técnico | SIMCASI',
  description:
    'Central de ajuda e suporte técnico. Aqui você pode encontrar canais de contato, manuais de utilização e abrir chamados para suporte operacional. Estamos à disposição para garantir que o monitoramento dos casos ocorra sem interrupções.',
};

const SUPPORT_EMAIL = 'simcasi.team@gmail.com';

const EMAIL_TEMPLATE = `Assunto: [SUPORTE] Descrição breve do problema

Olá,

Estou reportando um problema no SIMCASI.

--- DESCRIÇÃO DO PROBLEMA ---
[Descreva o que aconteceu de forma objetiva]

--- RESULTADO ESPERADO ---
[O que você esperava que acontecesse]

--- RESULTADO OBTIDO ---
[O que realmente aconteceu]

--- PASSO A PASSO PARA REPRODUZIR ---
1.
2.
3.

--- MENSAGEM DE ERRO ---
[Cole aqui a mensagem de erro exibida na tela, se houver]

--- INFORMAÇÕES DO SISTEMA ---
Navegador: [ex: Google Chrome 123, Firefox 124]
URL da página: [ex: http://localhost:3000/patients]
Data e hora do erro: [ex: 30/03/2026 às 14h32]
Seu e-mail cadastrado: [seu@email.com]

--- EVIDÊNCIAS ---
[Descreva os arquivos anexados: prints de tela, print do console, etc.]

Atenciosamente,
[Seu nome]`;

const RESPONSE_TIMES = [
  {
    label: 'Crítico',
    description: 'Sistema completamente indisponível',
    time: 'Até 4 horas',
    variant: 'destructive' as const,
  },
  {
    label: 'Alto',
    description: 'Funcionalidade principal bloqueada',
    time: 'Até 12 horas',
    variant: 'warning' as const,
  },
  {
    label: 'Médio',
    description: 'Funcionalidade secundária afetada',
    time: 'Até 24 horas',
    variant: 'info' as const,
  },
  {
    label: 'Baixo',
    description: 'Dúvidas, sugestões ou melhorias',
    time: 'Até 48 horas',
    variant: 'secondary' as const,
  },
];

const REPORT_STEPS = [
  {
    number: '1',
    title: 'Colete a mensagem de erro',
    description:
      'Copie o texto exato que aparece na tela quando o erro ocorre. Se não houver mensagem visível, pressione F12, acesse a aba "Console" e copie as mensagens em vermelho.',
  },
  {
    number: '2',
    title: 'Tire capturas de tela',
    description:
      'Registre a tela mostrando o problema. Se o erro aparecer no console (F12), tire print dessa aba também. Antes de enviar, desfoque informações sensíveis como CPF ou dados de pacientes.',
  },
  {
    number: '3',
    title: 'Descreva o problema com clareza',
    description:
      'Explique o que você estava tentando fazer, o que esperava que acontecesse e o que realmente ocorreu. Quanto mais detalhado, mais rápida será a resolução.',
  },
  {
    number: '4',
    title: 'Liste o passo a passo',
    description:
      'Numere cada ação realizada antes do erro acontecer. Seja específico: inclua os valores inseridos, os botões clicados e as páginas visitadas na ordem exata.',
  },
];

export default async function SupportPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <ReturnLink />
      <PageHeader
        title="Suporte técnico"
        description="Central de ajuda e suporte técnico. Encontre aqui o canal de contato e as orientações para reportar problemas de forma eficiente."
      />

      {/* Contact */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Contato</h4>
        <p className="text-muted-foreground text-sm">
          Para abrir um chamado ou tirar dúvidas, envie um e-mail para o
          endereço abaixo. Descreva o problema com o máximo de detalhes possível
          — quanto mais informações você fornecer, mais rápida será a resolução.
        </p>
      </div>

      <Card className="px-6 py-2">
        <div className="flex sm:flex-row flex-col sm:items-center gap-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">E-mail de suporte</p>
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-muted-foreground hover:text-foreground text-sm truncate transition-colors"
            >
              {SUPPORT_EMAIL}
            </Link>
          </div>
          <ClipboardCopyButton
            value={SUPPORT_EMAIL}
            label="Copiar e-mail"
            variant="button"
          />
        </div>
      </Card>

      <Separator />

      {/* How to report */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">
          Como reportar um problema
        </h4>
        <p className="text-muted-foreground text-sm">
          Siga os passos abaixo antes de entrar em contato. Relatórios bem
          estruturados reduzem o tempo de diagnóstico e aceleram a resolução.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {REPORT_STEPS.map((step) => (
          <Card key={step.number}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="flex justify-center items-center bg-primary rounded-full w-7 h-7 font-bold text-primary-foreground text-sm shrink-0">
                  {step.number}
                </span>
                {step.title}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Email template */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">
          Modelo de e-mail para suporte
        </h4>
        <p className="text-muted-foreground text-sm">
          Use o modelo abaixo ao entrar em contato. Preencha cada seção com as
          informações do seu caso e anexe as capturas de tela coletadas.
        </p>
      </div>

      <div className="relative">
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto font-mono text-muted-foreground text-xs wrap-break-word leading-relaxed whitespace-pre-wrap">
          {EMAIL_TEMPLATE}
        </pre>
        <div className="top-3 right-3 absolute">
          <ClipboardCopyButton
            value={EMAIL_TEMPLATE}
            label="Copiar modelo"
            variant="button"
          />
        </div>
      </div>

      <Separator />

      {/* Response times */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">
          Tempo de resposta estimado
        </h4>
        <p className="text-muted-foreground text-sm">
          Os chamados são atendidos conforme a severidade do problema relatado.
          Inclua no e-mail uma avaliação do impacto para que possamos priorizar
          corretamente.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {RESPONSE_TIMES.map((item) => (
          <div
            key={item.label}
            className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4"
          >
            <Badge variant={item.variant} className="w-fit">
              {item.label}
            </Badge>
            <span className="flex-1 text-muted-foreground text-sm">
              {item.description}
            </span>
            <span className="font-medium text-sm shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
