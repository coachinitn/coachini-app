'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, ArrowLeft } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalTrigger,
  ModalTitle,
} from '@/design-system/ui/base/modal';
import { Button } from '@/design-system/ui/base/button';
import { SuperButton } from '@/design-system/ui/base/super-button';
import { TitleLarge, BodySmall, ButtonLarge } from '@/design-system/ui/base/Text';
import { SuccessCheckIcon } from '@/design-system/icons/common';
import {
  BusinessDemoRequestFormData,
  CoachDemoRequestFormData,
  BusinessType,
  DemoRequestType,
} from '@/lib/api/demo/demo-request.types';
import { demoRequestQueries } from '@/lib/api/demo/demo-requests';
import { useDemoRequestError } from '@/core/demo-request/hooks/useDemoRequestError';
import {
  validateBusinessDemoForm,
  validateCoachDemoForm,
  validateBusinessDemoFormFields,
  validateCoachDemoFormFields
} from '@/lib/api/demo/demo-request.validation';
import { DemoRequestStep1 } from './DemoRequestStep1';
import { DemoRequestStep2 } from './DemoRequestStep2';
import { CoachDemoRequestStep1 } from './CoachDemoRequestStep1';
import { CoachDemoRequestStep2 } from './CoachDemoRequestStep2';
import { DemoRequestRoleSelector } from './DemoRequestRoleSelector';
import { ProgressBar } from './ProgressBar';
import { ScrollableContainer } from '@/design-system/ui/layout/scrollable-container';

interface DemoRequestModalProps {
  children: React.ReactNode;
  requestType?: DemoRequestType;
  showRoleSelector?: boolean;
}

export function DemoRequestModal({
  children,
  requestType = DemoRequestType.BUSINESS,
  showRoleSelector = false,
}: DemoRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRequestType, setSelectedRequestType] = useState<DemoRequestType>(requestType);
  const [showRoleSelectorModal, setShowRoleSelectorModal] = useState(false);
  const [businessFormData, setBusinessFormData] = useState<Partial<BusinessDemoRequestFormData>>({
    businessType: BusinessType.BUSINESS,
  });
  const [coachFormData, setCoachFormData] = useState<Partial<CoachDemoRequestFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo request error handling hook
  const {
    getErrorMessage,
    getSuccessMessage,
    shouldRetry,
    isValidationError,
    isFileUploadError,
    getErrorSuggestion,
    isPartialSuccess
  } = useDemoRequestError();

  // Reset form when modal opens/closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && showRoleSelector) {
      setShowRoleSelectorModal(true);
    } else if (!open) {
      setCurrentStep(1);
      if (requestType === DemoRequestType.BUSINESS) {
        setBusinessFormData({ businessType: BusinessType.BUSINESS });
        setCoachFormData({});
      } else {
        setCoachFormData({});
        setBusinessFormData({});
      }
      setErrors({});
      setShowRoleSelectorModal(false);
      setSelectedRequestType(requestType);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: DemoRequestType) => {
    setSelectedRequestType(role);
    setShowRoleSelectorModal(false);
    setCurrentStep(1);
    // Reset form data based on selected role
    if (role === DemoRequestType.BUSINESS) {
      setBusinessFormData({ businessType: BusinessType.BUSINESS });
      setCoachFormData({});
    } else {
      setCoachFormData({});
      setBusinessFormData({});
    }
    setErrors({});
  };

  // Handle role selector close
  const handleRoleSelectorClose = () => {
    setShowRoleSelectorModal(false);
    setIsOpen(false);
  };

  // Form submission mutations
  const businessSubmitMutation = useMutation({
    ...demoRequestQueries.submitBusinessDemo(),
    onSuccess: (data) => {
      // Show success state
      setCurrentStep(3);
      // Clear any previous errors
      setErrors({});
    },
    onError: (error: any) => {
      handleSubmissionError(error);
    },
  });

  const coachSubmitMutation = useMutation({
    ...demoRequestQueries.submitCoachDemo(),
    onSuccess: () => {
      // Show success state
      setCurrentStep(3);
      // Clear any previous errors
      setErrors({});
    },
    onError: (error: any) => {
      console.error('Coach demo request submission failed:', error);
      handleSubmissionError(error);
    },
  });

  const handleSubmissionError = (error: any) => {

    // Use the new error handling system
    const translatedErrorMessage = getErrorMessage(error);
    const suggestion = getErrorSuggestion(error);
    const isValidation = isValidationError(error);
    const isFileError = isFileUploadError(error);
    const retryInfo = shouldRetry(error);
    const partialSuccess = isPartialSuccess(error);

    // Handle validation errors (field-specific)
    if (isValidation && error.details?.field) {
      setErrors({ [error.details.field]: translatedErrorMessage });
      return;
    }

    // Handle file upload errors
    if (isFileError) {
      setErrors({ 
        resumeFilePath: translatedErrorMessage,
        submit: suggestion || 'Please check your file and try again.'
      });
      return;
    }

    // Handle partial success (request saved but email failed)
    if (partialSuccess) {
      setErrors({ 
        submit: `${translatedErrorMessage}. ${suggestion || 'Your request was saved successfully.'}`
      });
      return;
    }

    // Handle duplicate requests
    if (translatedErrorMessage.includes('duplicate') || translatedErrorMessage.includes('already exists')) {
      setErrors({ 
        email: translatedErrorMessage,
        submit: suggestion || 'Please use a different email address.'
      });
      return;
    }

    // Handle rate limiting
    if (retryInfo.retry) {
      const retryMessage = retryInfo.retryAfter 
        ? `${translatedErrorMessage}. Please wait ${Math.ceil(retryInfo.retryAfter / 60)} minutes before trying again.`
        : `${translatedErrorMessage}. Please try again later.`;
      
      setErrors({ 
        submit: retryMessage
      });
      return;
    }

    // Default error handling
    setErrors({ 
      submit: suggestion 
        ? `${translatedErrorMessage}. ${suggestion}`
        : translatedErrorMessage || 'Failed to submit demo request. Please try again.'
    });
  };

  const handleBusinessInputChange = (field: keyof BusinessDemoRequestFormData, value: string) => {
    setBusinessFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCoachInputChange = (field: keyof CoachDemoRequestFormData, value: string | number) => {
    setCoachFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (selectedRequestType === DemoRequestType.BUSINESS) {
      const validation = validateBusinessDemoForm(businessFormData);

      if (currentStep === 1) {
        // Validate step 1 fields for business
        const step1Fields = ['fullName', 'email', 'phone', 'companyName'];
        const step1Errors: Record<string, string> = {};

        step1Fields.forEach(field => {
          if (validation.errors[field]) {
            step1Errors[field] = validation.errors[field];
          }
        });

        if (Object.keys(step1Errors).length > 0) {
          setErrors(step1Errors);
          return;
        }

        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Validate step 2 fields for business
        const step2Fields = ['jobTitle', 'companySize', 'businessType'];
        const step2Errors: Record<string, string> = {};

        step2Fields.forEach(field => {
          if (validation.errors[field]) {
            step2Errors[field] = validation.errors[field];
          }
        });

        if (Object.keys(step2Errors).length > 0) {
          setErrors(step2Errors);
          return;
        }
        
        businessSubmitMutation.mutate(businessFormData as BusinessDemoRequestFormData);
      }
    } else if (selectedRequestType === DemoRequestType.COACH) {
      const validation = validateCoachDemoForm(coachFormData);

      if (currentStep === 1) {
        // Validate step 1 fields for coach
        const step1Fields = ['fullName', 'email', 'phone'];
        const step1Errors: Record<string, string> = {};

        step1Fields.forEach(field => {
          if (validation.errors[field]) {
            step1Errors[field] = validation.errors[field];
          }
        });

        if (Object.keys(step1Errors).length > 0) {
          setErrors(step1Errors);
          return;
        }

        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Validate step 2 fields for coach
        const step2Fields = ['yearsOfExperience', 'areaOfExpertise', 'resumeFilePath'];
        const step2Errors: Record<string, string> = {};

        step2Fields.forEach(field => {
          if (validation.errors[field]) {
            step2Errors[field] = validation.errors[field];
          }
        });

        if (Object.keys(step2Errors).length > 0) {
          setErrors(step2Errors);
          return;
        }

        // Submit coach form
        coachSubmitMutation.mutate(coachFormData as CoachDemoRequestFormData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 1 && showRoleSelector) {
      // Go back to role selector from step 1
      setShowRoleSelectorModal(true);
      setCurrentStep(1); // Reset to step 1 for when user comes back
      // Clear any form data and errors
      setBusinessFormData({ businessType: BusinessType.BUSINESS });
      setCoachFormData({});
      setErrors({});
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };



  const renderContent = () => {
    if (currentStep === 1) {
      if (selectedRequestType === DemoRequestType.BUSINESS) {
        return (
          <DemoRequestStep1
            formData={businessFormData}
            errors={errors}
            onChange={handleBusinessInputChange}
          />
        );
      } else {
        return (
          <CoachDemoRequestStep1
            formData={coachFormData}
            errors={errors}
            onChange={handleCoachInputChange}
          />
        );
      }
    } else if (currentStep === 2) {
      if (selectedRequestType === DemoRequestType.BUSINESS) {
        return (
          <DemoRequestStep2
            formData={businessFormData}
            errors={errors}
            onChange={handleBusinessInputChange}
          />
        );
      } else {
        return (
          <CoachDemoRequestStep2
            formData={coachFormData}
            errors={errors}
            onChange={handleCoachInputChange}
          />
        );
      }
    } else {
      // Success step - new design
      const successMessageKey = selectedRequestType === DemoRequestType.BUSINESS 
        ? 'businessRequestSubmitted' 
        : 'coachRequestSubmitted';
      
      const successMessage = getSuccessMessage(successMessageKey);
      
      const handleBackHome = () => {
        // Close modal and refresh the page to go back to home
        setIsOpen(false);
      };
      
      return (
          <div className='flex items-center justify-center px-4 py-8'>
              <div className='w-full max-w-[365px] flex flex-col items-stretch font-medium space-y-[32px]'>
                  {/* Success Check Icon */}
                  <div className='flex justify-center'>
                      <SuccessCheckIcon className='w-20 h-20 sm:w-[108px] sm:h-[108px]' />
                  </div>

                  {/* Main Content Container */}
                  <div className='flex flex-col items-center justify-start overflow-hidden space-y-[32px]'>
                      {/* Main Text Content */}
                      <div className='text-center space-y-5'>
                          <TitleLarge className='font-bold'>Thank You for Reaching Out!</TitleLarge>

                          <BodySmall>
                              {successMessage ||
                                  "We've received your request! Our team will contact you soon to schedule a meeting and discuss how Coachini can support your business goals."}
                          </BodySmall>
                      </div>

                      {/* Button */}
                      <div className='flex'>
                          <SuperButton onClick={handleBackHome} variant='action' theme='primary' size='md'>
                              <ButtonLarge>Back Home</ButtonLarge>
                          </SuperButton>
                      </div>
                  </div>
              </div>
          </div>
      );
    }
  };

  return (
      <>
          {/* Role Selector Modal */}
          <DemoRequestRoleSelector
              isOpen={showRoleSelectorModal}
              onClose={handleRoleSelectorClose}
              onSelectRole={handleRoleSelect}
          />

          {/* Main Demo Request Modal */}
          <Modal open={isOpen && !showRoleSelectorModal} onOpenChange={handleOpenChange}>
              <ModalTrigger asChild>{children}</ModalTrigger>
              <ModalContent className='max-w-4xl w-full max-h-[100vh] sm:max-h-[90vh] overflow-y-auto mt-auto sm:mt-0 sm:m-4'>
                  {/* Accessibility Title - Hidden but required */}
                  <ModalTitle className='sr-only'>Schedule a demo today</ModalTitle>

                  {/* Close Button */}
                  <button
                      onClick={handleClose}
                      className="absolute top-4 sm:top-8 right-4 sm:right-8 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                  >
                      <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </button>

                  {/* Back Button */}
                  {((currentStep > 1 && currentStep < 3) || (currentStep === 1 && showRoleSelector)) && (
                      <button
                          onClick={handleBack}
                          className="absolute top-4 sm:top-8 left-4 sm:left-8 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                      >
                          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </button>
                  )}


                  <div className="p-4 sm:p-8 lg:p-12 pt-16 sm:pt-8 lg:pt-12">
                      {/* Progress Indicator */}
                      {currentStep < 3 && <ProgressBar currentStep={currentStep} totalSteps={2} />}

                      {/* Form Content */}
                      <div className="max-w-lg mx-auto">
                          {/* Header - Only show during form steps, not success */}
                          {currentStep < 3 && (
                              <div className="text-center mb-6 sm:mb-8">
                                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                      Schedule a demo today
                                  </h2>
                                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                                      Discover how Coachini platform empowers your workforce through personalized coaching solutions.
                                  </p>
                              </div>
                          )}

                          {/* Form */}
                          <form noValidate onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6 sm:space-y-8">
                              {renderContent()}

                              {/* Action Buttons */}
                              {currentStep < 3 && (
                                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 pb-4 sm:pb-0">
                                      {currentStep > 1 && (
                                          <SuperButton
                                              type="button"
                                              onClick={handleBack}
                                              variant="action"
                                              theme="outline"
                                              size="lg"
                                              className="w-full sm:flex-1 text-sm sm:text-base"
                                          >
                                              Back
                                          </SuperButton>
                                      )}
                                      <SuperButton
                                          type="submit"
                                          variant="action"
                                          theme="primary"
                                          size="lg"
                                          className="w-full sm:flex-1 text-sm sm:text-base"
                                          disabled={
                                              selectedRequestType === DemoRequestType.BUSINESS
                                                  ? businessSubmitMutation.isPending
                                                  : coachSubmitMutation.isPending
                                          }
                                          isLoading={
                                              selectedRequestType === DemoRequestType.BUSINESS
                                                  ? businessSubmitMutation.isPending
                                                  : coachSubmitMutation.isPending
                                          }
                                          loadingText={currentStep === 2 ? 'Submitting...' : undefined}
                                      >
                                          {currentStep === 1 ? 'Next' : 'Submit'}
                                      </SuperButton>
                                  </div>
                              )}

                              {errors.submit && (
                                  <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-md'>
                                      <p className='text-red-600 text-sm text-center'>{errors.submit}</p>
                                  </div>
                              )}
                          </form>
                      </div>
                  </div>
              </ModalContent>
          </Modal>
      </>
  );
}
