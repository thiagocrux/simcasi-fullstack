'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import {
  ClipboardPlus,
  Command,
  Contact,
  DoorOpen,
  FileLock,
  Hospital,
  KeyRound,
  LayoutDashboard,
  Settings2,
  SquareActivity,
  Syringe,
  User,
  UserPlus,
} from 'lucide-react';

import { AppSidebarContent } from './AppSidebarContent';
import { AppSidebarUser } from './AppSidebarUser';

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

const data = {
  // TODO: Add user data dynamically on sign in; implement with Redux.
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  dashboard: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: false,
    },
  ],
  medicalRecords: [
    {
      title: 'Pacientes',
      url: '/patients',
      icon: User,
      isActive: true,
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
      isActive: false,
    },
    {
      title: 'Notificações',
      url: '/notifications',
      icon: ClipboardPlus,
      isActive: false,
    },
    {
      title: 'Observações',
      url: '/observations',
      icon: SquareActivity,
      isActive: false,
    },
    {
      title: 'Tratamentos',
      url: '/treatments',
      icon: Syringe,
      isActive: false,
    },
  ],
  // TODO: Show section only to users with admin role.
  userManagement: [
    {
      title: 'Usuários',
      url: '/users',
      icon: Contact,
      isActive: false,
      items: [
        {
          title: 'Criar novo usuário',
          url: '/users/new',
          icon: UserPlus,
        },
      ],
    },
    {
      title: 'Permissões',
      url: '/permissions',
      icon: KeyRound,
      isActive: false,
    },
    {
      title: 'Sessões',
      url: '/sessions',
      icon: DoorOpen,
      isActive: false,
    },
  ],
  // TODO: Show section only to users with admin role.
  audit: [
    {
      title: 'Registros de auditoria',
      url: '/audit-logs',
      icon: FileLock,
      isActive: false,
    },
  ],
  settings: [
    {
      title: 'Preferências',
      url: '#',
      icon: Settings2,
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                onClick={() => router.push('/dashboard')}
                className="select-none"
              >
                <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-medium truncate">SIMCASI</span>
                  <span className="text-xs truncate">
                    Sistema de Monitoramento de Casos de Sífilis
                  </span>
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
        <AppSidebarContent label="Auditorias" items={data.audit} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
