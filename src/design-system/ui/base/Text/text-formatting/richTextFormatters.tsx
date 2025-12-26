import React from 'react';
import { Text } from '@/design-system/ui/base/Text';

/**
 * Type for the chunks parameter in rich text component callbacks
 * This matches the type that next-intl passes to rich component functions
 */
export type RichTextChunks = React.ReactNode;

/**
 * Creates a bold text formatter for use with next-intl rich text translation
 * @param chunks The content to be formatted
 */
export const boldFormatter = (chunks: RichTextChunks): React.ReactElement => (
  <strong>{chunks}</strong>
);

/**
 * Creates an italic text formatter for use with next-intl rich text translation
 * @param chunks The content to be formatted
 */
export const italicFormatter = (chunks: RichTextChunks): React.ReactElement => (
  <em>{chunks}</em>
);

/**
 * Creates a colored text formatter with the specified color
 * @param color CSS color value to apply
 */
export const colorFormatter = (color: string) => {
  const ColoredText = (chunks: RichTextChunks): React.ReactElement => (
    <span style={{ color }}>{chunks}</span>
  );
  ColoredText.displayName = 'ColoredText';
  return ColoredText;
};

/**
 * Creates a text formatter that applies a design system text variant
 * @param variant Text component variant to apply
 */
export const textFormatter = (variant: string) => {
  const VariantText = (chunks: RichTextChunks): React.ReactElement => (
    <Text variant={variant as any}>{chunks}</Text>
  );
  VariantText.displayName = 'VariantText';
  return VariantText;
};

/**
 * Inserts a line break in rich text
 */
export const lineBreak = (): React.ReactElement => <br />;

/**
 * Creates a hyperlink formatter with customizable href
 * @param href URL to link to
 */
export const linkFormatter = (href: string) => {
  const LinkText = (chunks: RichTextChunks): React.ReactElement => (
    <a href={href} className="text-blue-500 hover:underline">{chunks}</a>
  );
  LinkText.displayName = 'LinkText';
  return LinkText;
};

/**
 * Usage example:
 * 
 * ```tsx
 * import { useTranslations } from 'next-intl';
 * import { 
 *   boldFormatter, 
 *   colorFormatter, 
 *   lineBreak 
 * } from '@/design-system/ui/base//text-formatting/richTextFormatters';
 * 
 * function Footer() {
 *   const t = useTranslations('components.footer');
 *   
 *   return (
 *     <footer>
 *       {t.rich('copyright', {
 *         b: boldFormatter,
 *         blue: colorFormatter('blue'),
 *         br: lineBreak
 *       })}
 *     </footer>
 *   );
 * }
 * ```
 */ 