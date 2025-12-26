'use client';

import React from 'react';
import { Input } from '@/design-system/ui/base/input-custom';
import { BusinessDemoRequestFormData } from '@/lib/api/demo/demo-request.types';

interface DemoRequestStep1Props {
  formData: Partial<BusinessDemoRequestFormData>;
  errors: Record<string, string>;
  onChange: (field: keyof BusinessDemoRequestFormData, value: string) => void;
}

export function DemoRequestStep1({
  formData,
  errors,
  onChange,
}: DemoRequestStep1Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* First and Last Name */}
      <div className="space-y-2">
        <Input
          label="First and Last name"
          placeholder="Enter your full name *"
          value={formData.fullName || ''}
          onChange={(e) => onChange('fullName', e.target.value)}
          error={errors.fullName}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Company Email Address */}
      <div className="space-y-2">
        <Input
          label="Company Email Address"
          type="email"
          placeholder="Enter your company email *"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Company Phone Number */}
      <div className="space-y-2">
        <Input
          label="Company Phone Number"
          type="tel"
          placeholder="Enter your phone number *"
          value={formData.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Input
          label="Company Name"
          placeholder="Enter your company name *"
          value={formData.companyName || ''}
          onChange={(e) => onChange('companyName', e.target.value)}
          error={errors.companyName}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
