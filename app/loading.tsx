import { Spinner } from './components/ui/spinner';

export default function GlobalLoading() {
  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="w-10 h-10 text-primary" />
        <p className="font-medium text-muted-foreground text-sm animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
