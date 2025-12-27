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
  KeyRound,
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
    },
    {
      title: 'Sessões',
      url: '/sessions',
      icon: DoorOpen,
    },
  ],
  // TODO: Show section only to users with admin role.
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
      url: '#',
      icon: BadgeCheck,
    },
    {
      title: 'Configurações',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Suporte',
      url: '#',
      icon: Mail,
    },
    {
      title: 'Sobre',
      url: '#',
      icon: Info,
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
        <AppSidebarUser user={data.user} dropdownItems={data.settings} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
