
import { Check } from "lucide-react"
import { Modal, ModalClose, ModalContent, ModalTitle } from "@/design-system/ui/base/modal"
import {SuperButton} from "@/design-system/ui/base/super-button"


interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onAcknowledge: () => void
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  onAcknowledge,
}: SuccessModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>
          
          <ModalTitle className="text-xl font-medium text-slate-600 leading-relaxed">
            {title}
          </ModalTitle>
          
          <div className="flex justify-center">
            <ModalClose asChild>
              <SuperButton
                variant="pill"
                theme="success"
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
