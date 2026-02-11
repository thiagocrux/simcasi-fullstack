/**
 * Global system constants for the application metadata and descriptions.
 * Defines the foundational identity and versioning of the SIMCASI platform.
 */
export const SYSTEM_CONSTANTS = {
  /** Full descriptive name of the system in Portuguese. */
  NAME: 'Sistema de Monitoramento de Casos de Sífilis',
  /** The acronym for the system (Sistema de Monitoramento de Casos de Sífilis). */
  ACRONYM: 'SIMCASI',
  /** Semantic versioning of the current release. */
  VERSION: '1.0.0',
  /** Lead developer and system originator. */
  AUTHOR: 'Thiago Luiz da Cruz Souza',
  /** Comprehensive institutional description of the platform's purpose and capabilities. */
  DESCRIPTION:
    'O SIMCASI (Sistema de Monitoramento de Casos de Sífilis) é um sistema de gestão de casos clínicos projetado para centralizar e otimizar o acompanhamento da sífilis em unidades de saúde. A plataforma permite que profissionais de saúde mantenham registros centralizados de pacientes, acompanhem protocolos de tratamento e exames, documentem observações clínicas, gerenciem permissões de acesso por perfil e mantenham trilhas de auditoria completas para fins de governança e conformidade.',
  /** Standard copyright notice. */
  COPYRIGHT: `© ${new Date().getFullYear()} Thiago Luiz da Cruz Souza. Todos os direitos reservados.`,
  /** Canonical UUID used for system-generated operations. */
  DEFAULT_SYSTEM_USER_ID: '00000000-0000-0000-0000-000000000000',
};
