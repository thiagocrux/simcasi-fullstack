import Image from 'next/image';

interface LockSectionProps {
  className?: string;
}

export function LockSection({ className = '' }: LockSectionProps) {
  return (
    <div
      className={`hidden md:flex flex-col justify-center items-center w-full text-center ${className}`}
    >
      <div className="w-60">
        <Image src="/icons/lock.svg" width="500" height="500" alt="" />
      </div>
      <div className="flex flex-col gap-y-4">
        <p className="font-bold text-xl">Segurança em primeiro lugar</p>
        <p className="text-gray-500 text-sm">
          Utilizamos criptografia de ponta para garantir que seus documentos e
          dados escolares estejam sempre protegidos.
        </p>
      </div>
    </div>
  );
}
