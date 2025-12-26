"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useModal } from './modal-provider-v2'
import { MaintenanceModal } from '@/design-system/ui/layout/modals/maintenance-modal'
import { MaintenanceBanner } from '@/design-system/ui/components/maintenance/maintenance-banner'

interface MaintenanceConfig {
  enabled: boolean
  showBanner: boolean
  showModal: boolean
  bannerMessage?: string
  modalTitle?: string
  modalDescription?: string
  affectedFeatures?: string[]
  estimatedTime?: string
  dismissibleBanner?: boolean
  persistentModal?: boolean
}

interface MaintenanceContextType {
  config: MaintenanceConfig
  updateConfig: (config: Partial<MaintenanceConfig>) => void
  dismissBanner: () => void
  showMaintenanceModal: () => void
}

const MaintenanceContext = createContext<MaintenanceContextType | null>(null)

export function useMaintenanceMode() {
  const context = useContext(MaintenanceContext)
  if (!context) {
    throw new Error('useMaintenanceMode must be used within MaintenanceProvider')
  }
  return context
}

interface MaintenanceProviderProps {
  children: ReactNode
  initialConfig?: Partial<MaintenanceConfig>
}

const DEFAULT_CONFIG: MaintenanceConfig = {
  enabled: false,
  showBanner: true,
  showModal: true,
  bannerMessage: "This website is currently under maintenance. Some features may be unavailable.",
  modalTitle: "Website Under Maintenance",
  modalDescription: "We're currently performing scheduled maintenance to improve your experience. Some features may be temporarily unavailable.",
  affectedFeatures: undefined,
  estimatedTime: undefined,
  dismissibleBanner: false,
  persistentModal: false,
}

/**
 * MaintenanceProvider - Manages maintenance mode state and displays
 * 
 * Features:
 * - Shows maintenance banner at top of page
 * - Shows maintenance modal on first visit
 * - Configurable messages and behavior
 * - Persistent state using localStorage
 * - Easy to enable/disable globally
 * 
 * Usage:
 * ```tsx
 * <MaintenanceProvider initialConfig={{ enabled: true }}>
 *   {children}
 * </MaintenanceProvider>
 * ```
 */
export function MaintenanceProvider({ 
  children, 
  initialConfig = {} 
}: MaintenanceProviderProps) {
  const { openModal } = useModal()
  const [config, setConfig] = useState<MaintenanceConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [modalShown, setModalShown] = useState(false)

  // Load dismissed state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('maintenance-banner-dismissed')
      const shown = localStorage.getItem('maintenance-modal-shown')
      
      if (dismissed === 'true') {
        setBannerDismissed(true)
      }
      if (shown === 'true') {
        setModalShown(true)
      }
    }
  }, [])

  // Show modal on first visit when maintenance is enabled
  useEffect(() => {
    if (config.enabled && config.showModal && !modalShown) {
      // Small delay to ensure modal system is ready
      const timer = setTimeout(() => {
        openModal({
          component: MaintenanceModal,
          props: {
            title: config.modalTitle,
            description: config.modalDescription,
            features: config.affectedFeatures,
            estimatedTime: config.estimatedTime,
            onClose: () => {
              setModalShown(true)
              if (typeof window !== 'undefined') {
                localStorage.setItem('maintenance-modal-shown', 'true')
              }
            },
          },
          options: {
            persistent: config.persistentModal,
            closeOnOverlayClick: !config.persistentModal,
            closeOnEsc: !config.persistentModal,
          }
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [config, modalShown, openModal])

  const updateConfig = (updates: Partial<MaintenanceConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const dismissBanner = () => {
    setBannerDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('maintenance-banner-dismissed', 'true')
    }
  }

  const showMaintenanceModal = () => {
    openModal({
      component: MaintenanceModal,
      props: {
        title: config.modalTitle,
        description: config.modalDescription,
        features: config.affectedFeatures,
        estimatedTime: config.estimatedTime,
      },
      options: {
        persistent: config.persistentModal,
        closeOnOverlayClick: !config.persistentModal,
        closeOnEsc: !config.persistentModal,
      }
    })
  }

  // Reset dismissed states when maintenance is disabled
  useEffect(() => {
    if (!config.enabled) {
      setBannerDismissed(false)
      setModalShown(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('maintenance-banner-dismissed')
        localStorage.removeItem('maintenance-modal-shown')
      }
    }
  }, [config.enabled])

  return (
    <MaintenanceContext.Provider 
      value={{ 
        config, 
        updateConfig, 
        dismissBanner,
        showMaintenanceModal 
      }}
    >
      {/* Maintenance Banner */}
      {config.enabled && config.showBanner && !bannerDismissed && (
        <MaintenanceBanner
          message={config.bannerMessage}
          dismissible={config.dismissibleBanner}
          onDismiss={dismissBanner}
        />
      )}

      {/* Add top padding to content when banner is visible */}
      <div className={config.enabled && config.showBanner && !bannerDismissed ? 'pt-14' : ''}>
        {children}
      </div>
    </MaintenanceContext.Provider>
  )
}

