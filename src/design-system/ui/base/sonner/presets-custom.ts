import React from 'react'
import { toast } from '@/design-system/ui/base/sonner'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/core/utils'

export interface CustomToastProps {
	title: string
	description?: string
	duration?: number
	icon?: React.ReactNode
	onClose?: () => void
	action?: {
		label: string
		onClick?: () => void
		className?: string
	}
	cancel?: {
		label: string
		onClick?: () => void
		className?: string
	}
	closeButton?: {
		className?: string
		size?: 'sm' | 'md' | 'lg'
	}
}

// Toast variant configuration using Tailwind
const toastVariants = cva(
	'relative min-w-[300px] p-4 rounded-lg border text-sm shadow-lg',
	{
		variants: {
			variant: {
				success: 'bg-green-50 text-green-800 border-green-300',
				error: 'bg-red-50 text-red-800 border-red-300',
				info: 'bg-blue-50 text-blue-800 border-blue-300',
				debug: 'bg-amber-50 text-amber-800 border-amber-300 border-dashed',
				warning: 'bg-yellow-50 text-yellow-800 border-yellow-300',
			},
		},
		defaultVariants: {
			variant: 'info',
		},
	}
)

// Variant configuration with icons and button styles
const variantConfig = {
	success: {
		defaultIcon: '✅',
		buttonClasses: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300',
	},
	error: {
		defaultIcon: '❌',
		buttonClasses: 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300',
	},
	info: {
		defaultIcon: 'ℹ️',
		buttonClasses: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300',
	},
	debug: {
		defaultIcon: '🐛',
		buttonClasses: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300',
	},
	warning: {
		defaultIcon: '⚠️',
		buttonClasses: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300',
	},
} as const

// Button variant configuration
const buttonVariants = cva(
	'px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer',
	{
		variants: {
			intent: {
				action: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300',
				cancel: 'bg-transparent hover:bg-black/5 border-current border-opacity-20',
			},
		},
		defaultVariants: {
			intent: 'cancel',
		},
	}
)

// Close button variant configuration
const closeButtonVariants = cva(
	'absolute bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity',
	{
		variants: {
			size: {
				sm: 'top-1 right-1 text-sm w-5 h-5',
				md: 'top-2 right-2 text-xl w-7 h-7',
				lg: 'top-2 right-2 text-2xl w-8 h-8',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
)

// Unified toast component using Tailwind
const BaseToastComponent = ({
	title,
	description,
	onClose,
	action,
	cancel,
	icon,
	closeButton,
	variant = 'info',
}: CustomToastProps & {
	variant: keyof typeof variantConfig
}) => {
	const config = variantConfig[variant]
	const toastClasses = toastVariants({ variant })
	const closeButtonClasses = closeButtonVariants({ 
		size: closeButton?.size || 'md' 
	})

	return React.createElement(
		'div',
		{
			className: toastClasses,
		},
		// Close button
		React.createElement(
			'button',
			{
				onClick: onClose,
				className: cn(closeButtonClasses, closeButton?.className),
			},
			'×'
		),
		// Content container
		React.createElement(
			'div',
			{
				className: 'flex items-start gap-3',
			},
			// Icon
			React.createElement(
				'div',
				{
					className: 'text-xl leading-none mt-0.5 flex items-center justify-center',
				},
				icon || config.defaultIcon
			),
			// Text content
			React.createElement(
				'div',
				{
					className: 'flex-1 pr-5',
				},
				// Title
				React.createElement(
					'div',
					{
						className: cn('font-semibold', description && 'mb-1'),
					},
					title
				),
				// Description
				description &&
					React.createElement(
						'div',
						{
							className: 'text-xs opacity-90 leading-relaxed',
						},
						description
					)
			)
		),
		// Action buttons
		(action || cancel) &&
			React.createElement(
				'div',
				{
					className: 'flex gap-2 mt-3 justify-end',
				},
				cancel &&
					React.createElement(
						'button',
						{
							onClick: () => {
								if (cancel.onClick) {
									cancel.onClick()
								}
								onClose?.()
							},
							className: cn(buttonVariants({ intent: 'cancel' }), cancel.className),
						},
						cancel.label
					),
				action &&
					React.createElement(
						'button',
						{
							onClick: () => {
								if (action.onClick) {
									action.onClick()
								}
								onClose?.()
							},
							className: cn(buttonVariants({ intent: 'action' }), action.className),
						},
						action.label
					)
			)
	)
}

// Generic toast function with variants
export const createToast = (
	variant: keyof typeof variantConfig,
	props: CustomToastProps
) =>
	toast.custom(
		(id) =>
			BaseToastComponent({
				...props,
				variant,
				onClose: () => {
					toast.dismiss(id)
					props.onClose?.()
				},
			}),
		{
			duration: props.duration || 1000,
			className: 'rounded-lg',
		}
	)

// Simplified preset functions using the generic createToast
export const toastSuccessComp = (props: CustomToastProps) => createToast('success', props)
export const toastErrorComp = (props: CustomToastProps) => createToast('error', props)
export const toastInfoComp = (props: CustomToastProps) => createToast('info', props)
export const toastDebugComp = (props: CustomToastProps) => createToast('debug', props)
export const toastWarningComp = (props: CustomToastProps) => createToast('warning', props)

// Advanced function with explicit variant control
export interface ToastWithVariantProps extends CustomToastProps {
	variant: keyof typeof variantConfig
}

export const toastWithVariant = (props: ToastWithVariantProps) => 
	createToast(props.variant, props)

// Utility to extend variants
export const extendVariants = (newVariants: Record<string, typeof variantConfig.success>) => {
	return {
		...variantConfig,
		...newVariants,
	}
}

export type ToastVariant = keyof typeof variantConfig
export type { VariantProps }
