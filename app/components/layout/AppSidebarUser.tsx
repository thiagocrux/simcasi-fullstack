'use client';

import { ChevronsUpDown, LogOut, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLogout } from '@/hooks/useLogout';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';

interface AppSidebarUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  dropdownItems: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

/**
 * Sidebar component for rendering user data and account actions.
 */
export function AppSidebarUser({ user, dropdownItems }: AppSidebarUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { handleLogout } = useLogout();

  // Avoid hydration mismatch by only rendering after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {mounted ? user.name.charAt(0).toUpperCase() : ''}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid text-sm text-left leading-tight">
                <span className="font-medium truncate">
                  {mounted ? user.name : 'Carregando...'}
                </span>
                <span className="text-xs truncate">
                  {mounted ? user.email : ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                <Avatar className="rounded-lg w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {mounted ? user.name.charAt(0).toUpperCase() : ''}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-medium truncate">
                    {mounted ? user.name : 'Carregando...'}
                  </span>
                  <span className="text-xs truncate">
                    {mounted ? user.email : ''}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {dropdownItems.map((item) => (
                <DropdownMenuItem
                  key={item.title}
                  onClick={() => router.push(item.url)}
                  className="cursor-pointer"
                >
                  <item.icon />
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="text-destructive" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
