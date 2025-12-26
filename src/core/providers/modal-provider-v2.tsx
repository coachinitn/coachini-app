"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

// Generic modal interface
export interface ModalConfig {
  id: string
  component: React.ComponentType<any>
  props?: Record<string, any>
  options?: {
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    persistent?: boolean
  }
}

interface ModalContextType {
  modals: ModalConfig[]
  openModal: (config: Omit<ModalConfig, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  updateModal: (id: string, updates: Partial<ModalConfig>) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

interface ModalProviderProps {
  children: React.ReactNode
}

export function ModalProviderV2({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalConfig[]>([])

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newModal: ModalConfig = {
      ...config,
      id,
      options: {
        closeOnOverlayClick: true,
        closeOnEsc: true,
        persistent: false,
        ...config.options,
      },
    }
    
    setModals(prev => [...prev, newModal])
    return id
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id))
  }, [])

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  const updateModal = useCallback((id: string, updates: Partial<ModalConfig>) => {
    setModals(prev => 
      prev.map(modal => 
        modal.id === id 
          ? { ...modal, ...updates, props: { ...modal.props, ...updates.props } }
          : modal
      )
    )
  }, [])

  return (
    <ModalContext.Provider value={{
      modals,
      openModal,
      closeModal,
      closeAllModals,
      updateModal,
    }}>
      {children}
      {modals.map(modal => {
        const ModalComponent = modal.component
        
        return (
          <ModalComponent
            key={modal.id}
            {...modal.props}
            onClose={() => closeModal(modal.id)}
            isOpen={true}
            modalId={modal.id}
            // Pass options to modal component
            modalOptions={modal.options}
          />
        )
      })}
    </ModalContext.Provider>
  )
}
