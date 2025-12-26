'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { CheckEmail } from "@/design-system/features/common";
import { authQueries } from '@/lib/api/auth';
import { PasswordResetRetry } from '@/core/auth/utils/retry-logic';
import { useAuthError } from '@/core/auth/hooks/useAuthError';

// Loading component for Suspense fallback
function CheckEmailLoading() {
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

// Check Email Page Component
function CheckEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const success = searchParams.get('success');
  const { getErrorMessage, shouldRedirect } = useAuthError();

  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Redirect to login if no email and not a success state
  useEffect(() => {
    if (!email && success !== 'true') {
      router.replace('/auth/login');
    }
  }, [email, success, router]);

  // Mutation for resending password reset email
  const resendMutation = useMutation({
    ...authQueries.resendPasswordReset(),
    onSuccess: () => {
      if (email) {
        PasswordResetRetry.recordAttempt(email);
        updateResendState();
      }
    },
    onError: (error) => {
      console.error('Resend password reset error:', error);

      // Check if error requires redirect
      const redirectInfo = shouldRedirect(error);
      if (redirectInfo.redirect && redirectInfo.path) {
        router.replace(redirectInfo.path);
      }
    }
  });

  // Update resend state based on retry logic
  const updateResendState = () => {
    if (!email) return;

    const canSend = PasswordResetRetry.canSend(email);
    const remainingTime = PasswordResetRetry.getRemainingTime(email);

    setCanResend(canSend);
    setCountdown(Math.ceil(remainingTime / 1000));
  };

  // Update countdown every second
  useEffect(() => {
    updateResendState();

    const interval = setInterval(() => {
      updateResendState();
    }, 1000);

    return () => clearInterval(interval);
  }, [email]);

  const handleResendEmail = async () => {
    if (!email || !canResend) return;

    try {
      await resendMutation.mutateAsync(email);
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to resend email:', error);
    }
  };

  // Show loading while redirecting for invalid states
  if (!email && success !== 'true') {
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
    <CheckEmail
      email={email}
      onResendClick={handleResendEmail}
      isResending={resendMutation.isPending}
      canResend={canResend}
      countdown={countdown}
      error={resendMutation.error ? getErrorMessage(resendMutation.error) : undefined}
    />
  );
}

// Main component with Suspense boundary
export default function CheckEmailPage() {
  return (
    <Suspense fallback={<CheckEmailLoading />}>
      <CheckEmailPageContent />
    </Suspense>
  );
}
