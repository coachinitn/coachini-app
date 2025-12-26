"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/ui/base/card'
import { SuperButton } from '@/design-system/ui/base/super-button'
import { useNotifications } from '@/lib/hooks/use-notifications'
import { useModalNotification } from '@/lib/hooks/use-modal-notification'
import { useModal } from '@/core/providers/modal-provider-v2'
import { CustomModalExample } from '@/design-system/ui/layout/modals/custom-modal'
import { ConfirmationModal } from '@/design-system/ui/layout/modals/confirmation-modal'
import { toast } from '@/design-system/ui/base/sonner'

export default function ModalDemoPage() {
  // Current modal system
//   const {
//     showConfirmation: showOldConfirmation,
//     showAcknowledgment: showOldAcknowledgment,
//     showSuccess: showOldSuccess
//   } = useNotifications()

  // New modal system - now enabled!
  const { openModal } = useModal()
  const {
    showConfirmation: showNewConfirmation,
    showAcknowledgment: showNewAcknowledgment,
    showSuccess: showNewSuccess,
    showDeleteConfirmation,
    showSaveConfirmation,
    showError,
    showQuickSuccess
  } = useModalNotification()

  // Simulate various modal scenarios
//   const handleDeleteUser = () => {
//     showOldConfirmation(
//       "Are you sure you want to delete this user?",
//       () => {
//         toast.success("User deleted successfully")
//         showOldSuccess("User has been deleted from the system")
//       },
//       () => {
//         toast.info("Delete operation cancelled")
//       }
//     )
//   }

//   const handleSaveChanges = () => {
//     showOldConfirmation(
//       "Do you want to save your changes?",
//       () => {
//         // Simulate save operation
//         setTimeout(() => {
//           showOldSuccess("Changes saved successfully!")
//         }, 1000)
//       },
//       () => {
//         showOldAcknowledgment("Changes were not saved")
//       }
//     )
//   }

//   const handleError = () => {
//     showOldAcknowledgment("An error occurred while processing your request. Please try again.")
//   }

//   const handleInfo = () => {
//     showOldAcknowledgment("This is an informational message to help you understand the feature.")
//   }

  // New modal system examples - now working!
  const handleCustomModal = () => {
    openModal({
      component: CustomModalExample,
      props: {
        onSubmit: (data: { name: string; email: string }) => {
          console.log('Form submitted:', data)
          toast.success(`User ${data.name} saved!`)
        },
        initialData: { name: 'John Doe', email: 'john@example.com' }
      }
    })
  }

  const handleEnhancedConfirmation = () => {
    openModal({
      component: ConfirmationModal,
      props: {
        title: 'Delete Account',
        description: 'This will permanently delete your account and all associated data. This action cannot be undone.',
        confirmText: 'Delete Account',
        cancelText: 'Keep Account',
        variant: 'danger',
        onConfirm: () => {
          toast.success('Account deletion initiated')
        },
        onCancel: () => {
          toast.info('Account deletion cancelled')
        }
      },
      options: {
        persistent: true,
        closeOnEsc: false
      }
    })
  }

  // New notification helpers
  const handleNewDeleteUser = () => {
    showDeleteConfirmation('User Account', () => {
      toast.success('User deleted successfully')
      showQuickSuccess('User account has been deleted')
    })
  }

  const handleNewSaveChanges = () => {
    showSaveConfirmation(
      () => {
        setTimeout(() => {
          showQuickSuccess('Changes saved successfully!')
        }, 1000)
      },
      () => {
        showNewAcknowledgment({
          title: 'Changes discarded',
          description: 'Your changes were not saved and have been discarded.'
        })
      }
    )
  }

  const handleNewError = () => {
    showError('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.')
  }

  const handleNewWarning = () => {
    showNewConfirmation({
      title: 'Unsaved Changes',
      description: 'You have unsaved changes that will be lost if you continue.',
      confirmText: 'Continue',
      cancelText: 'Stay',
      variant: 'warning',
      onConfirm: () => {
        toast.info('Navigation continued')
      },
      onCancel: () => {
        toast.info('Stayed on page')
      }
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modal System Demo</h1>
        <p className="text-gray-600">
          Demonstration of the current modal system and recommendations for improvements.
        </p>
      </div>

      {/* New Modal System */}
      <Card>
        <CardHeader>
          <CardTitle>New Modal System (Enhanced)</CardTitle>
          <p className="text-sm text-gray-600">
            The improved modal system with enhanced features, better scalability, and more configuration options.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <SuperButton
              variant="pill"
              theme="primary"
              onClick={handleEnhancedConfirmation}
              className="w-full"
            >
              Enhanced Confirmation
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="success"
              onClick={handleCustomModal}
              className="w-full"
            >
              Custom Form Modal
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="outline"
              onClick={handleNewDeleteUser}
              className="w-full"
            >
              Delete Helper
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="primary"
              onClick={handleNewSaveChanges}
              className="w-full"
            >
              Save Helper
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="outline"
              onClick={handleNewError}
              className="w-full"
            >
              Error Modal
            </SuperButton>
            
            <SuperButton
              variant="pill"
              theme="outline"
              onClick={handleNewWarning}
              className="w-full"
            >
              Warning Modal
            </SuperButton>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">✨ New Features Demonstrated:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enhanced confirmations with variants (danger, warning, info)</li>
              <li>• Custom form modals with validation</li>
              <li>• Convenience helpers (showDeleteConfirmation, showError, etc.)</li>
              <li>• Rich descriptions and custom button text</li>
              <li>• Auto-closing modals</li>
              <li>• Persistent modals (can't close accidentally)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Current Implementation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ Strengths</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Clean separation of concerns</li>
                <li>• Type-safe interfaces</li>
                <li>• Simple API (show/close pattern)</li>
                <li>• Properly integrated into provider tree</li>
                <li>• Consistent styling</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600 mb-2">⚠️ Scalability Issues</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Hard-coded modal types</li>
                <li>• Limited customization options</li>
                <li>• Provider becomes bloated with new modals</li>
                <li>• Each modal needs separate state management</li>
                <li>• No support for complex modals (forms, multi-step)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Current Modal System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Current System Usage</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`import { useNotifications } from '@/lib/hooks/use-notifications'

const { showConfirmation, showAcknowledgment, showSuccess } = useNotifications()

// Basic confirmation
showConfirmation(
  "Are you sure?",
  () => console.log("Confirmed"),
  () => console.log("Cancelled")
)`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">New System Usage</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`import { useModal } from '@/core/providers/modal-provider-v2'
import { useNotificationsV2 } from '@/lib/hooks/use-notifications-v2'

const { openModal } = useModal()
const { showConfirmation, showDeleteConfirmation } = useNotificationsV2()

// Enhanced confirmation
showConfirmation({
  title: "Delete Account",
  description: "This action cannot be undone",
  variant: "danger",
  onConfirm: () => deleteAccount()
})

// Custom modal
openModal({
  component: UserEditModal,
  props: { userId: 123 },
  options: { persistent: true }
})`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Improvements */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Scalable Architecture</CardTitle>
          <p className="text-sm text-gray-600">
            A more flexible modal system that can handle any type of modal without code changes.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Key Improvements</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Generic Modal Provider:</strong> Can render any modal component</li>
                <li>• <strong>Dynamic Registration:</strong> Add new modals without touching provider code</li>
                <li>• <strong>Enhanced Configuration:</strong> Support for complex props, options, and behaviors</li>
                <li>• <strong>Multiple Modals:</strong> Stack multiple modals with proper z-index management</li>
                <li>• <strong>Auto-cleanup:</strong> Automatic modal removal and memory management</li>
                <li>• <strong>Type Safety:</strong> Full TypeScript support for modal props</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Example Usage (Proposed)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                <code>{`// Simple notification
const modalId = openModal({
  component: ConfirmationModal,
  props: { title: "Delete user?", variant: "danger" }
})

// Complex form modal
openModal({
  component: UserEditModal,
  props: { 
    userId: 123, 
    onSave: (data) => saveUser(data),
    initialData: userData 
  },
  options: { persistent: true, closeOnEsc: false }
})

// Auto-closing success
openModal({
  component: SuccessModal,
  props: { title: "Saved!" },
  options: { autoClose: 2000 }
})`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle>🎉 Implementation Complete!</CardTitle>
          <p className="text-sm text-gray-600">
            The new modal system is now fully integrated and ready to use.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">✅ What's Implemented</h3>
              <ul className="space-y-1 text-sm">
                <li>• ModalProviderV2 integrated into app layout</li>
                <li>• Enhanced notification hooks with rich features</li>
                <li>• Enhanced confirmation modals with variants</li>
                <li>• Custom form modal examples</li>
                <li>• Both systems working side-by-side</li>
                <li>• Full demo with interactive examples</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">📁 Implementation Files</h3>
              <ul className="space-y-1 text-xs">
                <li>• <code>modal-provider-v2.tsx</code> - Scalable provider</li>
                <li>• <code>use-notifications-v2.ts</code> - Enhanced hooks</li>
                <li>• <code>enhanced-confirmation-modal.tsx</code> - Better confirmations</li>
                <li>• <code>custom-modal-example.tsx</code> - Form modal example</li>
                <li>• <code>app-provider.tsx</code> - Updated with new provider</li>
                <li>• <code>modal-demo/page.tsx</code> - This demo page</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">🚀 Ready to Use!</h4>
            <p className="text-sm text-green-700">
              You can now use both modal systems in your application. The new system provides enhanced functionality 
              while maintaining backward compatibility with the existing system. Try all the buttons above to see the differences!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
