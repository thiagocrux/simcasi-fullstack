import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { deletePatient, getPatient } from '@/app/actions/patient.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { ExamsTable } from '@/app/components/features/exams/ExamsTable';
import { NotificationsTable } from '@/app/components/features/notifications/NotificationsTable';
import { ObservationsTable } from '@/app/components/features/observations/ObservationsTable';
import { TreatmentsTable } from '@/app/components/features/treatments/TreatmentsTable';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Patient } from '@/core/domain/entities/patient.entity';
import { ActionResponse } from '@/lib/actions.utils';
import { applyMask, formatDate } from '@/lib/formatters.utils';

export const metadata: Metadata = {
  title: 'Detalhes do paciente | SIMCASI',
  description:
    'Consulte todas as informações detalhadas deste paciente no SIMCASI.',
};

interface PatientDetailsPageProps {
  params: Promise<{ patientId: string }>;
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { patientId } = await params;

  const response: ActionResponse<Patient> = await getPatient(patientId);
  if (!response.success || !response.data) {
    notFound();
  }
  const patient = response.data;

  const data = [
    {
      title: 'Identificação e dados pessoais',
      fields: [
        {
          label: 'Número do cartão do SUS',
          value: patient?.susCardNumber
            ? applyMask(patient?.susCardNumber, 'susCardNumber')
            : '-',
        },
        { label: 'Nome', value: patient?.name || '-' },
        {
          label: 'CPF',
          value: patient?.cpf ? applyMask(patient?.cpf, 'cpf') : '-',
        },
        { label: 'Nome social', value: patient?.socialName || '-' },
        {
          label: 'Data de nascimento',
          value: patient?.birthDate
            ? Intl.DateTimeFormat('pt-BR').format(new Date(patient.birthDate))
            : '-',
        },
        { label: 'Nome da mãe', value: patient?.motherName || '-' },
        { label: 'Nome do pai', value: patient?.fatherName || '-' },
      ],
    },
    {
      title: 'Situação clínica',
      fields: [
        {
          label: 'Tipo de monitoramento',
          value: patient?.monitoringType || '-',
        },
        { label: 'Falecido', value: patient?.isDeceased ? 'Sim' : 'Não' },
      ],
    },
    {
      title: 'Dados demográficos e sociais',
      fields: [
        { label: 'Raça', value: patient?.race || '-' },
        { label: 'Sexo', value: patient?.sex || '-' },
        { label: 'Gênero', value: patient?.gender || '-' },
        { label: 'Sexualidade', value: patient?.sexuality || '-' },
        { label: 'Nacionalidade', value: patient?.nationality || '-' },
        { label: 'Escolaridade', value: patient?.schooling || '-' },
      ],
    },
    {
      title: 'Contato e endereço',
      fields: [
        {
          label: 'Telefone',
          value: patient?.phone ? applyMask(patient?.phone, 'phone') : '-',
        },
        { label: 'E-mail', value: patient?.email || '-' },
        {
          label: 'CEP',
          value: patient?.zipCode
            ? applyMask(patient?.zipCode, 'zipCode')
            : '-',
        },
        { label: 'Estado', value: patient?.state || '-' },
        { label: 'Cidade', value: patient?.city || '-' },
        { label: 'Bairro', value: patient?.neighborhood || '-' },
        { label: 'Rua', value: patient?.street || '-' },
        { label: 'Número da casa', value: patient?.houseNumber || '-' },
        { label: 'Complemento', value: patient?.complement || '-' },
      ],
    },
    {
      title: 'Metadados',
      fields: [
        { label: 'ID', value: patient?.id || '-' },
        {
          label: 'Criado por',
          value: patient?.createdBy || '-',
        },
        {
          label: 'Criado em',
          value: patient?.createdAt
            ? formatDate(new Date(patient.createdAt))
            : '-',
        },
        {
          label: 'Atualizado por',
          value: patient?.updatedBy || '-',
        },
        {
          label: 'Atualizado em',
          value: patient?.updatedAt
            ? formatDate(new Date(patient.updatedAt))
            : '-',
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/patients/${patient?.id}`);
  }

  async function handleDelete() {
    'use server';
    deletePatient(patientId);
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title="Detalhes do paciente"
          description="Aqui você pode visualizar todas as informações completas deste
            paciente, incluindo dados pessoais, clínicos e de contato."
        />
        <Tabs defaultValue="details">
          <TabsList variant="line" className="mx-auto mb-2">
            <TabsTrigger value="details" className="cursor-pointer">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="medical-records" className="cursor-pointer">
              Registros médicos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <DetailsPageActions
              entity="patient"
              dialogTitle="Você tem certeza absoluta?"
              dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente os dados do paciente dos nossos servidores."
              updateAction={{
                label: 'Editar paciente',
                action: handleUpdate,
              }}
              deleteAction={{ label: 'Deletar paciente', action: handleDelete }}
              className="mb-2!"
            />
            <DetailsPageProperties data={data} />
          </TabsContent>
          <TabsContent value="medical-records">
            <Tabs defaultValue="exams" className="w-full">
              <TabsList variant="default" className="mx-auto">
                <TabsTrigger value="exams" className="cursor-pointer">
                  Exames
                </TabsTrigger>
                <TabsTrigger value="notifications" className="cursor-pointer">
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="observations" className="cursor-pointer">
                  Observações
                </TabsTrigger>
                <TabsTrigger value="treatments" className="cursor-pointer">
                  Tratamentos
                </TabsTrigger>
              </TabsList>
              <TabsContent value="exams">
                <ExamsTable patientId={patientId} showIdColumn={false} />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationsTable
                  patientId={patientId}
                  showIdColumn={false}
                />
              </TabsContent>
              <TabsContent value="observations">
                <ObservationsTable patientId={patientId} showIdColumn={false} />
              </TabsContent>
              <TabsContent value="treatments">
                <TreatmentsTable patientId={patientId} showIdColumn={false} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
