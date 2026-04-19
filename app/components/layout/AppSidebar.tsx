'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import {
  BadgeCheck,
  ClipboardPlus,
  Command,
  Contact,
  DoorOpen,
  FileLock,
  Hospital,
  Info,
  LayoutDashboard,
  Mail,
  Settings2,
  SquareActivity,
  Syringe,
  User,
  UserPlus,
} from 'lucide-react';

import { AppSidebarContent } from './AppSidebarContent';
import { AppSidebarUser } from './AppSidebarUser';

import { usePermission } from '@/hooks/usePermission';
import { useUser } from '@/hooks/useUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '../ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

/**
 * Main sidebar component for the application.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { can } = usePermission();
  const { user, isUserAdmin, isHydrated } = useUser();

  const userData = {
    name: user?.name || 'Carregando...',
    email: user?.email || '',
    avatar: '', // TODO: Implement avatar URL in user entity.
  };

  const data = {
    dashboard: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
    medicalRecords: [
      {
        title: 'Pacientes',
        url: '/patients',
        icon: User,
        isActive: false,
        items: [
          {
            title: 'Criar novo paciente',
            url: '/patients/new',
            icon: UserPlus,
          },
        ],
      },
      {
        title: 'Exames',
        url: '/exams',
        icon: Hospital,
      },
      {
        title: 'Notificações',
        url: '/notifications',
        icon: ClipboardPlus,
      },
      {
        title: 'Observações',
        url: '/observations',
        icon: SquareActivity,
      },
      {
        title: 'Tratamentos',
        url: '/treatments',
        icon: Syringe,
      },
    ],
    userManagement: [
      {
        title: 'Usuários',
        url: '/users',
        icon: Contact,
        isActive: false,
        ...(isHydrated && can('create:user')
          ? {
              items: [
                {
                  title: 'Criar novo usuário',
                  url: '/users/new',
                  icon: UserPlus,
                },
              ],
            }
          : {}),
      },
      {
        title: 'Sessões',
        url: '/sessions',
        icon: DoorOpen,
      },
    ],
    audit: [
      {
        title: 'Registros de auditoria',
        url: '/audit-logs',
        icon: FileLock,
      },
    ],
    settings: [
      {
        title: 'Perfil',
        url: `/users/${user?.id}/details`,
        icon: BadgeCheck,
      },
      {
        title: 'Configurações',
        url: '/settings',
        icon: Settings2,
      },
      {
        title: 'Suporte',
        url: '/support',
        icon: Mail,
      },
      {
        title: 'Sobre',
        url: '/about',
        icon: Info,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="/dashboard"
                onClick={() => router.push('/dashboard')}
                className="select-none"
              >
                <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-medium truncate">SIMCASI</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs truncate">
                        Sistema de Monitoramento de Casos de Sífilis
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Sistema de Monitoramento de Casos de Sífilis</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarContent items={data.dashboard} />
        <AppSidebarContent
          label="Registros médicos"
          items={data.medicalRecords}
        />
        <AppSidebarContent
          label="Gestão de usuários"
          items={data.userManagement}
        />
        {isHydrated && isUserAdmin && (
          <AppSidebarContent label="Auditoria" items={data.audit} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={userData} dropdownItems={data.settings} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
