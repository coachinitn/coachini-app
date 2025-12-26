import { Modal, ModalClose, ModalContent, ModalTitle } from "@/design-system/ui/base/modal"
import { SuperButton } from "@/design-system/ui/base/super-button"



interface AcknowledgmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onAcknowledge: () => void
}

export function AcknowledgmentModal({
  open,
  onOpenChange,
  title,
  onAcknowledge,
}: AcknowledgmentModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="text-center">
        <div className="space-y-6">
          <ModalTitle className="text-xl font-medium text-slate-600 leading-relaxed">
            {title}
          </ModalTitle>
          
          <div className="flex justify-center">
            <ModalClose asChild>
              <SuperButton
                variant="pill"
                theme="primary"
                size="lg"
                filled={true}
                onClick={onAcknowledge}
                className="px-12"
              >
                Okay
              </SuperButton>
            </ModalClose>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
