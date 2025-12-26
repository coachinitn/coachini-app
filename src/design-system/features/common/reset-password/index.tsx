'use client'
import React, { useState } from 'react';
import { Input } from '@/design-system/ui/base/input-custom';
import { SuperButton } from '@/design-system/ui/base/super-button';
import { DisplayMedium, BodyMedium } from '@/design-system/ui/base/Text';
import Link from 'next/link';
import AuthLayout from '../auth-layout';

interface ResetPasswordProps {
  onSubmit?: (newPassword: string, confirmPassword: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const ResetPasswordContent: React.FC<ResetPasswordProps> = ({
  onSubmit,
  isLoading: externalLoading = false,
  error: externalError
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [internalError, setInternalError] = useState('');

  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalLoading;
  // Use external error if provided, otherwise use internal error
  const error = externalError || internalError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalError('');

    try {
      if (newPassword !== confirmPassword) {
        setInternalError('Passwords do not match');
        return;
      }

      if (onSubmit) {
        await onSubmit(newPassword, confirmPassword);
      }
    } catch (err: any) {
      setInternalError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <AuthLayout className='max-w-[502px]'>
      <DisplayMedium className="text-center mb-2">Create New Password</DisplayMedium>
      <BodyMedium className="text-gray-600 text-center mb-8">
        Set a strong password to keep<br />
        your account secure.
      </BodyMedium>

      <div className="flex justify-center items-center flex-col gap-4 py-8 px-[42px] bg-[#FCFBF7] rounded-[10px] shadow-[0px_8px_24px_0px_rgba(112,144,176,0.15)]">
        <form onSubmit={handleSubmit} className="flex justify-start items-start flex-col gap-6 w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
              {error}
            </div>
          )}

          <div className="flex justify-center items-start flex-col gap-6 w-full">
            <div className="flex self-stretch justify-center items-start flex-col gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setInternalError('');
                }}
                fullWidth
                required
                variant="filled"
                floatingLabel={true}
                showPasswordToggle={true}
                containerClassName="mb-0"
                inputHeight="56px"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setInternalError('');
                }}
                fullWidth
                required
                variant="filled"
                floatingLabel={true}
                showPasswordToggle={true}
                containerClassName="mb-0"
                inputHeight="56px"
              />
            </div>

            <SuperButton
              type="submit"
              className="flex self-stretch justify-center items-center flex-row gap-2.5 py-4 px-[32px] bg-[#094BA4] rounded-[10px] shadow-[0px_5px_15px_0px_rgba(37,44,97,0.15),0px_2px_4px_0px_rgba(136,144,194,0.2)]"
              disabled={isLoading}
              variant="action"
              intent="primary"
            >
              <span className="text-[#F8FAFC] font-medium">
                {isLoading ? 'Updating...' : 'Update Password'}
              </span>
            </SuperButton>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-[#5381BF] text-sm text-center font-medium hover:text-blue-800"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordContent; 