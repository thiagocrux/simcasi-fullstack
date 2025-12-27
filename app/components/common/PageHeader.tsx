interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  description = '',
  className = 'flex flex-col gap-2',
}: PageHeaderProps) {
  return (
    <div className={className}>
      <h1 className="font-bold text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
