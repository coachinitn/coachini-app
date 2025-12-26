'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import ResetPasswordContent from '@/design-system/features/common/reset-password';
import { authQueries, authValidation } from '@/lib/api/auth';
import { useAuthError } from '@/core/auth/hooks/useAuthError';


// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}



// Reset Password Page Component
function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { getErrorMessage, shouldRedirect } = useAuthError();

  // Validate token
  const isValidToken = authValidation.validateResetToken(token);

  // Redirect to login if no token or invalid token
  useEffect(() => {
    if (!token || !isValidToken) {
      router.replace('/auth/login');
    }
  }, [token, isValidToken, router]);

  // Mutation for reset password
  const resetPasswordMutation = useMutation({
    ...authQueries.resetPassword(),
    onSuccess: () => {
      // Redirect to check-email with success state
      router.push('/auth/check-email?success=true');
    },
    onError: (error) => {
      console.error('Reset password error:', error);

      // Check if error requires redirect
      const redirectInfo = shouldRedirect(error);
      if (redirectInfo.redirect && redirectInfo.path) {
        router.push(redirectInfo.path);
      }
    }
  });

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    if (!token || !isValidToken) {
      throw new Error('Invalid reset token');
    }

    // Validate password
    const passwordValidation = authValidation.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password,
        confirmPassword
      });
    } catch (error) {
      // Error is already handled by onError callback
      throw new Error(getErrorMessage(error));
    }
  };

  // Show loading while redirecting for invalid tokens
  if (!token || !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResetPasswordContent
      onSubmit={handleResetPassword}
      isLoading={resetPasswordMutation.isPending}
      error={resetPasswordMutation.error ? getErrorMessage(resetPasswordMutation.error) : undefined}
    />
  );
}

// Main component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
