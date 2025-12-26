
"use client"

import { AcknowledgmentModal } from "@/design-system/ui/layout/modals/acknowledgment-modal"
import { ConfirmationModal } from "@/design-system/ui/layout/modals/confirmation-modal"
import { SuccessModal } from "@/design-system/ui/layout/modals/success-modal"
import { useNotifications } from "@/lib/hooks/use-notifications"



interface ModalProviderProps {
  children: React.ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const {
    confirmationModal,
    acknowledgmentModal,
    successModal,
    closeConfirmation,
    closeAcknowledgment,
    closeSuccess,
  } = useNotifications()

  return (
    <>
      {children}
      
      <ConfirmationModal
        open={confirmationModal.open}
        onOpenChange={closeConfirmation}
        title={confirmationModal.title}
        onConfirm={() => {
          confirmationModal.onConfirm()
          closeConfirmation()
        }}
        onCancel={() => {
          confirmationModal.onCancel()
          closeConfirmation()
        }}
      />
      
      <AcknowledgmentModal
        open={acknowledgmentModal.open}
        onOpenChange={closeAcknowledgment}
        title={acknowledgmentModal.title}
        onAcknowledge={() => {
          acknowledgmentModal.onAcknowledge()
          closeAcknowledgment()
        }}
      />
      
      <SuccessModal
        open={successModal.open}
        onOpenChange={closeSuccess}
        title={successModal.title}
        onAcknowledge={() => {
          successModal.onAcknowledge()
          closeSuccess()
        }}
      />
    </>
  )
}
