'use client';

import React from 'react';
import { Input } from '@/design-system/ui/base/input-custom';
import { CoachDemoRequestFormData } from '@/lib/api/demo/demo-request.types';

interface CoachDemoRequestStep1Props {
  formData: Partial<CoachDemoRequestFormData>;
  errors: Record<string, string>;
  onChange: (field: keyof CoachDemoRequestFormData, value: string | number) => void;
}

export function CoachDemoRequestStep1({
  formData,
  errors,
  onChange,
}: CoachDemoRequestStep1Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Full Name */}
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

      {/* Email Address */}
      <div className="space-y-2">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address *"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          error={errors.email}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Input
          label="Phone Number"
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

      {/* LinkedIn Profile */}
      <div className="space-y-2">
        <Input
          label="Link To LinkedIn Profile"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedinProfile || ''}
          onChange={(e) => onChange('linkedinProfile', e.target.value)}
          error={errors.linkedinProfile}
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Portfolio Website */}
      <div className="space-y-2">
        <Input
          label="Link To Portfolio Or Website"
          type="url"
          placeholder="https://yourwebsite.com"
          value={formData.portfolioWebsite || ''}
          onChange={(e) => onChange('portfolioWebsite', e.target.value)}
          error={errors.portfolioWebsite}
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
