'use client';

import { Suspense } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import ForgotPasswordContent from '@/design-system/features/common/forgot-password';
import { authQueries } from '@/lib/api/auth';
import { useAuthError } from '@/core/auth/hooks/useAuthError';


// Loading component for Suspense fallback
function LoginPageLoading() {
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

// Forgot Password Page Component
function ForgotPasswordPageContent() {
  const router = useRouter();
  const { getErrorMessage, shouldRedirect } = useAuthError();

  // Mutation for forgot password
  const forgotPasswordMutation = useMutation({
    ...authQueries.forgotPassword(),
    onSuccess: (_, email) => {
      // Redirect to check-email page with email parameter
      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      console.error('Forgot password error:', error);

      // Check if error requires redirect
      const redirectInfo = shouldRedirect(error);
      if (redirectInfo.redirect && redirectInfo.path) {
        router.push(redirectInfo.path);
      }
    }
  });

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPasswordMutation.mutateAsync(email);
    } catch (error) {
      // Error is already handled by onError callback
      throw new Error(getErrorMessage(error));
    }
  };

  return (
    <ForgotPasswordContent
      onSubmit={handleForgotPassword}
      isLoading={forgotPasswordMutation.isPending}
      error={forgotPasswordMutation.error ? getErrorMessage(forgotPasswordMutation.error) : undefined}
    />
  );
}

// Main component with Suspense boundary
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
