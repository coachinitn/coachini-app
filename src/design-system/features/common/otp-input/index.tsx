'use client'
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/core/utils/cn';

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onChange,
  autoFocus = false,
  className,
  inputClassName,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [autoFocus]);

  useEffect(() => {
    if (onChange) {
      onChange(code.join(''));
    }

    if (onComplete && code.every(digit => digit !== '')) {
      onComplete(code.join(''));
    }
  }, [code, onChange, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    // Only accept single digit or empty string
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if a digit was entered
    if (value && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }

    // Handle paste event (ctrl+v or cmd+v)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').split('').slice(0, length);
        if (digits.length) {
          const newCode = [...code];
          digits.forEach((digit, i) => {
            if (index + i < length) {
              newCode[index + i] = digit;
            }
          });
          setCode(newCode);

          // Focus on the next empty input or last input
          const focusIndex = Math.min(index + digits.length, length - 1);
          const targetInput = inputRefs.current[focusIndex];
          if (targetInput) {
            targetInput.focus();
          }
        }
      });
    }
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            'h-14 w-12 rounded-md border border-gray-300 text-center text-xl focus:border-blue-700 focus:outline-none',
            inputClassName
          )}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  );
};

export default OTPInput;