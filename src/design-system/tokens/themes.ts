/**
 * Theme definitions
 * Contains predefined themes for the application
 */
import { ThemeDefinition, ThemeColors } from './types';

/**
 * Default light theme colors
 */
export const lightThemeColors: ThemeColors = {
	// Base colors
	background: {
		default: '#EFEFEF',
		muted: '#f9fafb',
		subtle: '#f3f4f6',
		emphasis: '#e5e7eb',
		test: '#6b7280',
		hello: '#10b981',
		page: "#FCFBF7"
	},
	foreground: {
		default: '#090203',
		muted: '#64748b',
		subtle: '#9ca3af',
		emphasis: '#84A5D2',
		chat: '#fcfbf7',
	},

	// Component colors
	card: {
		default: '#ffffff',
		foreground: '#111827',
	},

	popover: {
		default: '#ffffff',
		foreground: '#111827',
	},

	// primary: {
	// 	default: colors.gray[900],
	// 	foreground: colors.gray[50],
	// 	hover: colors.gray[800],
	// 	active: colors.gray[950],
	// },

	// secondary: {
	// 	default: colors.gray[100],
	// 	foreground: colors.gray[900],
	// 	hover: colors.gray[200],
	// 	active: colors.gray[300],
	// },
	text: {
		default: '#090203',
		muted: '#64748b',
	},
	muted: {
		default: '#f3f4f6',
		foreground: '#64748b',
	},

	accent: {
		default: '#f3f4f6',
		foreground: '#111827',
	},

	destructive: {
		default: '#ef4444',
		foreground: '#f9fafb',
	},

	border: {
		default: '#e5e7eb',
		muted: '#f3f4f6',
		emphasis: '#d1d5db',
		focus: '#3b82f6',
	},
	input: '#e5e7eb',
	ring: '#9ca3af',

	// Chart colors
	chart: {
		1: '#6b93c8',
		2: '#60a5fa',
		3: '#fbbf24',
		4: '#34d399',
		5: '#f87171',
	},

	// Sidebar specific colors
	sidebar: {
		default: '#f9fafb',
		foreground: '#111827',
		primary: '#111827',
		primaryForeground: '#f9fafb',
		accent: '#f3f4f6',
		accentForeground: '#111827',
		border: '#e5e7eb',
		ring: '#9ca3af',
	},
};

/**
 * Default dark theme colors
 */
export const darkThemeColors: ThemeColors = {
	// Base colors
	background: {
		default: '#031206',
		muted: '#111827',
		subtle: '#1f2937',
		emphasis: '#374151',
		hello: '#6b7280',
		test: '#6b7280',
		page: "#FCFBF7"

	},
	foreground: {
		default: '#f9fafb',
		muted: '#9ca3af',
		subtle: '#6b7280',
		emphasis: '#e5e7eb',
		chat: '#fcfbf7',
	},

	// Component colors
	card: {
		default: '#111827',
		foreground: '#f9fafb',
	},

	popover: {
		default: '#111827',
		foreground: '#f9fafb',
	},

	// primary: {
	// 	default: colors.gray[200],
	// 	foreground: colors.gray[900],
	// 	hover: colors.gray[300],
	// 	active: colors.gray[100],
	// },

	// secondary: {
	// 	default: colors.gray[800],
	// 	foreground: colors.gray[50],
	// },

	text: {
		default: '#f9fafb',
		muted: '#9ca3af',
	},

	muted: {
		default: '#1f2937',
		foreground: '#9ca3af',
	},

	accent: {
		default: '#1f2937',
		foreground: '#f9fafb',
	},

	destructive: {
		default: '#dc2626',
		foreground: '#f9fafb',
	},

	// Border colors
	border: {
		default: '#f9fafb1a', // 10% opacity white
		muted: '#f9fafb12', // 7% opacity white
		emphasis: '#f9fafb26', // 15% opacity white
		focus: '#3b82f6',
	},

	input: '#f9fafb26', // 15% opacity white
	ring: '#6b7280',

	// Chart colors
	chart: {
		1: '#84a5d2',
		2: '#60a5fa',
		3: '#fbbf24',
		4: '#34d399',
		5: '#f87171',
	},

	// Sidebar specific colors
	sidebar: {
		default: '#111827',
		foreground: '#f9fafb',
		primary: '#84a5d2',
		primaryForeground: '#f9fafb',
		accent: '#1f2937',
		accentForeground: '#f9fafb',
		border: '#f9fafb1a', // 10% opacity white
		ring: '#6b7280',
	},
};


/**
 * Theme definitions
 */
export const themes: ThemeDefinition[] = [
	{
		id: 'light',
		name: 'Light',
		type: 'light',
		colors: lightThemeColors,
	},
	{
		id: 'dark',
		name: 'Dark',
		type: 'dark',
		colors: darkThemeColors,
	},
	// {
	// 	id: 'high-contrast',
	// 	name: 'High Contrast',
	// 	type: 'custom',
	// 	colors: highContrastThemeColors,
	// },
	// {
	// 	id: 'flower',
	// 	name: 'Flower Theme',
	// 	type: 'custom',
	// 	colors: flowerThemeColors,
	// },
];

/**
 * Get a theme by ID
 */
export function getTheme(id: string): ThemeDefinition {
	const theme = themes.find(t => t.id === id);
	if (!theme) {
		throw new Error(`Theme with ID ${id} not found`);
	}
	return theme;
}

/**
 * Create a custom theme based on an existing theme
 */
export function createCustomTheme(
	baseThemeId: string,
	options: {
		id: string;
		name: string;
		colorOverrides: Partial<ThemeColors>;
	}
): ThemeDefinition {
	const baseTheme = getTheme(baseThemeId);
	
	return {
		id: options.id,
		name: options.name,
		type: 'custom',
		colors: {
			...baseTheme.colors,
			...options.colorOverrides
		}
	};
} 