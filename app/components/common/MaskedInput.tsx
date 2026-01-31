/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { forwardRef } from 'react';
import { useMaskInput, withMask } from 'use-mask-input';

import { Input } from '@/app/components/ui/input';
import { MaskType } from '@/lib/formatters.utils';

interface MaskedInputProps {
  value: string;
  onValueChange: (value: string) => void;
  variant: MaskType;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

/**
 * DYNAMIC_VARIANTS defines which mask variants are handled dynamically using a hook (e.g., phone numbers with variable formats).
 * Variants not included here are handled statically with a fixed mask pattern.
 */
const DYNAMIC_VARIANTS: MaskType[] = ['phone'];

/**
 * Input component with support for dynamic and static masks.
 *
 * @param {MaskedInputProps} props The props for the MaskedInput component.
 * @param {React.Ref<HTMLInputElement>} ref The forwarded ref for the input element.
 * @returns {JSX.Element} The masked input element.
 */
export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      value,
      onValueChange,
      variant,
      placeholder = '',
      disabled = false,
      hasError = false,
      ...props
    },
    ref
  ) => {
    /**
     * Dynamic masks use hooks to handle input masking that may change based on input length or content.
     */
    const dynamicMasks: Record<MaskType, any> = {
      susCardNumber: '',
      cpf: '',
      zipCode: '',
      phone: useMaskInput({
        mask: function () {
          return ['(99) 9999-9999', '(99) 99999-9999'];
        } as any,
        options: {
          showMaskOnHover: false,
        },
      }),
    };

    /**
     * Static masks use a fixed pattern for input masking.
     */
    const staticMasks: Record<MaskType, string> = {
      susCardNumber: '999 9999 9999 9999',
      cpf: '999.999.999-99',
      zipCode: '99999-999',
      phone: '',
    };

    /**
     * Removes all special characters and spaces from the input value.
     *
     * @param {string} value The input value to be sanitized.
     * @returns {string} The sanitized string without special characters and spaces.
     */
    function removeSpecialCharsAndSpaces(value: string): string {
      return value.replace(/[^a-zA-Z0-9]/g, '');
    }

    /**
     * The maskRef is used for static masks to apply the mask pattern to the input element.
     */
    const maskRef = withMask(staticMasks[variant], {
      placeholder: '_',
      showMaskOnHover: false,
    });

    return (
      <Input
        ref={
          DYNAMIC_VARIANTS.includes(variant)
            ? dynamicMasks[variant]
            : (node) => {
                // 1. Pass the ref to the mask hook (expects a callback ref).
                maskRef(node);

                // 2. Pass the ref to the parent (e.g., react-hook-form).
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }
        }
        value={value}
        onChange={(event) => {
          // Always sanitize the value before passing it to the parent handler.
          const cleanValue = removeSpecialCharsAndSpaces(event.target.value);
          onValueChange(cleanValue);
        }}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';
