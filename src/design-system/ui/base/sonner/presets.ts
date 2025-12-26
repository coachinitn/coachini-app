import { toast } from '@/design-system/ui/base/sonner'
import { cn } from '@/core/utils'

export type ToastOptions = Parameters<typeof toast>[1]

const baseToastOptions: ToastOptions = {
	closeButton: true,
	duration: 2000,
	style: {
		padding: '16px',
		borderRadius: '8px',
		border: '1px solid',
		fontSize: '14px',
	}
}

const presetStyles = {
	debug: {
		background: '#fef3c7',
		color: '#92400e',
		borderColor: '#fbbf24',
		borderStyle: 'dashed' as const,
	},
	info: {
		background: '#dbeafe',
		color: '#1e40af',
		borderColor: '#3b82f6',
	},
	success: {
		background: '#dcfce7',
		color: '#166534',
		borderColor: '#22c55e',
	},
	error: {
		background: '#fee2e2',
		color: '#dc2626',
		borderColor: '#ef4444',
	},
} as const

const mergeToastOptions = (presetType: keyof typeof presetStyles, options?: ToastOptions): ToastOptions => ({
	...baseToastOptions,
	...options,
	style: {
		...baseToastOptions.style,
		...presetStyles[presetType],
		...options?.style,
	}
})

export const toastDebug = (message: string, options?: ToastOptions) =>
	toast(message, mergeToastOptions('debug', options))

export const toastInfo = (
	title: string,
	description?: string,
	options?: ToastOptions,
) => toast(title, { 
	description, 
	...mergeToastOptions('info', options)
})

export const toastSuccess = (
	title: string,
	description?: string,
	options?: ToastOptions,
) => toast.success(title, { 
	description, 
	...mergeToastOptions('success', options)
})

export const toastError = (
	title: string,
	description?: string,
	options?: ToastOptions,
) => toast.error(title, { 
	description, 
	...mergeToastOptions('error', options)
})

export const toastPromise = <T,>(
	promise: Promise<T>,
	labels: { loading: string; success: string; error: string },
) => toast.promise(promise, labels)


