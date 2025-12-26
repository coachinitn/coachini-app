/**
 * Themes API Types
 *
 * TypeScript interfaces for theme operations
 */

export interface ThemeColor {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  [key: string]: string | undefined;
}

export interface ThemeSettings {
  colors: ThemeColor;
  typography?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
  };
  spacing?: {
    unit?: number;
    scale?: number[];
  };
  borderRadius?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  shadows?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  customCss?: string;
}

export interface ThemeImage {
  id: string;
  url: string;
  type: 'banner' | 'thumbnail' | 'gallery';
  category?: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  settings: ThemeSettings;
  images?: ThemeImage[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  usageCount: number;
}

export interface ThemeCreateDto {
  name: string;
  description?: string;
  status?: 'draft' | 'published';
  isPublic?: boolean;
  settings: Partial<ThemeSettings>;
}

export interface ThemeUpdateDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
  settings?: Partial<ThemeSettings>;
}
