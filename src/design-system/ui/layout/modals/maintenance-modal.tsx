"use client"

import React from 'react'
import { AlertTriangle, Wrench, Clock } from 'lucide-react'
import { EnhancedModal, EnhancedModalContent, EnhancedModalTitle, EnhancedModalDescription } from '@/design-system/ui/base/enhanced-modal'
import { SuperButton } from '@/design-system/ui/base/super-button'
import { cn } from '@/core/utils'

export interface MaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  features?: string[]
  estimatedTime?: string
  buttonText?: string
  modalOptions?: {
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    persistent?: boolean
  }
}

/**
 * MaintenanceModal - A modal dialog to inform users about maintenance
 * 
 * Features:
 * - Professional maintenance notification design
 * - Optional list of affected features
 * - Estimated completion time
 * - Customizable content
 * - Integrates with ModalProviderV2
 */
export function MaintenanceModal({
  isOpen,
  onClose,
  title = "Website Under Maintenance",
  description = "We're currently performing scheduled maintenance to improve your experience. Some features may be temporarily unavailable.",
  features,
  estimatedTime,
  buttonText = "I Understand",
  modalOptions,
}: MaintenanceModalProps) {
  return (
    <EnhancedModal 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
      closeOnOverlayClick={modalOptions?.closeOnOverlayClick ?? true}
      closeOnEsc={modalOptions?.closeOnEsc ?? true}
      persistent={modalOptions?.persistent ?? false}
    >
      <EnhancedModalContent className="text-center max-w-lg">
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-100 rounded-full blur-xl opacity-50" />
              <div className="relative bg-amber-50 rounded-full p-4">
                <Wrench className="w-12 h-12 text-amber-600" />
              </div>
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="space-y-3">
            <EnhancedModalTitle className="text-2xl font-semibold text-gray-900">
              {title}
            </EnhancedModalTitle>
            <EnhancedModalDescription className="text-gray-600 text-base leading-relaxed">
              {description}
            </EnhancedModalDescription>
          </div>

          {/* Estimated Time */}
          {estimatedTime && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">
                Estimated completion: {estimatedTime}
              </span>
            </div>
          )}

          {/* Affected Features */}
          {features && features.length > 0 && (
            <div className="text-left space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Affected Features:</span>
              </div>
              <ul className="space-y-2 pl-6">
                {features.map((feature, index) => (
                  <li 
                    key={index}
                    className="text-sm text-gray-600 list-disc"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <SuperButton
              onClick={onClose}
              theme="primary"
              size="lg"
              className="w-full"
            >
              {buttonText}
            </SuperButton>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500">
            Thank you for your patience and understanding.
          </p>
        </div>
      </EnhancedModalContent>
    </EnhancedModal>
  )
}

