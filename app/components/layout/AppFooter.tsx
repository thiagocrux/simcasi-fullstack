'use client';

import { useEffect, useState } from 'react';

import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import Link from 'next/link';
import { AppDialog } from '../common/AppDialog';
import { GitHubIcon, LinkedInIcon } from '../common/BrandIcons';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

/**
 * Global footer component for the application.
 */
export function AppFooter() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // Avoid hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <footer className="flex xs:flex-row flex-col xs:justify-between items-center gap-2 p-6 text-muted-foreground text-xs text-center">
      <p className="hidden xs:block select-none">v{SYSTEM_CONSTANTS.VERSION}</p>
      <p className="hidden xs:block select-none">
        {SYSTEM_CONSTANTS.COPYRIGHT}
      </p>
      {mounted ? (
        <AppDialog
          isOpen={isAboutModalOpen}
          title={`Sobre o sistema`}
          description={SYSTEM_CONSTANTS.DESCRIPTION}
          customContent={
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm leading-none">
                  Sobre o Desenvolvedor
                </h4>
                <p className="text-muted-foreground text-sm">
                  Sou o Thiago, desenvolvedor fullstack atuando
                  profissionalmente desde 2022. Para mais informações, acesse
                  meu LinkedIn ou GitHub abaixo.
                </p>
              </div>
              <div className="flex gap-4">
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
              <p className="mt-10 text-muted-foreground text-xs">
                {SYSTEM_CONSTANTS.COPYRIGHT}
              </p>
            </div>
          }
        >
          <Button
            variant="link"
            className="hover:bg-transparent! px-0 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
            onClick={() => setIsAboutModalOpen(true)}
          >
            Sobre o sistema
          </Button>
        </AppDialog>
      ) : null}
      <p className="xs:hidden block select-none">v{SYSTEM_CONSTANTS.VERSION}</p>
      <p className="xs:hidden block select-none">
        {SYSTEM_CONSTANTS.COPYRIGHT}
      </p>
    </footer>
  );
}
