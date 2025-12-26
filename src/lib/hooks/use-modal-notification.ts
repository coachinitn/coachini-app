import { useModal } from '@/core/providers/modal-provider-v2'
import { ConfirmationModal } from '@/design-system/ui/layout/modals/confirmation-modal'
import { AcknowledgmentModal } from '@/design-system/ui/layout/modals/acknowledgment-modal'
import { SuccessModal } from '@/design-system/ui/layout/modals/success-modal'

// Enhanced notification configurations
export interface ConfirmationConfig {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export interface AcknowledgmentConfig {
  title: string
  description?: string
  buttonText?: string
  onAcknowledge?: () => void
  variant?: 'info' | 'warning' | 'error'
}

export interface SuccessConfig {
  title: string
  description?: string
  buttonText?: string
  onAcknowledge?: () => void
  autoClose?: number // milliseconds
}

export function useModalNotification() {
  const { openModal, closeModal } = useModal()

  const showConfirmation = (config: ConfirmationConfig) => {
    return openModal({
      component: ConfirmationModal,
      props: {
        title: config.title,
        description: config.description,
        confirmText: config.confirmText || 'YES',
        cancelText: config.cancelText || 'NO',
        variant: config.variant || 'info',
        onConfirm: config.onConfirm,
        onCancel: config.onCancel || (() => {}),
      },
      options: {
        persistent: true, // Don't close on overlay click for confirmations
        closeOnEsc: false,
      }
    })
  }

  const showAcknowledgment = (config: AcknowledgmentConfig) => {
    return openModal({
      component: AcknowledgmentModal,
      props: {
        title: config.title,
        description: config.description,
        buttonText: config.buttonText || 'Okay',
        variant: config.variant || 'info',
        onAcknowledge: config.onAcknowledge || (() => {}),
      }
    })
  }

  const showSuccess = (config: SuccessConfig) => {
    const modalId = openModal({
      component: SuccessModal,
      props: {
        title: config.title,
        description: config.description,
        buttonText: config.buttonText || 'Okay',
        onAcknowledge: config.onAcknowledge || (() => {}),
      }
    })

    // Auto-close if specified
    if (config.autoClose) {
      setTimeout(() => {
        closeModal(modalId)
        config.onAcknowledge?.()
      }, config.autoClose)
    }

    return modalId
  }

  // Enhanced helpers for common scenarios
  const showDeleteConfirmation = (itemName: string, onConfirm: () => void) => {
    return showConfirmation({
      title: `Delete ${itemName}?`,
      description: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm,
    })
  }

  const showSaveConfirmation = (onConfirm: () => void, onCancel?: () => void) => {
    return showConfirmation({
      title: 'Save changes?',
      description: 'You have unsaved changes. Do you want to save them?',
      confirmText: 'Save',
      cancelText: 'Don\'t Save',
      onConfirm,
      onCancel,
    })
  }

  const showError = (title: string, description?: string) => {
    return showAcknowledgment({
      title,
      description,
      variant: 'error',
    })
  }

  const showQuickSuccess = (title: string, autoCloseMs = 2000) => {
    return showSuccess({
      title,
      autoClose: autoCloseMs,
    })
  }

  return {
    showConfirmation,
    showAcknowledgment,
    showSuccess,
    showDeleteConfirmation,
    showSaveConfirmation,
    showError,
    showQuickSuccess,
    closeModal,
  }
}
