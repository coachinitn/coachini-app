
"use client"

import { TooltipProvider } from "./tooltip-provider"
import { ToastProvider } from "./toast-provider"
import { ModalProviderV2 } from "./modal-provider-v2"
import { MaintenanceProvider } from "./maintenance-provider"

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * App-specific providers (non-global)
 * React Query is now handled globally in the main Providers component
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <TooltipProvider>
      <ToastProvider useSonner>
          <ModalProviderV2>
            <MaintenanceProvider
              initialConfig={{
                enabled: true, // Set to true to enable maintenance mode
                showBanner: true,
                showModal: true,
                dismissibleBanner: false,
                persistentModal: false,
                // Optional: customize messages
                // bannerMessage: "Custom banner message",
                // modalTitle: "Custom modal title",
                // modalDescription: "Custom modal description",
                // affectedFeatures: ["Feature 1", "Feature 2"],
                // estimatedTime: "2 hours",
              }}
            >
              {children}
            </MaintenanceProvider>
          </ModalProviderV2>
      </ToastProvider>
    </TooltipProvider>
  )
}
