import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/core/utils"

interface EnhancedModalProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  persistent?: boolean
}

const EnhancedModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    closeOnOverlayClick?: boolean
  }
>(({ className, closeOnOverlayClick = true, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    onClick={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
    {...props}
  />
))
EnhancedModalOverlay.displayName = "EnhancedModalOverlay"

const EnhancedModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
  }
>(({ className, children, closeOnOverlayClick = true, closeOnEsc = true, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <EnhancedModalOverlay closeOnOverlayClick={closeOnOverlayClick} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-6 bg-white p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] rounded-3xl",
        className
      )}
      onEscapeKeyDown={closeOnEsc ? undefined : (e) => e.preventDefault()}
      onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
      onInteractOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
EnhancedModalContent.displayName = "EnhancedModalContent"

export function EnhancedModal({
  open,
  onOpenChange,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  persistent = false,
}: EnhancedModalProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && persistent) {
      // Persistent modals cannot be closed
      return
    }
    onOpenChange?.(newOpen)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === EnhancedModalContent) {
          return React.cloneElement(child, {
            closeOnOverlayClick: persistent ? false : closeOnOverlayClick,
            closeOnEsc: persistent ? false : closeOnEsc,
          } as any)
        }
        return child
      })}
    </DialogPrimitive.Root>
  )
}

export const EnhancedModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
EnhancedModalTitle.displayName = DialogPrimitive.Title.displayName

export const EnhancedModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
EnhancedModalDescription.displayName = DialogPrimitive.Description.displayName

export const EnhancedModalClose = DialogPrimitive.Close

export { EnhancedModalContent }
