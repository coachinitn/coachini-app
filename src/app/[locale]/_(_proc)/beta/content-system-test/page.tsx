/**
 * Content System Test Page
 * 
 * Test page to verify the new modular content system is working correctly.
 * This page demonstrates the new content type registry and MDX processing.
 */

import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

// Import from new content system
import { 
  getAllBlogPosts, 
  getAllChangelogEntries,
  getRegistryStatistics,
  getContentTypeIds,
  getBlogPost,
  getChangelogEntry
} from '../../../../../core/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ContentSystemTestPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  try {
    // Test registry statistics
    const registryStats = getRegistryStatistics();
    const contentTypeIds = getContentTypeIds();

    // Test blog content
    const blogPosts = await getAllBlogPosts(locale, { limit: 3 });
    const firstBlogPost = blogPosts.length > 0 ? await getBlogPost(blogPosts[0].slug, locale) : null;

    // Test changelog content
    const changelogEntries = await getAllChangelogEntries(locale, { limit: 3 });
    const firstChangelogEntry = changelogEntries.length > 0 ? await getChangelogEntry(changelogEntries[0].slug, locale) : null;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Content System Test
          </h1>

          {/* Registry Statistics */}
          <section className="mb-8 p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Registry Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Total Content Types</h3>
                <p className="text-2xl font-bold text-primary">{registryStats.totalTypes}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Registered Types</h3>
                <div className="flex flex-wrap gap-2">
                  {contentTypeIds.map(id => (
                    <span key={id} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-foreground mb-2">Features Usage</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>Pagination: {registryStats.featuresUsage.pagination}</div>
                <div>Categories: {registryStats.featuresUsage.categories}</div>
                <div>Tags: {registryStats.featuresUsage.tags}</div>
                <div>Search: {registryStats.featuresUsage.search}</div>
                <div>Comments: {registryStats.featuresUsage.comments}</div>
              </div>
            </div>
          </section>

          {/* Blog Content Test */}
          <section className="mb-8 p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Blog Content Test
            </h2>
            <div className="mb-4">
              <p className="text-muted-foreground">
                Found {blogPosts.length} blog posts in {locale} locale
              </p>
            </div>
            
            {blogPosts.length > 0 ? (
              <div className="space-y-4">
                {blogPosts.map(post => (
                  <div key={post.slug} className="p-4 bg-muted/50 rounded">
                    <h3 className="font-medium text-foreground">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                        {post.frontmatter.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.frontmatter.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {post.frontmatter.date}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {post.frontmatter.visible}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No blog posts found</p>
            )}

            {firstBlogPost && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded">
                <h4 className="font-medium text-foreground mb-2">First Blog Post Details:</h4>
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(firstBlogPost.frontmatter, null, 2)}
                </pre>
              </div>
            )}
          </section>

          {/* Changelog Content Test */}
          <section className="mb-8 p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Changelog Content Test
            </h2>
            <div className="mb-4">
              <p className="text-muted-foreground">
                Found {changelogEntries.length} changelog entries in {locale} locale
              </p>
            </div>
            
            {changelogEntries.length > 0 ? (
              <div className="space-y-4">
                {changelogEntries.map(entry => (
                  <div key={entry.slug} className="p-4 bg-muted/50 rounded">
                    <h3 className="font-medium text-foreground">
                      <Link href={`/changelog/${entry.slug}`} className="hover:text-primary">
                        v{entry.frontmatter.version} - {entry.frontmatter.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {entry.frontmatter.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        {entry.frontmatter.type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        {entry.frontmatter.releaseDate}
                      </span>
                      {entry.frontmatter.breaking && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                          BREAKING
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {entry.frontmatter.categories.map((cat: string) => (
                        <span key={cat} className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No changelog entries found</p>
            )}

            {firstChangelogEntry && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded">
                <h4 className="font-medium text-foreground mb-2">First Changelog Entry Details:</h4>
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(firstChangelogEntry.frontmatter, null, 2)}
                </pre>
              </div>
            )}
          </section>

          {/* Navigation Links */}
          <section className="p-6 border border-border rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Test Navigation
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/blog" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                View Blog
              </Link>
              <Link 
                href="/changelog" 
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
              >
                View Changelog
              </Link>
              {blogPosts.length > 0 && (
                <Link 
                  href={`/blog/${blogPosts[0].slug}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  First Blog Post
                </Link>
              )}
              {changelogEntries.length > 0 && (
                <Link 
                  href={`/changelog/${changelogEntries[0].slug}`}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  First Changelog Entry
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Content System Test - Error
          </h1>
          <div className="p-6 border border-red-300 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error occurred while testing content system:
            </h2>
            <pre className="text-sm text-red-700 overflow-x-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
