/**
 * About Page
 * Displays MDX content for the about page with i18n support
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

// Import from new content system
import { getAboutPage, defaultMdxOptions, getAccessibilityPage } from '../../../core/content';
import { generateMetadata as generateSEOMetadata } from '../../../core/seo/metadata';
import { siteConfig } from '../../../core/config/siteConfig';
import MDXComponents from '../../../design-system/ui/components/mdx/MDXComponents';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  try {
    const content = await getAccessibilityPage(locale);
    if (!content) {
      return generateSEOMetadata({
        title: 'Accessibility - Page Not Found',
        description: 'The about page could not be found.',
        path: '/accessibility',
        locale,
        noIndex: true,
      });
    }
    const metadata = generateSEOMetadata({
      title: content.frontmatter.title,
      description: content.frontmatter.description,
      keywords: content.frontmatter.tags,
      path: '/accessibility',
      locale, 
      type: 'website',
      overrideDefaultKeywords: true
    });
    return metadata;
  } catch (error) {
    console.error('Error loading about page content:', error);
    return generateSEOMetadata({
      title: 'Accessibility Coachini',
      description: 'Learn about Coachini and our coaching platform.',
      keywords: ['accessibility', 'coachini', 'company', 'coaching'],
      path: '/accessibility',
      locale,
      type: 'website',
    });
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get the MDX content for this locale using new content system
  const content = await getAccessibilityPage(locale);

  if (!content) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote
            source={content.content}
            components={MDXComponents}
            options={defaultMdxOptions}
          />
        </article>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return siteConfig.supportedLocales.map((locale: string) => ({
    locale,
  }));
}
