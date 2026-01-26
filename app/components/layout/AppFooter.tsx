'use client';

import { useEffect, useState } from 'react';

import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import Link from 'next/link';
import { AppDialog } from '../common/AppDialog';
import { GitHubIcon, LinkedInIcon } from '../common/BrandIcons';
import { Separator } from '../ui/separator';

/**
 * Global footer component for the application.
 */
export function AppFooter() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <footer className="flex justify-between p-6 text-muted-foreground text-xs">
      <p>Versão {SYSTEM_CONSTANTS.VERSION}</p>
      <p>{SYSTEM_CONSTANTS.COPYRIGHT}</p>
      {isMounted ? (
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
          <p
            className="hover:text-foreground text-xs cursor-pointer"
            onClick={() => setIsAboutModalOpen(true)}
          >
            Sobre o sistema
          </p>
        </AppDialog>
      ) : (
        <p className="text-xs">Sobre o sistema</p>
      )}
    </footer>
  );
}
