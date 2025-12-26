"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/ui/base/card'
import { SuperButton } from '@/design-system/ui/base/super-button'
import { useModal } from '@/core/providers/modal-provider-v2'
import { useModalNotification } from '@/lib/hooks/use-modal-notification'
import { ConfirmationModal } from '@/design-system/ui/layout/modals/confirmation-modal'
import { toast } from '@/design-system/ui/base/sonner'

export default function ModalDismissalDemo() {
  const { openModal } = useModal()
  const { showConfirmation, showError } = useModalNotification()

  // 1. Default behavior - closeable by clicking outside or ESC
  const handleDefaultModal = () => {
    openModal({
      component: ConfirmationModal,
      props: {
        title: 'Default Modal',
        description: 'This modal can be closed by clicking outside or pressing ESC',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => {
          toast.success('Confirmed!')
        },
        onCancel: () => {
          toast.info('Cancelled!')
        }
      },
      // Default options - closeable
      options: {
        closeOnOverlayClick: true,  // Can close by clicking outside
        closeOnEsc: true,           // Can close with ESC key
        persistent: false           // Not persistent
      }
    })
  }

  // 2. Persistent modal - CANNOT be closed by clicking outside
  const handlePersistentModal = () => {
    openModal({
      component: ConfirmationModal,
      props: {
        title: 'Persistent Modal',
        description: 'This modal CANNOT be closed by clicking outside. You must click a button.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'danger',
        onConfirm: () => {
          toast.success('Confirmed!')
        },
        onCancel: () => {
          toast.info('Cancelled!')
        }
      },
      options: {
        closeOnOverlayClick: false, // CANNOT close by clicking outside
        closeOnEsc: false,          // CANNOT close with ESC key
        persistent: true            // Persistent modal
      }
    })
  }

  // 3. Semi-persistent - can close with ESC but not overlay click
  const handleSemiPersistentModal = () => {
    openModal({
      component: ConfirmationModal,
      props: {
        title: 'Semi-Persistent Modal',
        description: 'This modal cannot be closed by clicking outside, but you can press ESC',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'warning',
        onConfirm: () => {
          toast.success('Confirmed!')
        },
        onCancel: () => {
          toast.info('Cancelled!')
        }
      },
      options: {
        closeOnOverlayClick: false, // CANNOT close by clicking outside
        closeOnEsc: true,           // CAN close with ESC key
        persistent: false
      }
    })
  }

  // 4. Handle dismissal with custom logic
  const handleModalWithDismissalTracking = () => {
    openModal({
      component: ConfirmationModal,
      props: {
        title: 'Tracked Dismissal',
        description: 'This modal tracks how it was dismissed',
        confirmText: 'Save',
        cancelText: 'Cancel',
        onConfirm: () => {
          toast.success('Data saved!')
        },
        onCancel: () => {
          toast.info('Save cancelled - data not saved')
        }
      },
      options: {
        closeOnOverlayClick: true,
        closeOnEsc: true,
        persistent: false
      }
    })
  }

  // 5. Using the built-in confirmation helper (already persistent)
  const handleBuiltInConfirmation = () => {
    showConfirmation({
      title: 'Delete Account',
      description: 'This will permanently delete your account. This action cannot be undone.',
      confirmText: 'Delete Account',
      cancelText: 'Keep Account',
      variant: 'danger',
      onConfirm: () => {
        toast.success('Account deletion initiated')
      },
      onCancel: () => {
        toast.info('Account deletion cancelled')
      }
    })
  }

  // 6. Custom modal with onOpenChange handler
  const handleCustomDismissalLogic = () => {
    const modalId = openModal({
      component: ({ isOpen, onClose, ...props }: any) => (
        <ConfirmationModal
          {...props}
          isOpen={isOpen}
          onClose={() => {
            // Custom logic when modal is dismissed
            // console.log('Modal dismissed!')
            // toast.info('Modal was dismissed without action')
            onClose()
          }}
        />
      ),
      props: {
        title: 'Custom Dismissal Logic',
        description: 'This modal has custom logic when dismissed',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => {
          toast.success('Confirmed!')
        },
        onCancel: () => {
          toast.info('Cancelled!')
        }
      },
      options: {
        closeOnOverlayClick: true,
        closeOnEsc: true
      }
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modal Dismissal Control Demo</h1>
        <p className="text-gray-600">
          Learn how to control modal dismissal behavior and handle different closing scenarios.
        </p>
      </div>

      {/* Modal Dismissal Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Dismissal Behaviors</CardTitle>
          <p className="text-sm text-gray-600">
            Try each modal to see different dismissal behaviors
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SuperButton
              variant="pill"
              theme="outline"
              onClick={handleDefaultModal}
              className="w-full"
            >
              Default (Closeable)
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="primary"
              onClick={handlePersistentModal}
              className="w-full"
            >
              Persistent Modal
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="outline"
              onClick={handleSemiPersistentModal}
              className="w-full"
            >
              Semi-Persistent
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="success"
              onClick={handleModalWithDismissalTracking}
              className="w-full"
            >
              Tracked Dismissal
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="primary"
              onClick={handleBuiltInConfirmation}
              className="w-full"
            >
              Built-in Helper
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="outline"
              onClick={handleCustomDismissalLogic}
              className="w-full"
            >
              Custom Logic
            </SuperButton>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Dismissal Behavior Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600">✅ What Happens on Dismissal</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Overlay Click:</strong> Triggers onClose() if allowed</div>
                <div><strong>ESC Key:</strong> Triggers onClose() if allowed</div>
                <div><strong>No Action:</strong> Modal stays open, no callbacks fired</div>
                <div><strong>Cancel Button:</strong> Fires onCancel() + onClose()</div>
                <div><strong>Confirm Button:</strong> Fires onConfirm() + onClose()</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">⚙️ Control Options</h3>
              <div className="space-y-2 text-sm">
                <div><strong>closeOnOverlayClick:</strong> Allow/prevent overlay dismissal</div>
                <div><strong>closeOnEsc:</strong> Allow/prevent ESC key dismissal</div>
                <div><strong>persistent:</strong> Override all dismissal (critical modals)</div>
                <div><strong>onOpenChange:</strong> Custom dismissal logic</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. Persistent Modal (Uncloseable)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`openModal({
  component: ConfirmationModal,
  props: { 
    title: "Critical Action",
    onConfirm: () => performAction(),
    onCancel: () => console.log("Cancelled")
  },
  options: {
    closeOnOverlayClick: false,  // Can't close by clicking outside
    closeOnEsc: false,           // Can't close with ESC
    persistent: true             // Force user to choose
  }
})`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Default Closeable Modal</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`openModal({
  component: ConfirmationModal,
  props: { 
    title: "Optional Action",
    onConfirm: () => performAction(),
    onCancel: () => console.log("Cancelled")
  },
  options: {
    closeOnOverlayClick: true,   // Can close by clicking outside
    closeOnEsc: true,            // Can close with ESC
    persistent: false            // Allows dismissal
  }
})`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Handle Dismissal vs Cancel</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`// When user clicks Cancel button: onCancel() is called
// When user dismisses (overlay/ESC): only onClose() is called
// You can differentiate between intentional cancel vs dismissal

const handleCancel = () => {
  console.log("User explicitly cancelled")
  // Maybe save draft or show different message
}

const handleDismiss = () => {
  console.log("User dismissed without decision")
  // Maybe warn about unsaved changes
}`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">✅ Use Persistent Modals For:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Destructive actions (delete, reset)</li>
                <li>• Critical confirmations</li>
                <li>• Forms with unsaved changes</li>
                <li>• Payment/purchase confirmations</li>
                <li>• Terms acceptance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">ℹ️ Use Closeable Modals For:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Information displays</li>
                <li>• Non-critical confirmations</li>
                <li>• Optional settings</li>
                <li>• Preview modals</li>
                <li>• Help/documentation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
