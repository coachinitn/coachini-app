/**
 * Changelog Listing Page
 * Displays all changelog entries with version filtering and pagination
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

import { getAllChangelogEntries } from '../../../core/content';
import { generateMetadata as generateSEOMetadata } from '../../../core/seo/metadata';
import { siteConfig } from '../../../core/config/siteConfig';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  return generateSEOMetadata({
    title: 'Changelog - Product Updates & Release Notes',
    description: 'Coachini Changelog',
    path: '/changelog',
    locale,
    type: 'website',
  });
}

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get all published changelog entries for this locale
  const changelogEntries = await getAllChangelogEntries(locale, {
    published: true,
    includePrerelease: false,
    includeYanked: false,
    sortBy: 'releaseDate',
    sortOrder: 'desc',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Changelog
          </h1>
        </div>

        {/* Changelog Entries */}
        {changelogEntries.length > 0 ? (
          <div className="space-y-8">
            {changelogEntries.map((entry) => {
              const { frontmatter, slug } = entry;
              const releaseDate = new Date(frontmatter.releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <article 
                  key={slug}
                  className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-foreground">
                        <Link 
                          href={`/changelog/${slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          v{frontmatter.version}
                        </Link>
                      </h2>
                      
                      {/* Version Type Badge */}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        frontmatter.type === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        frontmatter.type === 'minor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        frontmatter.type === 'patch' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {frontmatter.type}
                      </span>

                      {/* Breaking Change Badge */}
                      {frontmatter.breaking && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          BREAKING
                        </span>
                      )}
                    </div>
                    
                    <time className="text-sm text-muted-foreground">
                      {releaseDate}
                    </time>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {frontmatter.title}
                    </h3>
                    {frontmatter.description && (
                      <p className="text-muted-foreground">
                        {frontmatter.description}
                      </p>
                    )}
                  </div>

                  {/* Categories */}
                  {frontmatter.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
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

                  {/* Read More Link */}
                  <div className="pt-4 border-t border-border">
                    <Link 
                      href={`/changelog/${slug}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      Read full release notes →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No changelog entries found.
            </p>
          </div>
        )}

   
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return siteConfig.supportedLocales.map((locale: string) => ({
    locale,
  }));
}
