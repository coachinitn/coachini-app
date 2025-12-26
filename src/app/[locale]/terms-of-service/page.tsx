/**
 * Terms of Service Page
 * Displays MDX content for the terms of service with i18n support
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

// Import from new content system
import { getTermsOfServicePage, defaultMdxOptions } from '../../../core/content';
import { generateMetadata as generateSEOMetadata } from '../../../core/seo/metadata';
import { siteConfig } from '../../../core/config/siteConfig';
import MDXComponents from '../../../design-system/ui/components/mdx/MDXComponents';

interface Props {
  params: Promise<{ locale: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  try {
    const content = await getTermsOfServicePage(locale);
    if (!content) {
      return generateSEOMetadata({
        title: 'Terms of Service - Page Not Found',
        description: 'The terms of service page could not be found.',
        path: '/terms-of-service',
        locale,
        noIndex: true,
      });
    }
    const metadata = generateSEOMetadata({
      title: content.frontmatter.title,
      description: content.frontmatter.description,
      keywords: content.frontmatter.tags,
      path: '/terms-of-service',
      locale, 
      type: 'website',
    });
    return metadata;
  } catch (error) {
    console.error('Error loading about page content:', error);
    return generateSEOMetadata({
      title: 'Terms of Service',
      description: 'Learn about Coachini and our coaching platform.',
      keywords: ['terms of service', 'coachini', 'company', 'coaching'],
      path: '/terms-of-service',
      locale,
      type: 'website',
    });
  }
}

export default async function TermsOfServicePage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get the MDX content for this locale using new content system
  const content = await getTermsOfServicePage(locale);
  
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
