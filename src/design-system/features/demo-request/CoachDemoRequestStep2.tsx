'use client';

import React from 'react';
import { Input } from '@/design-system/ui/base/input-custom';
import { CoachDemoRequestFormData } from '@/lib/api/demo/demo-request.types';

interface CoachDemoRequestStep2Props {
  formData: Partial<CoachDemoRequestFormData>;
  errors: Record<string, string>;
  onChange: (field: keyof CoachDemoRequestFormData, value: string | number) => void;
}

const YEARS_OF_EXPERIENCE_OPTIONS = [
  { value: '0', label: 'Less than 1 year' },
  { value: '1', label: '1-2 years' },
  { value: '3', label: '3-5 years' },
  { value: '6', label: '6-10 years' },
  { value: '11', label: '11-15 years' },
  { value: '16', label: '16+ years' },
];

const AREA_OF_EXPERTISE_OPTIONS = [
  { value: 'Leadership Development', label: 'Leadership Development' },
  { value: 'Executive Coaching', label: 'Executive Coaching' },
  { value: 'Career Coaching', label: 'Career Coaching' },
  { value: 'Life Coaching', label: 'Life Coaching' },
  { value: 'Business Coaching', label: 'Business Coaching' },
  { value: 'Performance Coaching', label: 'Performance Coaching' },
  { value: 'Team Coaching', label: 'Team Coaching' },
  { value: 'Communication Skills', label: 'Communication Skills' },
  { value: 'Emotional Intelligence', label: 'Emotional Intelligence' },
  { value: 'Other', label: 'Other' },
];

export function CoachDemoRequestStep2({
  formData,
  errors,
  onChange,
}: CoachDemoRequestStep2Props) {
  const isOtherExpertise = formData.areaOfExpertise === 'Other';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Years of Coaching Experience */}
      <div className="space-y-2">
        <Input
          type="select"
          label="Years Of Coaching Experience"
          placeholder="Years Of Coaching Experience *"
          options={YEARS_OF_EXPERIENCE_OPTIONS}
          value={formData.yearsOfExperience?.toString() || ''}
          onValueChange={(value) => onChange('yearsOfExperience', parseInt(value) || 0)}
          error={errors.yearsOfExperience}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Area of Expertise */}
      <div className="space-y-2">
        <Input
          type="select"
          label="Area Of Expertise"
          placeholder="Area Of Expertise *"
          options={AREA_OF_EXPERTISE_OPTIONS}
          value={formData.areaOfExpertise || ''}
          onValueChange={(value) => onChange('areaOfExpertise', value)}
          error={errors.areaOfExpertise}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Custom Area of Expertise - shown when Other is selected */}
      {/* {isOtherExpertise && (
        <div className="space-y-2">
          <Input
            label="Please Specify Your Area of Expertise"
            placeholder="Describe your specific area of expertise *"
            value={formData.areaOfExpertise === 'Other' ? '' : formData.areaOfExpertise || ''}
            onChange={(e) => {
              const customValue = e.target.value.trim();
              // Store the custom expertise, but ensure it's at least 5 characters
              onChange('areaOfExpertise', customValue || 'Other');
            }}
            error={errors.areaOfExpertise}
            required
            floatingLabel
            variant="filled"
            className="text-sm sm:text-base"
          />
        </div>
      )} */}

      {/* Upload Resume/CV */}
      <div className="space-y-2">
        <Input
          type="file"
          label="Upload Resume/CV"
          placeholder="Upload Resume/CV *"
          helperText="Upload your latest professional CV *"
          value={formData.resumeFilePath || ''}
          fileConfig={{
            accept: '.pdf,.doc,.docx',
            multiple: false,
            dragAndDrop: true,
            showFilePreview: true,
          }}
          onFileSelect={(files) => {
            const file = files?.[0];
            if (file) {
              console.log('File selected:', file.name);
              onChange('resumeFilePath', file.name);
            } else {
              console.log('No file selected');
              onChange('resumeFilePath', '');
            }
          }}
          error={errors.resumeFilePath}
          required
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Upload Your Certifications */}
      <div className="space-y-2">
        <Input
          type="file"
          label="Upload Your Certifications"
          placeholder="Upload Your Certifications"
          helperText="Add certifications showcasing your expertise *"
          fileConfig={{
            accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
            multiple: true,
            dragAndDrop: true,
            showFilePreview: true,
            showLoadingState: true,
          }}
          onFileSelect={(files) => {
            if (files && files.length > 0) {
              const fileArray = Array.from(files);
              const fileNames = fileArray.map(f => f.name).join(', ');
              // onChange('comment', `Certifications: ${fileNames}`);
            }
          }}
          floatingLabel
          variant="filled"
          className="text-sm sm:text-base"
        />
      </div>

      {/* Why Do You Want To Join Coachini */}
      <div className="space-y-2">
        <Input
          label="Why Do You Want To Join Coachini"
          placeholder="Why Do You Want To Join Coachini?"
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
