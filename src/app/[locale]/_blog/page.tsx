/**
 * Blog Listing Page
 * Displays all published blog posts with pagination and filtering
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';

// Import from new content system
import { getAllBlogPosts } from '../../../core/content';
import { generateMetadata as generateSEOMetadata } from '../../../core/seo/metadata';

import { siteConfig } from '../../../core/config/siteConfig';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  return generateSEOMetadata({
    title: 'Blog - Coaching Insights & Tips',
    description: 'Discover expert coaching insights, personal development tips, and success stories from the Coachini community.',
    path: '/blog',
    locale,
    type: 'website',
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get all published blog posts for this locale using new content system
  const blogPosts = await getAllBlogPosts(locale, {
    published: true,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Separate pinned and regular posts
  const pinnedPosts = blogPosts.filter(post => post.frontmatter.pin);
  const regularPosts = blogPosts.filter(post => !post.frontmatter.pin);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Coaching Insights & Tips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover expert coaching insights, personal development tips, and success stories from the {siteConfig.name} community.
          </p>
        </div>

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
              📌 Featured Posts
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pinnedPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Latest Posts
          </h2>
          {regularPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No blog posts available yet. Check back soon for new content!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Blog post card component
interface BlogPostCardProps {
  post: any;
  featured?: boolean;
}

function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const { frontmatter, slug } = post;
  const publishDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={`group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}>
      {/* Image */}
      {frontmatter.image && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Category and Reading Time */}
        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          {frontmatter.category && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {frontmatter.category}
            </span>
          )}
          {frontmatter.readingTime && (
            <span>{frontmatter.readingTime} min read</span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`} className="stretched-link">
            {frontmatter.title}
          </Link>
        </h3>

        {/* Description */}
        {frontmatter.description && (
          <p className="mb-4 text-muted-foreground line-clamp-3">
            {frontmatter.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {frontmatter.author && (
              <span>By {frontmatter.author}</span>
            )}
          </div>
          <time dateTime={frontmatter.date}>
            {publishDate}
          </time>
        </div>

        {/* Tags */}
        {frontmatter.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags as string).split(',')).map((tag: string) => (
              <span
                key={tag.trim()}
                className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function generateStaticParams() {
  return siteConfig.supportedLocales.map((locale: string) => ({
    locale,
  }));
}
