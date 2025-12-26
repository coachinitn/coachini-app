import { AlertTriangle, Info, XCircle } from "lucide-react"
import { 
  EnhancedModal, 
  EnhancedModalClose, 
  EnhancedModalContent, 
  EnhancedModalTitle, 
  EnhancedModalDescription 
} from "@/design-system/ui/base/enhanced-modal"
import { SuperButton } from "@/design-system/ui/base/super-button"
import { cn } from "@/core/utils"

interface EnhancedConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
  modalOptions?: {
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    persistent?: boolean
  }
}

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'YES',
  cancelText = 'NO',
  onConfirm,
  onCancel,
  variant = 'info',
  modalOptions,
}: EnhancedConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          titleColor: 'text-red-600',
          confirmTheme: 'primary' as const,
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-amber-500" />,
          titleColor: 'text-amber-600',
          confirmTheme: 'primary' as const,
        }
      default:
        return {
          icon: <Info className="w-12 h-12 text-blue-500" />,
          titleColor: 'text-[#094BA4]',
          confirmTheme: 'primary' as const,
        }
    }
  }

  const variantStyles = getVariantStyles()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onCancel()
    onClose()
  }

  return (
    <EnhancedModal 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
      closeOnOverlayClick={modalOptions?.closeOnOverlayClick ?? true}
      closeOnEsc={modalOptions?.closeOnEsc ?? true}
      persistent={modalOptions?.persistent ?? false}
    >
      <EnhancedModalContent className="text-center max-w-md">
        <div className="space-y-6">
          <div className="flex justify-center">
            {variantStyles.icon}
          </div>
          
          <div className="space-y-3">
            <EnhancedModalTitle className={cn("text-xl font-medium leading-relaxed", variantStyles.titleColor)}>
              {title}
            </EnhancedModalTitle>
            {description && (
              <EnhancedModalDescription className="text-gray-600 text-sm leading-relaxed">
                {description}
              </EnhancedModalDescription>
            )}
          </div>
          
          <div className="flex gap-4 justify-center">
            <EnhancedModalClose asChild>
              <SuperButton
                variant="pill"
                theme="outline"
                size="lg"
                filled={false}
                onClick={handleCancel}
                className="flex-1"
              >
                {cancelText}
              </SuperButton>
            </EnhancedModalClose>
            
            <EnhancedModalClose asChild>
              <SuperButton
                variant="pill"
                theme={variantStyles.confirmTheme}
                size="lg"
                filled={true}
                onClick={handleConfirm}
                className="flex-1"
              >
                {confirmText}
              </SuperButton>
            </EnhancedModalClose>
          </div>
        </div>
      </EnhancedModalContent>
    </EnhancedModal>
  )
}
