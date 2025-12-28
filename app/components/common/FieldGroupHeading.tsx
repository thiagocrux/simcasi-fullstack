import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface FieldGroupHeadingProps {
  text: string;
  className?: string;
}

export function FieldGroupHeading({
  text,
  className = 'flex flex-col gap-2',
}: FieldGroupHeadingProps) {
  return (
    <div className={className}>
      <Label>{text}</Label>
      <Separator />
    </div>
  );
}
