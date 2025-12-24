'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';

interface PasswordInputProps extends React.ComponentProps<'input'> {
  suffix?: React.ReactNode;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <InputGroup className={className}>
      <InputGroupInput type={showPassword ? 'text' : 'password'} {...props} />
      <InputGroupAddon
        align="inline-end"
        onClick={() => setShowPassword((prevState) => !prevState)}
        className="cursor-pointer"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="hover:bg-transparent! -mr-0.5 rounded-sm h-6.75 cursor-pointer"
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
