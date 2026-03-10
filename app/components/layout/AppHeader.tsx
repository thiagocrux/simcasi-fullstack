'use client';

import { LogOut } from 'lucide-react';

import { useLogout } from '@/hooks/useLogout';
import { cn } from '@/lib/shared.utils';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';

interface AppHeaderProps {
  /**
   * Defines the header style and behavior.
   * - 'private': Full dashboard header with breadcrumbs and logout.
   * - 'public': Minimal floating header with theme switcher.
   */
  variant?: 'private' | 'public';
}

/**
 * Global header component for the application.
 */
export function AppHeader({ variant = 'private' }: AppHeaderProps) {
  const { handleLogout } = useLogout();

  if (variant === 'public') {
    return (
      <div className="top-4 right-4 z-50 absolute flex items-center gap-x-2">
        <ThemeSwitcher />
      </div>
    );
  }

  // Only use sidebar context in private variant
  const { open, isMobile } = useSidebar();

  // Dynamic positioning based on sidebar state
  const positionClass = isMobile ? 'left-0' : open ? 'left-64' : 'left-12';

  return (
    <header
      className={cn(
        'top-0 right-0 z-40 fixed flex justify-between items-center gap-2 bg-background p-4 border-b transition-all duration-300 shrink-0',
        positionClass
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Button
          size="sm"
          variant="outline"
          onClick={handleLogout}
          className="text-muted-foreground cursor-pointer"
          title="Sair do sistema"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
