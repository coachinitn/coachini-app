'use client'
import React, { useState } from 'react';
import { Button } from '../button';
import AuthLayout from '../auth-layout';
import OTPInput from '../otp-input';

interface OTPVerificationProps {
  onVerify?: (code: string) => void;
  onResendCode?: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  onVerify,
  onResendCode
}) => {
  const [otpCode, setOtpCode] = useState('');

  const handleVerify = () => {
    if (onVerify && otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Insert code</h1>
        
        <p className="text-gray-600 mb-8">
          We've sent you an authentication code in your email,<br />
          please insert in the provided field.
        </p>
        
        <div className="mb-8">
          <OTPInput 
            length={6}
            onChange={setOtpCode}
            autoFocus
          />
        </div>
        
        <Button onClick={handleVerify} fullWidth disabled={otpCode.length !== 6}>
          Verify
        </Button>
        
        <button 
          onClick={onResendCode}
          className="mt-4 text-blue-700 hover:text-blue-800 text-sm"
        >
          Resend code
        </button>
      </div>
    </AuthLayout>
  );
};

export default OTPVerification; 