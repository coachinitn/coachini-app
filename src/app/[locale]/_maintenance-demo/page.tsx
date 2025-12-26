"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/design-system/ui/base/card'
import { SuperButton } from '@/design-system/ui/base/super-button'
import { useMaintenanceMode } from '@/core/providers/maintenance-provider'
import { toast } from '@/design-system/ui/base/sonner'
import { AlertTriangle, Wrench, Eye, EyeOff, Settings } from 'lucide-react'

/**
 * Maintenance Mode Demo Page
 * 
 * This page demonstrates the maintenance mode system including:
 * - Global maintenance banner
 * - Maintenance modal on entry
 * - Configuration options
 * - Manual controls
 */
export default function MaintenanceDemoPage() {
  const { config, updateConfig, dismissBanner, showMaintenanceModal } = useMaintenanceMode()

  const handleEnableMaintenance = () => {
    updateConfig({ enabled: true })
    toast.success('Maintenance mode enabled')
  }

  const handleDisableMaintenance = () => {
    updateConfig({ enabled: false })
    toast.success('Maintenance mode disabled')
  }

  const handleToggleBanner = () => {
    updateConfig({ showBanner: !config.showBanner })
    toast.info(`Banner ${!config.showBanner ? 'enabled' : 'disabled'}`)
  }

  const handleToggleModal = () => {
    updateConfig({ showModal: !config.showModal })
    toast.info(`Modal ${!config.showModal ? 'enabled' : 'disabled'}`)
  }

  const handleShowModal = () => {
    showMaintenanceModal()
  }

  const handleDismissBanner = () => {
    dismissBanner()
    toast.info('Banner dismissed')
  }

  const handleSetCustomMessages = () => {
    updateConfig({
      bannerMessage: "🚧 Scheduled maintenance in progress - Expected completion: 2:00 PM EST",
      modalTitle: "Scheduled System Maintenance",
      modalDescription: "We're upgrading our systems to serve you better. During this time, some features may be temporarily unavailable.",
      affectedFeatures: [
        "User authentication",
        "File uploads",
        "Real-time notifications",
        "Payment processing"
      ],
      estimatedTime: "2 hours"
    })
    toast.success('Custom messages applied')
  }

  const handleResetMessages = () => {
    updateConfig({
      bannerMessage: "This website is currently under maintenance. Some features may be unavailable.",
      modalTitle: "Website Under Maintenance",
      modalDescription: "We're currently performing scheduled maintenance to improve your experience. Some features may be temporarily unavailable.",
      affectedFeatures: undefined,
      estimatedTime: undefined
    })
    toast.success('Messages reset to defaults')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-amber-100 rounded-full p-4">
              <Wrench className="w-12 h-12 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Maintenance Mode Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test and configure the global maintenance mode system with banner and modal notifications
          </p>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Maintenance Mode</p>
                <p className={`text-lg font-semibold ${config.enabled ? 'text-amber-600' : 'text-green-600'}`}>
                  {config.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Banner</p>
                <p className={`text-lg font-semibold ${config.showBanner ? 'text-blue-600' : 'text-gray-400'}`}>
                  {config.showBanner ? 'Visible' : 'Hidden'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Modal</p>
                <p className={`text-lg font-semibold ${config.showModal ? 'text-blue-600' : 'text-gray-400'}`}>
                  {config.showModal ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Banner Dismissible</p>
                <p className={`text-lg font-semibold ${config.dismissibleBanner ? 'text-blue-600' : 'text-gray-400'}`}>
                  {config.dismissibleBanner ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Main Controls</CardTitle>
            <CardDescription>
              Enable or disable maintenance mode globally
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <SuperButton
                onClick={handleEnableMaintenance}
                theme="primary"
                disabled={config.enabled}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Enable Maintenance Mode
              </SuperButton>
              <SuperButton
                onClick={handleDisableMaintenance}
                theme="secondary"
                disabled={!config.enabled}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Disable Maintenance Mode
              </SuperButton>
            </div>
            <p className="text-sm text-gray-600">
              When enabled, the maintenance banner will appear at the top of the page and a modal will show on first visit.
            </p>
          </CardContent>
        </Card>

        {/* Component Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Component Controls</CardTitle>
            <CardDescription>
              Toggle individual components and test functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Banner Controls</h4>
                <div className="flex flex-col gap-2">
                  <SuperButton
                    onClick={handleToggleBanner}
                    theme="secondary"
                    size="sm"
                    className="w-full"
                  >
                    {config.showBanner ? 'Hide' : 'Show'} Banner
                  </SuperButton>
                  <SuperButton
                    onClick={handleDismissBanner}
                    theme="secondary"
                    size="sm"
                    className="w-full"
                    disabled={!config.enabled || !config.showBanner}
                  >
                    Dismiss Banner (Test)
                  </SuperButton>
                  <SuperButton
                    onClick={() => {
                      updateConfig({ dismissibleBanner: !config.dismissibleBanner })
                      toast.info(`Banner is now ${!config.dismissibleBanner ? 'dismissible' : 'not dismissible'}`)
                    }}
                    theme="secondary"
                    size="sm"
                    className="w-full"
                  >
                    {config.dismissibleBanner ? 'Make Non-Dismissible' : 'Make Dismissible'}
                  </SuperButton>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Modal Controls</h4>
                <div className="flex flex-col gap-2">
                  <SuperButton
                    onClick={handleToggleModal}
                    theme="secondary"
                    size="sm"
                    className="w-full"
                  >
                    {config.showModal ? 'Disable' : 'Enable'} Auto Modal
                  </SuperButton>
                  <SuperButton
                    onClick={handleShowModal}
                    theme="primary"
                    size="sm"
                    className="w-full"
                  >
                    Show Modal Now
                  </SuperButton>
                  <SuperButton
                    onClick={() => {
                      updateConfig({ persistentModal: !config.persistentModal })
                      toast.info(`Modal is now ${!config.persistentModal ? 'persistent' : 'dismissible'}`)
                    }}
                    theme="secondary"
                    size="sm"
                    className="w-full"
                  >
                    {config.persistentModal ? 'Make Dismissible' : 'Make Persistent'}
                  </SuperButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Message Customization</CardTitle>
            <CardDescription>
              Apply custom messages or reset to defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <SuperButton
                onClick={handleSetCustomMessages}
                theme="primary"
              >
                Apply Custom Messages
              </SuperButton>
              <SuperButton
                onClick={handleResetMessages}
                theme="secondary"
              >
                Reset to Defaults
              </SuperButton>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Current Banner Message:</p>
              <p className="text-sm text-gray-600">{config.bannerMessage}</p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">To Enable Maintenance Mode:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open <code className="bg-gray-100 px-2 py-1 rounded">src/core/providers/app-provider.tsx</code></li>
                  <li>Find the MaintenanceProvider configuration</li>
                  <li>Set <code className="bg-gray-100 px-2 py-1 rounded">enabled: true</code></li>
                  <li>Customize messages and options as needed</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Configuration Options:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">enabled</code> - Enable/disable maintenance mode</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">showBanner</code> - Show/hide the top banner</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">showModal</code> - Show modal on first visit</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">dismissibleBanner</code> - Allow users to dismiss banner</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">persistentModal</code> - Prevent modal dismissal</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">affectedFeatures</code> - List of affected features</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">estimatedTime</code> - Estimated completion time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

