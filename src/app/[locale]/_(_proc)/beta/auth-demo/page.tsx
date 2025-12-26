'use client';

import React, { useState } from 'react';
import { ForgotPassword, CheckEmail, OTPVerification, ResetPassword, Error404 } from '@/design-system/features/common';

type AuthState = 'login' | 'forgot-password' | 'check-email' | 'otp-verification' | 'reset-password' | 'error-404';

export default function AuthDemoPage() {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [email, setEmail] = useState('');

  const handleLoginSubmit = (email: string, password: string, rememberMe: boolean) => {
    console.log('Login:', { email, password, rememberMe });
    // In a real app, you would call your auth service here
  };

  const handleForgotPassword = async (email: string) => {
    console.log('Forgot password:', email);
    setEmail(email);
    setAuthState('check-email');
  };

  const handleResendEmail = () => {
    console.log('Resending email to:', email);
    // In a real app, you would call your API to resend the email
  };

  const handleVerifyOTP = (code: string) => {
    console.log('Verifying OTP:', code);
    setAuthState('reset-password');
  };

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    console.log('Reset password:', { newPassword, confirmPassword });
    // In a real app, you would call your API to reset the password
    setAuthState('login');
  };

  const renderAuthComponent = () => {
    switch (authState) {
      case 'login':
        return <ResetPassword onSubmit={handleResetPassword} />;
      case 'forgot-password':
        return <ForgotPassword onSubmit={handleForgotPassword} />;
      case 'check-email':
        return <CheckEmail email={email} onResendClick={handleResendEmail} />;
      case 'otp-verification':
        return <OTPVerification onVerify={handleVerifyOTP} onResendCode={handleResendEmail} />;
      case 'reset-password':
        return <ResetPassword onSubmit={handleResetPassword} />;
      case 'error-404':
        return <Error404 onBackToHome={() => setAuthState('login')} />;
      default:
        return <ResetPassword onSubmit={handleResetPassword} />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setAuthState('login')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Login
        </button>
        <button
          onClick={() => setAuthState('forgot-password')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Forgot Password
        </button>
        <button
          onClick={() => setAuthState('check-email')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Check Email
        </button>
        <button
          onClick={() => setAuthState('otp-verification')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          OTP Verification
        </button>
        <button
          onClick={() => setAuthState('reset-password')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Reset Password
        </button>
        <button
          onClick={() => setAuthState('error-404')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          404 Error
        </button>
      </div>

      {renderAuthComponent()}
    </div>
  );
} 