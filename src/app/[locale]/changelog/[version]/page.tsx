/**
 * Individual Changelog Entry Page
 * Displays a single changelog entry with full release notes
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import Link from 'next/link';

// Import from new content system
import { getChangelogEntry, getAllChangelogEntries, defaultMdxOptions } from '../../../../core/content';
import { siteConfig } from '../../../../core/config/siteConfig';
import MDXComponents from '../../../../design-system/ui/components/mdx/MDXComponents';

interface Props {
  params: Promise<{ locale: string; version: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, version } = await params;
  
  // Get the changelog entry
  const entry = await getChangelogEntry(version, locale);
  
  if (!entry) {
    return {
      title: 'Changelog Entry Not Found',
      description: 'The requested changelog entry could not be found.',
    };
  }

  const { frontmatter } = entry;

  // Use the content type's metadata generation
  const { getContentTypeConfig } = await import('../../../../core/content/registry');
  const config = getContentTypeConfig('changelog');
  
  return config.seo.generateMetadata(entry, locale);
}

export default async function ChangelogEntryPage({ params }: Props) {
  const { locale, version } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get the changelog entry
  const entry = await getChangelogEntry(version, locale);
  
  if (!entry) {
    notFound();
  }

  const { frontmatter, content } = entry;
  const releaseDate = new Date(frontmatter.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Changelog */}
        <div className="mb-8">
          <Link 
            href="/changelog" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Changelog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-foreground">
              v{frontmatter.version}
            </h1>
            
            {/* Version Type Badge */}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              frontmatter.type === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              frontmatter.type === 'minor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              frontmatter.type === 'patch' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {frontmatter.type} release
            </span>

            {/* Breaking Change Badge */}
            {frontmatter.breaking && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                BREAKING CHANGES
              </span>
            )}

            {/* Prerelease Badge */}
            {frontmatter.prerelease && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                PRERELEASE
              </span>
            )}

            {/* Yanked Badge */}
            {frontmatter.yanked && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                YANKED
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl text-foreground">
              {frontmatter.title}
            </h2>
            <time className="text-muted-foreground">
              Released on {releaseDate}
            </time>
          </div>

          {frontmatter.description && (
            <p className="text-lg text-muted-foreground mt-4">
              {frontmatter.description}
            </p>
          )}

          {/* Categories */}
          {frontmatter.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {frontmatter.categories.map((category: string) => (
                <span 
                  key={category}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    category === 'added' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    category === 'changed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    category === 'deprecated' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    category === 'removed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    category === 'fixed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    category === 'security' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote
            source={content}
            components={MDXComponents}
            options={defaultMdxOptions}
          />
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link 
              href="/changelog" 
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              ← All Releases
            </Link>
            
            <div className="flex gap-4">
              {/* Share buttons could go here */}
              <a 
                href={`https://twitter.com/intent/tweet?text=Check out Coachini v${frontmatter.version}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Share on Twitter
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allEntries = await Promise.all(
    siteConfig.supportedLocales.map(async (locale: string) => {
      const entries = await getAllChangelogEntries(locale, {
        published: true,
        includePrerelease: true, // Include prerelease for static generation
        includeYanked: false,
      });

      return entries.map((entry) => ({
        locale,
        version: entry.slug,
      }));
    })
  );

  return allEntries.flat();
}
