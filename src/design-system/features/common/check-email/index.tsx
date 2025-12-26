'use client'
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SuperButton } from '@/design-system/ui/base/super-button';
import { TitleLarge, BodyMedium, ButtonMedium } from '@/design-system/ui/base/Text';
import AuthLayout from '../auth-layout';
import Image from 'next/image';

interface CheckEmailProps {
  email?: string | null; // Optional, will fallback to URL params
  onResendClick?: () => void;
  isPasswordResetSuccess?: boolean;
  onBackToLogin?: () => void;
  isResending?: boolean;
  canResend?: boolean;
  countdown?: number;
  error?: string;
}

export const CheckEmail: React.FC<CheckEmailProps> = ({
  email: propEmail,
  onResendClick,
  isPasswordResetSuccess = false,
  onBackToLogin,
  isResending = false,
  canResend = true,
  countdown = 0,
  error
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get email from props or URL params
  const email = propEmail || searchParams.get('email');
  
  // Get success state from URL params if not provided as prop
  const isSuccess = isPasswordResetSuccess || searchParams.get('success') === 'true';

  // Redirect to home if no email is provided (unless it's a success state)
  useEffect(() => {
    if (!email && !isSuccess) {
      router.push('/');
    }
  }, [email, isSuccess, router]);

  // Don't render anything while redirecting
  if (!email && !isSuccess) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!canResend || isResending) return;

    if (onResendClick) {
      onResendClick();
    } else {
      // Default resend logic - could call API here
      console.log('Resending email to:', email);
    }
  };

  // Format countdown display
  const getCountdownDisplay = () => {
    if (countdown <= 0) return '';

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      // Default navigation - you might want to use router here
      router.push('/auth/login');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[486px] h-auto relative mx-auto">
        {/* Main Content Card */}
        <div className="w-full flex justify-start items-center flex-col gap-[38px] pt-[80px] pb-[48px] px-[20px] sm:px-[55px] bg-[#FCFBF7] rounded-[10px] shadow-[0px_18px_40px_0px_rgba(112,144,176,0.12)] mt-[77px]">
          {/* Text Content */}
          <div className="text-center">
            <TitleLarge className="text-[#090203] mb-4">
              {isSuccess ? "Password Reset Complete!" : "Check Your Email"}
            </TitleLarge>
            
            <BodyMedium className="text-[#090203]">
              {isSuccess ? (
                "Your password has been successfully reset. You can now log in with your new password."
              ) : (
                <>
                  Please check the email address{" "}
                  <span className="font-semibold">{email}</span>{" "}
                  for instructions to reset your password.
                </>
              )}
            </BodyMedium>

            {/* Error Message */}
            {error && !isSuccess && (
              <BodyMedium className="text-red-600 mt-2">
                {error}
              </BodyMedium>
            )}

            {/* Countdown Message */}
            {!isSuccess && countdown > 0 && (
              <BodyMedium className="text-gray-600 mt-2">
                You can resend the email in {getCountdownDisplay()}
              </BodyMedium>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full max-w-[185px]">
            <SuperButton
              onClick={isSuccess ? handleBackToLogin : handleResendEmail}
              disabled={!isSuccess && (!canResend || isResending)}
              className={`w-full h-[48px] flex justify-center items-center flex-row gap-[9px] p-[3px] bg-[#FCFBF7] border-solid border-[#090203] border rounded-xl shadow-[0px_5px_15px_0px_rgba(37,44,97,0.15),0px_2px_4px_0px_rgba(136,144,194,0.2)] ${
                !isSuccess && (!canResend || isResending) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              variant="action"
              intent="secondary"
            >
              <ButtonMedium className="text-[#090203] text-center font-medium">
                {isSuccess
                  ? "Back to Login"
                  : isResending
                    ? "Sending..."
                    : !canResend
                      ? `Resend Email (${getCountdownDisplay()})`
                      : "Resend Email"
                }
              </ButtonMedium>
            </SuperButton>
          </div>
        </div>

        {/* Top Icon/Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[-50px] w-[108px] h-[108px]">
          <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
            <Image
              src="/icons/notifs/success.svg"
              alt={isSuccess ? "Password reset successful" : "Email sent"}
              width={108}
              height={108}
              className="pointer-events-none"
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CheckEmail; 