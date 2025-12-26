'use client';

import React from 'react';
import { TextExample } from '@/design-system/ui/__examples__/TextExample';
import { H1, H2, H3, Text, Paragraph, Muted } from '@/design-system/ui/base/Text';
import { cn } from '@/core/utils';
import { useTranslations } from 'next-intl';
import { useTypedTranslations } from '../../../../../core/i18n';
import { boldFormatter, colorFormatter, italicFormatter, lineBreak } from '@/design-system/ui';

export default function TextComponentDemoPage() {
  // Example of using translations with Text component
  const t = useTypedTranslations('components.footer');

  return (
		<div className="container px-4 py-8 mx-auto">
			<H1 className="mb-8">Text Component Demo</H1>

			<div className="max-w-3xl mx-auto">
				<div className="p-6 mb-8 border rounded-lg">
					<H2 className="mb-4">About the Text Component</H2>
					<Paragraph className="mb-4">
						The Text component is a versatile typography component that
						leverages the typography utility to apply consistent styling across
						the application. It supports all typography variants and can render
						as different HTML elements.
					</Paragraph>

					<H3 className="mt-6 mb-2">Available Variants:</H3>
					<div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
						<div className="p-3 border rounded">
							<Text variant="h6" className="mb-2">
								Heading Variants
							</Text>
							<ul className="ml-5 space-y-1 list-disc">
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'h1'
									</code>
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'h2'
									</code>
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'h3'
									</code>
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'h4'
									</code>
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'h5'
									</code>
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'h6'
									</code>
								</li>
							</ul>
						</div>
						<div className="p-3 border rounded">
							<Text variant="h6" className="mb-2">
								Text Variants
							</Text>
							<ul className="ml-5 space-y-1 list-disc">
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'p'
									</code>{' '}
									- Standard paragraph
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'lead'
									</code>{' '}
									- Lead paragraph
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'large'
									</code>{' '}
									- Large text
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'small'
									</code>{' '}
									- Small text
								</li>
								<li>
									<code className="px-1 bg-secondary text-secondary-foreground">
										'muted'
									</code>{' '}
									- Muted text
								</li>
							</ul>
						</div>
					</div>

					<H3 className="mt-6 mb-2">Key Features:</H3>
					<ul className="ml-5 space-y-2 list-disc">
						<li>
							<Text as="span">
								Supports all typography variants with proper TypeScript typing
							</Text>
						</li>
						<li>
							<Text as="span">
								Can render as different HTML elements (h1-h6, p, span, div,
								label)
							</Text>
						</li>
						<li>
							<Text as="span">
								Accepts typography overrides for fine-grained control
							</Text>
						</li>
						<li>
							<Text as="span">Supports text truncation</Text>
						</li>
						<li>
							<Text as="span">
								Includes composition helper components for common typography
								needs
							</Text>
						</li>
					</ul>
				</div>

				<div className="p-6 border rounded-lg">
					<H2 className="mb-6">Examples</H2>
					<TextExample />
				</div>

				<div className="p-6 mt-8 border rounded-lg">
					<H2 className="mb-4">Rich Text with Translations</H2>
					<Paragraph className="mb-4">
						Example of using typed translations with rich text formatting:
					</Paragraph>

					<div className="p-4 border rounded-md">
						<div className="mb-4">
							<H3 className="mb-2">Basic Rich Text</H3>
							<Text as="div" variant="p" className="mb-2">
								{t.rich('copyright', {
									b: boldFormatter,
								})}
							</Text>
							<Text as="div" variant="small" className="text-muted-foreground">
								Uses typed formatters to avoid TypeScript errors
							</Text>
						</div>

						<div className="mb-4">
							<H3 className="mb-2">Advanced Rich Text</H3>
							<Text as="div" variant="p">
								{t.rich('copyright2', {
									// b: boldFormatter,
									i: italicFormatter,
									blue: colorFormatter('blue'),
									br: lineBreak,
									highlight: () => boldFormatter('p'),
									b: (chunks) => <strong>{chunks}</strong>,
								})}
							</Text>
						</div>
					</div>

					<Muted className="mt-4">
						Use the helper functions imported from '@/design-system/ui/base//text-formatting/richTextFormatters'
						for proper typing.
					</Muted>
				</div>

				<div className="p-6 mt-8 border rounded-lg">
					<H2 className="mb-4">Usage</H2>

					<H3 className="mt-6 mb-2">Base Component</H3>
					<div className="mb-4 overflow-x-auto">
						<pre className="p-4 rounded-md bg-secondary/20">
							<code>{`import { Text } from '@/design-system/ui/base/';

// Basic usage
<Text variant="h1">Heading 1</Text>
<Text variant="p">Regular paragraph text</Text>
<Text variant="lead">Lead paragraph text</Text>

// Change the rendered element
<Text variant="h3" as="div">Heading styled as a div</Text>

// With typography overrides
<Text 
  variant="p" 
  overrides={{ 
    fontSize: 'text-xl',
    fontWeight: 'font-bold' 
  }}
>
  Paragraph with custom styling
</Text>

// Truncated text
<Text variant="p" truncate>
  Long text that will be truncated...
</Text>`}</code>
						</pre>
					</div>

					<H3 className="mt-6 mb-2">Composition Helpers</H3>
					<Paragraph className="mb-3">
						For cleaner and more semantic code, you can use the composition
						helpers:
					</Paragraph>
					<div className="mb-4 overflow-x-auto">
						<pre className="p-4 rounded-md bg-secondary/20">
							<code>{`import { H1, H2, Paragraph, Lead, Small, Muted, Label } from '@/design-system/ui/base/';

// Heading components
<H1>Page Title</H1>
<H2>Section Title</H2>

// Text components
<Paragraph>Standard paragraph text without having to specify variant="p"</Paragraph>
<Lead>Lead paragraph for introductions</Lead>
<Small>Smaller text for less emphasis</Small>
<Muted>Muted text for secondary information</Muted>

// Form label
<Label htmlFor="input-id">Form label</Label>

// These components still support all Text props
<H2 className="text-blue-600" as="div">
  Customized heading with additional classes
</H2>`}</code>
						</pre>
					</div>

					<H3 className="mt-6 mb-2">With Rich Text Translations</H3>
					<div className="mb-4 overflow-x-auto">
						<pre className="p-4 rounded-md bg-secondary/20">
							<code>{`import { useTranslations } from 'next-intl';
import { boldFormatter, italicFormatter, colorFormatter, lineBreak } from '@/design-system/ui/base//text-formatting/richTextFormatters';
import { Text } from '@/design-system/ui/base/';

// In your component:
const t = useTranslations('components.footer');

// Simple example
<Text as="div" variant="p">
  {t.rich('copyright', {
    b: boldFormatter
  })}
</Text>

// Advanced example with multiple formatters
<Text as="div" variant="p">
  {t.rich('copyright2', {
    b: boldFormatter,
    i: italicFormatter,
    blue: colorFormatter('blue'),
    br: lineBreak
  })}
</Text>`}</code>
						</pre>
					</div>

					<Muted className="mt-4">
						The composition helpers provide a more intuitive API while
						maintaining all the flexibility of the base Text component.
					</Muted>
				</div>
			</div>
		</div>
	);
} 