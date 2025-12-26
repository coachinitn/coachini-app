/**
 * Privacy Policy Page
 * Displays MDX content for the privacy policy with i18n support
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote-client/rsc';

// Import from new content system
import { getPrivacyPolicyPage, defaultMdxOptions } from '../../../core/content';
import { generateMetadata as generateSEOMetadata } from '../../../core/seo/metadata';
import { siteConfig } from '../../../core/config/siteConfig';
import MDXComponents from '../../../design-system/ui/components/mdx/MDXComponents';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  try {
    const privacyContent = await getPrivacyPolicyPage(locale);
    if (!privacyContent) {
      return generateSEOMetadata({
        title: 'Privacy Policy - Page Not Found',
        description: 'The about page could not be found.',
        path: '/privacy-policy',
        locale,
        noIndex: true,
      });
    }
    const metadata = generateSEOMetadata({
      title: privacyContent.frontmatter.title,
      description: privacyContent.frontmatter.description,
      keywords: privacyContent.frontmatter.tags,
      path: '/privacy-policy',
      locale, 
      type: 'website',
      // overrideDefaultKeywords: true,
    });
    return metadata;
  } catch (error) {
    console.error('Error loading about page content:', error);
    return generateSEOMetadata({
      title: 'About Coachini',
      description: 'Learn about Coachini and our coaching platform.',
      keywords: ['about', 'coachini', 'company', 'coaching'],
      path: '/about',
      locale,
      type: 'website',
    });
  }
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get the MDX content for this locale using new content system
  const content = await getPrivacyPolicyPage(locale);
  
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
