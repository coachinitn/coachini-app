'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Eye, EyeOff, ChevronDown, Check, Paperclip, X, Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/core/utils';

const wrapperVariants = cva(
	'relative flex w-full items-center transition-colors duration-200',
	{
		variants: {
			variant: {
				outlined:
					'border border-input rounded-md bg-transparent py-1 hover:border-foreground/80',
				filled: 'border-b-1 border-text-400 bg-primary-50/50 py-1 rounded-t-md',
				standard: 'border-b-2 border-input bg-transparent py-1 px-0',
			},
			focused: {
				true: 'border-b-3 border-primary-900',
			},
			error: {
				true: '!border-destructive',
			},
			disabled: {
				true: 'cursor-not-allowed bg-muted opacity-70',
			},
			underline: {
				true: 'border-0 border-b-2 rounded-none bg-transparent px-0',
			},
		},
		compoundVariants: [
			{ variant: 'outlined', focused: true, class: 'ring-1 ring-primary' },
			{ variant: 'filled', underline: true, class: 'bg-secondary' },
			{ variant: 'outlined', underline: true, class: 'border-input' },
		],
	},
);

const inputVariants = cva(
	'peer w-full bg-transparent font-body outline-none transition-all text-primary',
	{
		variants: {
			size: {
				sm: 'h-9 px-3 py-2 text-sm',
				md: 'h-11 px-3 py-3 text-base',
				lg: 'h-12 px-4 py-3 text-lg',
			},
			variant: {
				outlined: '',
				filled: '',
				standard: 'px-0.5',
			},
			floatingLabel: {
				true: '',
				false: '',
			},
			hasIcon: {
				true: 'pl-10',
			},
			hasRightContent: {
				true: 'pr-10',
			},
			multiline: {
				true: 'h-auto',
			},
			underline: {
				true: 'px-0.5',
			},
		},
		compoundVariants: [
			{ multiline: true, size: 'sm', class: 'py-2' },
			{ multiline: true, size: 'md', class: 'py-2.5' },
			{ multiline: true, size: 'lg', class: 'py-3'},
			// Floating Label Padding Adjustments by Variant and Size
			{ floatingLabel: true, variant: 'outlined', size: 'sm', class: 'pt-1 pb-1' },
			{ floatingLabel: true, variant: 'outlined', size: 'md', class: 'pt-0 pb-0' },
			{ floatingLabel: true, variant: 'outlined', size: 'lg', class: 'pt-2 pb-2' },
			{ floatingLabel: true, variant: 'filled', size: 'sm', class: 'pt-7 pb-1' },
			{ floatingLabel: true, variant: 'filled', size: 'md', class: 'pt-8 pb-3' },
			{ floatingLabel: true, variant: 'filled', size: 'lg', class: 'pt-9 pb-2' },
			{ floatingLabel: true, variant: 'standard', size: 'sm', class: 'pt-7 pb-2' },
			{ floatingLabel: true, variant: 'standard', size: 'md', class: 'pt-5 pb-1' },
			{ floatingLabel: true, variant: 'standard', size: 'lg', class: 'pt-6 pb-1' },
			{ multiline: true, floatingLabel: true, size: 'sm', class: 'pt-4 pb-0' },
			{ multiline: true, floatingLabel: true, size: 'md', class: 'pt-5 pb-1' },
			{ multiline: true, floatingLabel: true, size: 'lg', class: 'pt-6 pb-2' },
		],
	},
);

const labelVariants = cva(
	'pointer-events-none absolute left-3 z-10 origin-left text-text-muted transition-all duration-300',
	{
		variants: {
			size: {
				sm: 'text-sm',
				md: 'text-base',
				lg: 'text-lg',
			},
			variant: {
				outlined: '',
				filled: 'left-3',
				standard: 'left-0.5',
			},
			hasIcon: {
				true: 'left-10',
			},
			isFloated: {
				true: 'scale-75',
				false: 'scale-100',
			},
			focused: {
				true: 'text-primary-900',
			},
			error: {
				true: '!text-destructive',
			},
			underline: {
				true: 'left-0.5',
			},
	floatingLabelSize: {
		sm: 'text-sm',
		xs: 'text-xs',
	},
		},
		compoundVariants: [
			// Initial positions (not floated):
			{ isFloated: false, size: 'sm', class: 'top-1/2 -translate-y-1/2' },
			{ isFloated: false, size: 'md', class: 'top-1/2 -translate-y-1/2' },
			{ isFloated: false, size: 'lg', class: 'top-1/2 -translate-y-1/2' },

			// Floated positions:
			{
				variant: 'outlined',
				isFloated: true,
				size: 'sm',
				class: 'top-0 -translate-y-1/2 bg-card px-1',
			},
			{
				variant: 'outlined',
				isFloated: true,
				size: 'md',
				class: 'top-0 -translate-y-1/2 bg-card px-1',
			},
			{
				variant: 'outlined',
				isFloated: true,
				size: 'lg',
				class: 'top-0 -translate-y-1/2 bg-card px-1',
			},
			{
				variant: 'filled',
				isFloated: true,
				size: 'sm',
				class: 'top-0',
			},
			{
				variant: 'filled',
				isFloated: true,
				size: 'md',
				class: 'top-1',
			},
			{
				variant: 'filled',
				isFloated: true,
				size: 'lg',
				class: 'top-1.5',
			},
			{
				variant: 'standard',
				isFloated: true,
				class: 'top-0',
			},
			// Icon positioning override for underline
			{
				underline: true,
				hasIcon: true,
				class: 'left-10',
			},
		],
	},
);

const iconContainer =
	'absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-primary peer-focus:text-primary [&>svg]:size-5';

const adornmentVariants = cva(
	'flex items-center text-primary shrink-0',
	{
		variants: {
			size: {
				sm: 'text-sm',
				md: 'text-base',
				lg: 'text-lg',
			},
		},
	},
);

// New types for enhanced functionality
export type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

export type FileUploadConfig = {
	accept?: string;
	multiple?: boolean;
	maxFileSize?: number; // in bytes
	maxFiles?: number;
	allowedTypes?: string[];
	dragAndDrop?: boolean;
	showFilePreview?: boolean;
	showLoadingState?: boolean;
};

export type FileUploadState = {
	file: File;
	isUploading?: boolean;
	uploadProgress?: number; // 0-100
	uploadError?: string;
};

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'select' | 'file' | 'textarea';

type CommonInputProps = {
	/**
	 * The label for the input field.
	 */
	label?: string;
	/**
	 * An error message to display below the input.
	 */
	error?: string;
	/**
	 * Helper text to display below the input.
	 */
	helperText?: string;
	/**
	 * An icon to display at the start of the input.
	 */
	icon?: React.ReactNode;
	/**
	 * An icon to display at the end of the input.
	 */
	rightIcon?: React.ReactNode;
	/**
	 * Optional class name for the input container div.
	 */
	containerClassName?: string;
	/**
	 * Optional class name for the input wrapper div.
	 */
	wrapperClassName?: string;
	/**
	 * Whether the input should take the full width of its container.
	 */
	fullWidth?: boolean;
	/**
	 * The visual variant of the input.
	 */
	variant?: VariantProps<typeof wrapperVariants>['variant'];
	/**
	 * The size of the input.
	 */
	size?: VariantProps<typeof inputVariants>['size'];
	/**
	 * Content to display at the start of the input (e.g., a currency symbol).
	 */
	startAdornment?: React.ReactNode;
	/**
	 * Content to display at the end of the input (e.g., a unit of measurement).
	 */
	endAdornment?: React.ReactNode;
	/**
	 * Whether the label should float above the input when focused or has a value.
	 */
	floatingLabel?: boolean;
	/**
	 * The size of the floating label when it is floated.
	 */
	floatingLabelSize?: VariantProps<typeof labelVariants>['floatingLabelSize'];
	/**
	 * Custom top position for the floating label when it is floated, based on size.
	 * Accepts an object with keys 'sm', 'md', 'lg' and string values (e.g., '0.5rem').
	 */
	floatingLabelFloatedTop?: { sm?: string; md?: string; lg?: string };
	/**
	 * Whether to use an underline style instead of a full border (overrides variant border).\n\t \n\t **Note:** This prop is deprecated and will be removed in a future version. Use `variant=\"standard\"` instead.\n\t ',
	 */
	underLine?: boolean;
	/**
	 * Whether to show the password toggle icon for inputs with type="password".
	 */
	showPasswordToggle?: boolean;
	/**
	 * Custom top padding for the input element. Overrides default padding from size/variant.
	 */
	inputPaddingTop?: string;
	/**
	 * Custom bottom padding for the input element. Overrides default padding from size/variant.
	 */
	inputPaddingBottom?: string;
	/**
	 * Custom left padding for the input element. Overrides default padding from size/variant.
	 */
	inputPaddingLeft?: string;
	/**
	 * Custom right padding for the input element. Overrides default padding from size/variant.
	 */
	inputPaddingRight?: string;
	/**
	 * Custom height for the input element. Overrides default height from size.
	 */
	inputHeight?: string;

	// Enhanced functionality props
	/**
	 * The type of input to render. Supports text, email, password, select, file, and textarea.
	 */
	type?: InputType;
	/**
	 * Options for select type inputs.
	 */
	options?: SelectOption[];
	/**
	 * Callback for select value changes.
	 */
	onValueChange?: (value: string) => void;
	/**
	 * File upload configuration for file type inputs.
	 */
	fileConfig?: FileUploadConfig;
	/**
	 * Callback for file selection.
	 */
	onFileSelect?: (files: FileList | null) => void;
	/**
	 * Selected files for file type inputs.
	 */
	selectedFiles?: FileList | File[] | null;
	/**
	 * Upload states for each file (for showing loading indicators).
	 */
	fileUploadStates?: Record<string, { isUploading?: boolean; uploadProgress?: number; uploadError?: string }>;
	/**
	 * Callback when file upload state changes.
	 */
	onFileUploadStateChange?: (fileName: string, state: { isUploading?: boolean; uploadProgress?: number; uploadError?: string }) => void;
};

type InputElementProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaElementProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Base props that all input types share
type BaseInputProps = {
	className?: string;
	multiline?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
};

export type InputProps = CommonInputProps & BaseInputProps &
	(Omit<InputElementProps, 'size' | 'onChange' | 'onFocus' | 'onBlur'> | Omit<TextareaElementProps, 'size' | 'onChange' | 'onFocus' | 'onBlur'>);

const Input = React.forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputProps
>(
	(
		{
			label,
			error,
			helperText,
			icon,
			rightIcon,
			containerClassName,
			wrapperClassName,
			fullWidth,
			className,
			variant = 'outlined',
			size = 'md',
			multiline = false,
			startAdornment,
			endAdornment,
			floatingLabel = false,
			floatingLabelSize = 'sm',
			floatingLabelFloatedTop,
			underLine = false,
			required = false,
			disabled = false,
			value,
			defaultValue,
			placeholder,
			showPasswordToggle = true,
			onChange,
			onFocus,
			onBlur,
			inputPaddingTop,
			inputPaddingBottom,
			inputPaddingLeft,
			inputPaddingRight,
			inputHeight,
			// Enhanced props
			type = 'text',
			options,
			onValueChange,
			fileConfig,
			onFileSelect,
			selectedFiles,
			fileUploadStates,
			onFileUploadStateChange,
			...props
		},
		ref,
	) => {
		// Extract rows from props safely
		const rows = (props as any).rows || 4;

		// Determine if this is a textarea based on type or multiline
		const isTextarea = type === 'textarea' || multiline;
		const isSelect = type === 'select';
		const isFile = type === 'file';

		const [isFocused, setIsFocused] = React.useState(false);
		const [hasValue, setHasValue] = React.useState(
			Boolean(value) || Boolean(defaultValue) || (isFile && selectedFiles && selectedFiles.length > 0),
		);
		const [showPassword, setShowPassword] = React.useState(false);
		const [dragOver, setDragOver] = React.useState(false);

		// File upload state
		const [files, setFiles] = React.useState<File[]>([]);
		const fileInputRef = React.useRef<HTMLInputElement>(null);

		const isFloated = Boolean(floatingLabel && (isFocused || hasValue || (isSelect && value) || (isFile && files.length > 0)));
		const effectiveVariant = underLine ? 'standard' : variant;

		const handleFocus = (
			e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			setIsFocused(true);
			onFocus?.(e as any);
		};

		const handleBlur = (
			e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			setIsFocused(false);
			setHasValue(Boolean(e.target.value));
			onBlur?.(e as any);
		};

		const handleChange = (
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			setHasValue(Boolean(e.target.value));
			onChange?.(e as any);
		};

		// Select handlers
		const handleSelectValueChange = (newValue: string) => {
			setHasValue(Boolean(newValue));
			onValueChange?.(newValue);
		};

		const handleSelectOpenChange = (open: boolean) => {
			setIsFocused(open);
		};

		// File handlers
		const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFiles = e.target.files;
			if (selectedFiles) {
				const newFileArray = Array.from(selectedFiles);

				if (fileConfig?.multiple) {
					// For multiple files, append to existing files (avoid duplicates)
					const existingFileNames = files.map(f => f.name);
					const uniqueNewFiles = newFileArray.filter(file => !existingFileNames.includes(file.name));
					const updatedFiles = [...files, ...uniqueNewFiles];
					setFiles(updatedFiles);
					setHasValue(updatedFiles.length > 0);

					// Create a new FileList-like object with all files
					const dt = new DataTransfer();
					updatedFiles.forEach(file => dt.items.add(file));
					onFileSelect?.(dt.files);
				} else {
					// For single file, replace existing
					setFiles(newFileArray);
					setHasValue(newFileArray.length > 0);
					onFileSelect?.(selectedFiles);
				}

				// Clear the input value so the same file can be selected again
				e.target.value = '';
			}
		};

		const handleFileDrop = (e: React.DragEvent) => {
			e.preventDefault();
			setDragOver(false);
			const droppedFiles = e.dataTransfer.files;
			if (droppedFiles && isFile) {
				const newFileArray = Array.from(droppedFiles);

				if (fileConfig?.multiple) {
					// For multiple files, append to existing files (avoid duplicates)
					const existingFileNames = files.map(f => f.name);
					const uniqueNewFiles = newFileArray.filter(file => !existingFileNames.includes(file.name));
					const updatedFiles = [...files, ...uniqueNewFiles];
					setFiles(updatedFiles);
					setHasValue(updatedFiles.length > 0);

					// Create a new FileList-like object with all files
					const dt = new DataTransfer();
					updatedFiles.forEach(file => dt.items.add(file));
					onFileSelect?.(dt.files);
				} else {
					// For single file, replace existing
					setFiles(newFileArray);
					setHasValue(newFileArray.length > 0);
					onFileSelect?.(droppedFiles);
				}
			}
		};

		const handleDragOver = (e: React.DragEvent) => {
			e.preventDefault();
			setDragOver(true);
		};

		const handleDragLeave = () => {
			setDragOver(false);
		};

		const removeFile = (index: number) => {
			const newFiles = files.filter((_, i) => i !== index);
			setFiles(newFiles);
			setHasValue(newFiles.length > 0);
			// Create a new FileList-like object
			const dt = new DataTransfer();
			newFiles.forEach(file => dt.items.add(file));
			onFileSelect?.(dt.files);
		};

		const togglePasswordVisibility = () => setShowPassword(prev => !prev);
		const actualType = type === 'password' && showPassword ? 'text' : type;

		const PasswordToggle = (
			<button
				type="button"
				onClick={togglePasswordVisibility}
				className="text-text-400 hover:text-primary-hover transition-colors"
				aria-label={showPassword ? 'Hide password' : 'Show password'}
				disabled={disabled}
			>
				{showPassword ? <EyeOff /> : <Eye />}
			</button>
		);

		const rightContent =
			type === 'password' && showPasswordToggle
				? PasswordToggle
				: isSelect
				? <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
				: isFile
				? <Paperclip className="h-4 w-4 opacity-50 shrink-0" />
				: rightIcon
				? rightIcon
				: null;

		const Comp = isTextarea ? 'textarea' : 'input';

		const id = React.useId();

		const inlineStyles: React.CSSProperties = {
			paddingTop: inputPaddingTop,
			paddingBottom: inputPaddingBottom,
			paddingLeft: inputPaddingLeft,
			paddingRight: inputPaddingRight,
			height: inputHeight,
		};

		// Render functions for different input types
		const renderSelectContent = () => (
			<SelectPrimitive.Root
				value={value}
				defaultValue={defaultValue}
				onValueChange={handleSelectValueChange}
				onOpenChange={handleSelectOpenChange}
				disabled={disabled}
				aria-required={required}
			>
				<SelectPrimitive.Trigger
					ref={ref as any}
					className={cn(
						inputVariants({
							size,
							variant: effectiveVariant,
							floatingLabel,
							hasIcon: !!icon && !startAdornment,
							hasRightContent: false, // Don't add right padding, we handle it manually
							multiline: false,
							underline: underLine,
						}),
						'cursor-pointer [&>span]:line-clamp-1 flex items-center justify-between pr-3',
						className,
					)}
					style={inlineStyles}
				>
					<SelectPrimitive.Value
						placeholder={floatingLabel && !isFloated ? ' ' : placeholder}
						className="text-left flex-1 truncate"
					/>
					<SelectPrimitive.Icon asChild>
						<ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
					</SelectPrimitive.Icon>
				</SelectPrimitive.Trigger>

				<SelectPrimitive.Portal>
					<SelectPrimitive.Content
						className={cn(
							'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
							'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
							'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
						)}
						position="popper"
						sideOffset={4}
					>
						<SelectPrimitive.Viewport className="p-1">
							{options?.map((option) => (
								<SelectPrimitive.Item
									key={option.value}
									value={option.value}
									disabled={option.disabled}
									className={cn(
										'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
										'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
									)}
								>
									<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
										<SelectPrimitive.ItemIndicator>
											<Check className="h-4 w-4" />
										</SelectPrimitive.ItemIndicator>
									</span>
									<SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
								</SelectPrimitive.Item>
							))}
						</SelectPrimitive.Viewport>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		);

		const renderFileContent = () => (
			<div className="relative">
				<input
					ref={fileInputRef}
					type="file"
					className="sr-only"
					onChange={handleFileChange}
					accept={fileConfig?.accept}
					multiple={fileConfig?.multiple}
					disabled={disabled}
					aria-required={required}
				/>
				<div
					className={cn(
						inputVariants({
							size,
							variant: effectiveVariant,
							floatingLabel,
							hasIcon: !!icon && !startAdornment,
							hasRightContent: false, // Don't add right padding, we handle it manually
							multiline: false,
							underline: underLine,
						}),
						'cursor-pointer flex items-center justify-between pr-3',
						dragOver && 'border-primary bg-primary/5',
						className,
					)}
					style={inlineStyles}
					onClick={() => fileInputRef.current?.click()}
					onDrop={handleFileDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<span className={cn(
						'truncate flex-1',
						!files.length && !value && 'text-muted-foreground'
					)}>
						{files.length > 0
							? files.length === 1
								? files[0].name
								: `${files.length} files selected`
							: value || (floatingLabel && !isFloated ? ' ' : placeholder)
						}
					</span>
					<Paperclip className="h-4 w-4 opacity-50 shrink-0 ml-2" />
				</div>
				{files.length > 0 && fileConfig?.showFilePreview && (
					<div className="mt-2 space-y-1">
						{files.map((file, index) => {
							const uploadState = fileUploadStates?.[file.name];
							const isUploading = uploadState?.isUploading;
							const uploadProgress = uploadState?.uploadProgress;
							const uploadError = uploadState?.uploadError;

							return (
								<div key={index} className="text-xs bg-muted rounded overflow-hidden">
									<div className="flex items-center justify-between p-2">
										<span className="truncate flex-1">{file.name}</span>
										<div className="flex items-center gap-1 ml-2">
											{fileConfig?.showLoadingState && isUploading && (
												<Loader2 className="h-3 w-3 animate-spin text-primary" />
											)}
											{!isUploading && (
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														removeFile(index);
													}}
													className="text-muted-foreground hover:text-destructive"
												>
													<X className="h-3 w-3" />
												</button>
											)}
										</div>
									</div>
									{fileConfig?.showLoadingState && isUploading && typeof uploadProgress === 'number' && (
										<div className="px-2 pb-2">
											<div className="w-full bg-muted-foreground/20 rounded-full h-1">
												<div
													className="bg-primary h-1 rounded-full transition-all duration-300"
													style={{ width: `${uploadProgress}%` }}
												/>
											</div>
											<div className="text-xs text-muted-foreground mt-1">
												{uploadProgress}% uploaded
											</div>
										</div>
									)}
									{uploadError && (
										<div className="px-2 pb-2">
											<div className="text-xs text-destructive">
												Error: {uploadError}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		);

		const renderInputContent = () => (
			<Comp
				id={id}
				ref={ref as any}
				type={isTextarea ? undefined : actualType}
				rows={isTextarea ? rows : undefined}
				className={cn(
					inputVariants({
						size,
						variant: effectiveVariant,
						floatingLabel,
						hasIcon: !!icon && !startAdornment,
						hasRightContent: !!rightContent || !!endAdornment,
						multiline: isTextarea,
						underline: underLine,
					}),
					className,
				)}
				style={inlineStyles}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}
				disabled={disabled}
				aria-required={required}
				value={value}
				defaultValue={defaultValue}
				placeholder={floatingLabel && !isFloated ? ' ' : placeholder}
				aria-invalid={!!error}
			/>
		);

		return (
			<div className={cn('mb-4', fullWidth && 'w-full', containerClassName)}>
				{!floatingLabel && label && (
					<label
						htmlFor={id}
						className={cn('mb-1 block text-sm font-medium text-primary', {
							'text-destructive': !!error,
						})}
					>
						{label}
						{required && <span className="text-destructive">*</span>}
					</label>
				)}

				<div
					className={cn(
						wrapperVariants({
							variant: effectiveVariant,
							focused: isFocused,
							error: !!error,
							disabled,
							underline: underLine,
						}),
						wrapperClassName,
					)}
				>
					{icon && <div className={cn(iconContainer, 'left-3')}>{icon}</div>}
					{startAdornment && (
						<span className={cn(adornmentVariants({ size }), 'pl-3 pr-1')}>
							{startAdornment}
						</span>
					)}

					<div className="relative w-full">
						{isSelect ? renderSelectContent() : isFile ? renderFileContent() : renderInputContent()}
						{floatingLabel && label && (
							<label
								htmlFor={id}
								className={cn(
									labelVariants({
										size,
										isFloated,
										variant: effectiveVariant,
										hasIcon: !!icon && !startAdornment,
										focused: isFocused,
										error: !!error,
										underline: underLine,
										floatingLabelSize: isFloated ? floatingLabelSize : undefined,
									}),
									isFloated && floatingLabelFloatedTop?.[size!]
										? `!top-[${floatingLabelFloatedTop?.[size!]}]`
										: '',
									isFloated &&
										effectiveVariant === 'outlined' &&
										'bg-card px-1',
									isFloated && effectiveVariant === 'standard' && 'bg-transparent',
								)}
							>
								{label}
								{required && <span className="text-destructive">*</span>}
							</label>
						)}
					</div>

					{endAdornment && (
						<span className={cn(adornmentVariants({ size }), 'pr-3 pl-1')}>
							{endAdornment}
						</span>
					)}

					{rightContent && !isSelect && !isFile && (
						<div className={cn(iconContainer, 'right-3')}>{rightContent}</div>
					)}
				</div>

				{(error || helperText) && (
					<p
						className={cn(
							'mt-1.5 text-xs',
							error ? 'text-destructive' : 'text-muted-foreground',
						)}
					>
						{error || helperText}
					</p>
				)}
			</div>
		);
	},
);
Input.displayName = 'Input';

export { Input };