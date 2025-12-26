
import { useState } from "react"

export function useNotifications() {
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    title: "",
    onConfirm: () => {},
    onCancel: () => {},
  })
  
  const [acknowledgmentModal, setAcknowledgmentModal] = useState({
    open: false,
    title: "",
    onAcknowledge: () => {},
  })
  
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "",
    onAcknowledge: () => {},
  })

  const showConfirmation = (
    title: string,
    onConfirm: () => void,
    onCancel: () => void = () => {}
  ) => {
    setConfirmationModal({
      open: true,
      title,
      onConfirm,
      onCancel,
    })
  }

  const showAcknowledgment = (title: string, onAcknowledge: () => void = () => {}) => {
    setAcknowledgmentModal({
      open: true,
      title,
      onAcknowledge,
    })
  }

  const showSuccess = (title: string, onAcknowledge: () => void = () => {}) => {
    setSuccessModal({
      open: true,
      title,
      onAcknowledge,
    })
  }

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, open: false }))
  }

  const closeAcknowledgment = () => {
    setAcknowledgmentModal(prev => ({ ...prev, open: false }))
  }

  const closeSuccess = () => {
    setSuccessModal(prev => ({ ...prev, open: false }))
  }

  return {
    confirmationModal,
    acknowledgmentModal,
    successModal,
    showConfirmation,
    showAcknowledgment,
    showSuccess,
    closeConfirmation,
    closeAcknowledgment,
    closeSuccess,
  }
}
