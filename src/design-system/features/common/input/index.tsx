'use client'
import React, { forwardRef, useState, ChangeEvent, FocusEvent } from 'react';
import { cn } from '@/core/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

type Variant = 'outlined' | 'filled' | 'standard';
type InputSize = 'sm' | 'md' | 'lg';

// Define the input container styles using tailwind-variants
const inputContainerStyles = tv({
	base: 'mb-4 relative',
	variants: {
		fullWidth: {
			true: 'w-full',
		},
	},
});

// Define the label styles
const labelStyles = tv({
	base: 'block text-sm font-medium text-gray-700 mb-1',
	variants: {
		error: {
			true: 'text-red-500',
		},
		disabled: {
			true: 'text-gray-400',
		},
	},
});

// Define the input wrapper styles
const inputWrapperStyles = tv({
	base: 'relative flex items-center',
	variants: {
		variant: {
			outlined: 'border border-gray-300 rounded-md',
			filled: 'bg-gray-100 border border-gray-300 rounded-md',
			standard: 'border-b-2 border-gray-300 rounded-none',
		},
		error: {
			true: 'border-red-500',
		},
		focused: {
			true: 'border-blue-700',
		},
		hasValue: {
			true: '',
		},
		disabled: {
			true: 'opacity-70 cursor-not-allowed bg-gray-50',
		},
		fullWidth: {
			true: 'w-full',
		},
		underLine: {
			true: 'px-0',
		},
	},
	compoundVariants: [
		// Filled + underLine special styling
		{
			variant: 'filled',
			underLine: true,
			class: 'bg-blue-50/50 border-0 rounded-none px-0',
		},
		// Standard variant border animation when focused
		{
			variant: 'standard',
			focused: true,
			class: 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:transition-transform after:duration-300 after:transform after:scale-x-100',
		},
		// Standard variant border animation when not focused
		{
			variant: 'standard',
			focused: false,
			class: 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:transition-transform after:duration-300 after:transform after:scale-x-0',
		},
		// Standard variant with value (persistent blue border)
		{
			variant: 'standard',
			hasValue: true,
			focused: false,
			class: 'border-blue-700',
		},
		// Filled + underLine and focused
		{
			variant: 'filled',
			underLine: true,
			focused: true,
			class: 'border-blue-700',
		},
		// Filled + underLine and not focused
		{
			variant: 'filled',
			underLine: true,
			focused: false,
			class: 'border-blue-600',
		},
	],
});

// Define the input field styles
const inputFieldStyles = tv({
	base: 'w-full bg-transparent outline-none transition-all duration-200',
	variants: {
		size: {
			sm: 'text-sm py-1 px-2',
			md: 'text-base py-2 px-3',
			lg: 'text-lg py-3 px-4',
		},
		hasIcon: {
			true: 'pl-10',
		},
		hasRightIcon: {
			true: 'pr-10',
		},
		hasStartAdornment: {
			true: 'pl-10',
		},
		hasEndAdornment: {
			true: 'pr-10',
		},
		disabled: {
			true: 'opacity-60 cursor-not-allowed',
		},
		hidden: {
			true: 'opacity-0',
		},
		variant: {
			filled: '',
			outlined: '',
			standard: '',
		},
		underLine: {
			true: '',
		},
	},
	compoundVariants: [
		// Special padding for outlined + underLine
		{
			variant: 'outlined',
			underLine: true,
			size: 'sm',
			class: 'text-sm py-1 px-0',
		},
		{
			variant: 'outlined',
			underLine: true,
			size: 'md',
			class: 'text-base py-2 px-0',
		},
		{
			variant: 'outlined',
			underLine: true,
			size: 'lg',
			class: 'text-lg py-3 px-0',
		},
		// Special padding for filled + underLine
		{
			variant: 'filled',
			underLine: true,
			size: 'sm',
			class: 'text-sm py-1 px-3',
		},
		{
			variant: 'filled',
			underLine: true,
			size: 'md',
			class: 'text-base py-2 px-3',
		},
		{
			variant: 'filled',
			underLine: true,
			size: 'lg',
			class: 'text-lg py-3 px-3',
		},
		// Filled variant with floating label (padding adjustment)
		{
			variant: 'filled',
			class: 'pt-5',
		},
	],
});

// Define the floating label styles
const floatingLabelStyles = tv({
	base: 'absolute transition-all duration-200 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[85%] text-gray-500',
	variants: {
		variant: {
			outlined: '',
			filled: '',
			standard: '',
		},
		focused: {
			true: 'text-blue-700 pt-1',
		},
		hasValue: {
			true: '',
		},
		hasIcon: {
			true: '',
		},
		error: {
			true: 'text-red-500',
		},
		disabled: {
			true: 'text-gray-400',
		},
		size: {
			sm: '',
			md: '',
			lg: '',
		},
		underLine: {
			true: '',
		},
	},
	compoundVariants: [
		// Filled variant positioning
		{
			variant: 'filled',
			hasIcon: true,
			class: 'left-10',
		},
		{
			variant: 'filled',
			hasIcon: false,
			class: 'left-3',
		},
		// Standard/Outlined positioning with icons
		{
			variant: ['outlined', 'standard'],
			hasIcon: true,
			class: 'left-10',
		},
		{
			variant: ['outlined', 'standard'],
			hasIcon: false,
			class: 'left-2',
		},
		// Filled with floating label sizing
		{
			variant: 'filled',
			hasValue: false,
			focused: false,
			size: 'sm',
			class: 'top-3',
		},
		{
			variant: 'filled',
			hasValue: false,
			focused: false,
			size: 'md',
			class: 'top-4',
		},
		{
			variant: 'filled',
			hasValue: false,
			focused: false,
			size: 'lg',
			class: 'top-5',
		},
		// Filled with floating label when focused or has value
		{
			variant: 'filled',
			focused: true,
			class: 'top-1 text-xs',
		},
		{
			variant: 'filled',
			hasValue: true,
			class: 'top-1 text-xs',
		},
		// Outlined/Standard with floating label sizing
		{
			variant: ['outlined', 'standard'],
			hasValue: false,
			focused: false,
			size: 'sm',
			class: 'top-1',
		},
		{
			variant: ['outlined', 'standard'],
			hasValue: false,
			focused: false,
			size: 'md',
			class: 'top-2.5',
		},
		{
			variant: ['outlined', 'standard'],
			hasValue: false,
			focused: false,
			size: 'lg',
			class: 'top-3.5',
		},
		// Outlined with floating label when focused or has value
		{
			variant: 'outlined',
			hasValue: true,
			class: '-top-2.5 text-xs bg-white px-2 text-blue-700 z-20 transform-gpu translate-x-2',
		},
		{
			variant: 'outlined',
			focused: true,
			class: '-top-2.5 text-xs bg-white px-2 text-blue-700 z-20 transform-gpu translate-x-2',
		},
		// Standard with floating label when focused or has value
		{
			variant: 'standard',
			hasValue: true,
			class: 'top-[-8px] px-0 bg-transparent text-blue-700 pt-1',
		},
		{
			variant: 'standard',
			focused: true,
			class: 'top-[-8px] px-0 bg-transparent text-blue-700 pt-1',
		},
		// Filled + underLine when focused
		{
			variant: 'filled',
			underLine: true,
			focused: true,
			class: 'text-blue-700 pt-1',
		},
	],
});

// Define the icon positioning styles
const iconStyles = tv({
	base: 'absolute -translate-y-1/2 z-[5] flex items-center top-1/2',
	variants: {
		position: {
			left: 'left-3',
			right: 'right-3',
		},
		isLongAdornment: {
			true: '',
		},
	},
	compoundVariants: [
		{
			position: 'left',
			isLongAdornment: true,
			class: 'left-2 pr-1'
		},
		{
			position: 'right',
			isLongAdornment: true,
			class: 'right-2 pl-1'
		}
	]
});

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
		Omit<VariantProps<typeof inputWrapperStyles>, 'error' | 'focused' | 'hasValue'>,
		Omit<VariantProps<typeof inputFieldStyles>, 'hasIcon' | 'hasRightIcon' | 'hasStartAdornment' | 'hasEndAdornment' | 'hidden'> {
	label?: string;
	error?: string;
	helperText?: string;
	icon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	containerClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
	multiline?: boolean;
	rows?: number;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	floatingLabel?: boolean;
	showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
	(
		{
			label,
			error,
			helperText,
			icon,
			rightIcon,
			fullWidth = false,
			containerClassName,
			labelClassName,
			inputClassName,
			className,
			type = 'text',
			variant = 'outlined',
			size = 'md',
			multiline = false,
			rows = 4,
			startAdornment,
			endAdornment,
			floatingLabel = false,
			underLine = false,
			required = false,
			disabled = false,
			readOnly = false,
			onChange,
			value,
			defaultValue,
			placeholder,
			showPasswordToggle = true,
			...props
		},
		ref,
	) => {
		const [showPassword, setShowPassword] = useState(false);
		const [isFocused, setIsFocused] = useState(false);
		const [hasValue, setHasValue] = useState(
			Boolean(value || defaultValue) || false,
		);

		const togglePasswordVisibility = () => {
			setShowPassword(!showPassword);
		};

		const actualType =
			type === 'password' ? (showPassword ? 'text' : 'password') : type;

		const handleFocus = (
			e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			setIsFocused(true);
			if (props.onFocus) {
				props.onFocus(e as any);
			}
		};

		const handleBlur = (
			e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			setIsFocused(false);
			setHasValue(Boolean(e.target.value));
			if (props.onBlur) {
				props.onBlur(e as any);
			}
		};

		const handleChange = (
			e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			setHasValue(Boolean(e.target.value));
			if (onChange) {
				onChange(e as any);
			}
		};

		// If underLine is true, override the variant styling but keep the original variant for label behavior
		const effectiveVariant = underLine ? 'standard' : variant;

		// Determine if we should show the password toggle
		const shouldShowPasswordToggle = type === 'password' && !rightIcon && showPasswordToggle;

		// Determine if we should show the custom right icon
		const shouldShowRightIcon = rightIcon && (type !== 'password' || !showPasswordToggle);

		// Placeholder handling for floating label
		const placeholderValue =
			floatingLabel && !isFocused && !hasValue ? '' : placeholder;

		// Check if adornments are long strings
		const isLongStartAdornment = typeof startAdornment === 'string' && startAdornment.length > 3;
		const isLongEndAdornment = typeof endAdornment === 'string' && endAdornment.length > 3;

		return (
			<div
				className={cn(
					inputContainerStyles({ fullWidth }),
					containerClassName
				)}
			>
				{label && !floatingLabel && (
					<label
						className={cn(
							labelStyles({ error: !!error, disabled }),
							labelClassName,
						)}
					>
						{label}
						{required && <span className="ml-1 text-red-500">*</span>}
					</label>
				)}
				<div
					className={cn(
						inputWrapperStyles({
							variant: effectiveVariant,
							error: !!error,
							focused: isFocused,
							hasValue,
							disabled,
							fullWidth,
							underLine,
						}),
						// Label mask for outlined variant
						effectiveVariant === 'outlined' &&
							(isFocused || hasValue) &&
							floatingLabel &&
							'after:content-[""] after:absolute after:left-0 after:right-0 after:top-0 after:h-[2px] after:bg-inherit after:-translate-y-1/2',
						containerClassName,
					)}
				>
					{startAdornment && (
						<div
							className={iconStyles({
								position: 'left',
								isLongAdornment: isLongStartAdornment,
							})}
						>
							{startAdornment}
						</div>
					)}
					{icon && (
						<div className={iconStyles({ position: 'left' })}>
							{icon}
						</div>
					)}
					{floatingLabel &&
						label &&
						(variant === 'filled' && !underLine ? (
							<label
								className={cn(
									floatingLabelStyles({
										variant,
										focused: isFocused,
										hasValue,
										hasIcon: !!(icon || startAdornment),
										error: !!error,
										disabled,
										size,
										underLine,
									}),
									'z-10'
								)}
							>
								{label}
								{required && <span className="ml-1 text-red-500">*</span>}
							</label>
						) : (
							<div className="absolute inset-0 z-10 h-0 overflow-visible">
								<label
									className={floatingLabelStyles({
										variant,
										focused: isFocused,
										hasValue,
										hasIcon: !!(icon || startAdornment),
										error: !!error,
										disabled,
										size,
										underLine,
									})}
								>
									{label}
									{required && <span className="ml-1 text-red-500">*</span>}
								</label>
							</div>
						))}
					{multiline ? (
						<textarea
							ref={ref as React.Ref<HTMLTextAreaElement>}
							rows={rows}
							className={cn(
								inputFieldStyles({
									size,
									hasIcon: !!(icon || startAdornment),
									hasRightIcon: !!(rightIcon || type === 'password' || endAdornment),
									hasStartAdornment: isLongStartAdornment,
									hasEndAdornment: isLongEndAdornment,
									disabled,
									hidden: floatingLabel && !hasValue && !isFocused,
									variant,
									underLine,
								}),
								isLongStartAdornment && `pl-[calc(0.5rem+${startAdornment.length}ch)]`,
								isLongEndAdornment && `pr-[calc(0.5rem+${(endAdornment as string).length}ch)]`,
								inputClassName,
								className,
							)}
							onFocus={handleFocus}
							onBlur={handleBlur}
							onChange={handleChange as any}
							disabled={disabled}
							readOnly={readOnly}
							required={required}
							aria-invalid={!!error}
							aria-describedby={
								helperText ? `${props.id}-helper-text` : undefined
							}
							placeholder={placeholderValue}
							defaultValue={defaultValue}
							{...(props as any)}
						/>
					) : (
						<input
							ref={ref as React.Ref<HTMLInputElement>}
							type={actualType}
							className={cn(
								inputFieldStyles({
									size,
									hasIcon: !!(icon || startAdornment),
									hasRightIcon: !!(rightIcon || type === 'password' || endAdornment),
									hasStartAdornment: isLongStartAdornment,
									hasEndAdornment: isLongEndAdornment,
									disabled,
									hidden: floatingLabel && !hasValue && !isFocused,
									variant,
									underLine,
								}),
								isLongStartAdornment && `pl-[calc(0.5rem+${startAdornment.length}ch)]`,
								isLongEndAdornment && `pr-[calc(0.5rem+${(endAdornment as string).length}ch)]`,
								inputClassName,
								className,
							)}
							onFocus={handleFocus}
							onBlur={handleBlur}
							onChange={handleChange}
							disabled={disabled}
							readOnly={readOnly}
							required={required}
							aria-invalid={!!error}
							aria-describedby={
								helperText ? `${props.id}-helper-text` : undefined
							}
							placeholder={placeholderValue}
							defaultValue={defaultValue}
							{...props}
						/>
					)}
					{shouldShowPasswordToggle && (
						<button
							type="button"
							className={cn(
								iconStyles({ position: 'right' }),
								'text-gray-500 hover:text-blue-700'
							)}
							onClick={togglePasswordVisibility}
							tabIndex={-1}
							disabled={disabled}
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					)}
					{type === 'password' && rightIcon && showPasswordToggle && (
						<div
							className={cn(
								iconStyles({ position: 'right' }),
								'cursor-pointer'
							)}
							onClick={togglePasswordVisibility}
						>
							{rightIcon}
						</div>
					)}
					{shouldShowRightIcon && (
						<div className={iconStyles({ position: 'right' })}>
							{rightIcon}
						</div>
					)}
					{endAdornment && (
						<div
							className={iconStyles({
								position: 'right',
								isLongAdornment: isLongEndAdornment,
							})}
						>
							{endAdornment}
						</div>
					)}
				</div>
				{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
				{helperText && !error && (
					<p
						id={props.id ? `${props.id}-helper-text` : undefined}
						className="mt-1 text-sm text-gray-500"
					>
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = 'Input';

export { Input };
