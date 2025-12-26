import { useState } from "react"
import { Modal, ModalClose, ModalContent, ModalTitle } from "@/design-system/ui/base/modal"
import { SuperButton } from "@/design-system/ui/base/super-button"
import { Input } from "@/design-system/ui/base/input"
import { Label } from "@/design-system/ui/base/label"

interface CustomModalExampleProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; email: string }) => void
  initialData?: { name: string; email: string }
}

export function CustomModalExample({
  isOpen,
  onClose,
  onSubmit,
  initialData = { name: '', email: '' }
}: CustomModalExampleProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  const handleClose = () => {
    setFormData(initialData)
    setErrors({})
    onClose()
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <ModalTitle className="text-xl font-medium text-[#094BA4] mb-4">
              User Information
            </ModalTitle>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 justify-end">
            <ModalClose asChild>
              <SuperButton
                type="button"
                variant="pill"
                theme="outline"
                size="lg"
                filled={false}
                onClick={handleClose}
              >
                Cancel
              </SuperButton>
            </ModalClose>
            
            <SuperButton
              type="submit"
              variant="pill"
              theme="primary"
              size="lg"
              filled={true}
            >
              Save
            </SuperButton>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}
