'use client';

import React from 'react';
import { Input } from '@/design-system/ui/base/input-custom';
import {
  BusinessDemoRequestFormData,
  COMPANY_SIZE_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
} from '@/lib/api/demo/demo-request.types';

interface DemoRequestStep2Props {
  formData: Partial<BusinessDemoRequestFormData>;
  errors: Record<string, string>;
  onChange: (field: keyof BusinessDemoRequestFormData, value: string) => void;
}

export function DemoRequestStep2({
  formData,
  errors,
  onChange,
}: DemoRequestStep2Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Job Title */}
      <div className="space-y-2">
        <Input
          label="Job Title (E.G. HR Manager, CFO, Etc.)"
          placeholder="Enter your job title *"
          value={formData.jobTitle || ''}
          onChange={(e) => onChange('jobTitle', e.target.value)}
          error={errors.jobTitle}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Company Size */}
      <div className="space-y-2">
        <Input
          type="select"
          label="Company Size"
          placeholder="Company Size *"
          options={COMPANY_SIZE_OPTIONS}
          value={formData.companySize || ''}
          onValueChange={(value) => onChange('companySize', value)}
          error={errors.companySize}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Input
          label="Industry"
          placeholder="e.g., Technology, Healthcare, Finance"
          value={formData.industry || ''}
          onChange={(e) => onChange('industry', e.target.value)}
          error={errors.industry}
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <Input
          type="select"
          label="Business Type"
          placeholder="Entrepreneurial researchers (dropdown) *"
          options={BUSINESS_TYPE_OPTIONS}
          value={formData.businessType || ''}
          onValueChange={(value) => onChange('businessType', value)}
          error={errors.businessType}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Message/Comments */}
      <div className="space-y-2">
        <Input
          label="Message ou commentaires"
          placeholder="Message ou commentaires"
          value={formData.comment || ''}
          onChange={(e) => onChange('comment', e.target.value)}
          error={errors.comment}
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
