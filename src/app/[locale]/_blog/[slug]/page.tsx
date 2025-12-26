/**
 * Individual Blog Post Page
 * Displays a single blog post with MDX content
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import Image from 'next/image';
import Link from 'next/link';

// Import from new content system
import { getBlogPost, getAllBlogPosts, defaultMdxOptions } from '../../../../core/content';
import { generateArticleMetadata } from '../../../../core/seo/metadata';
import { siteConfig } from '../../../../core/config/siteConfig';
import MDXComponents from '../../../../design-system/ui/components/mdx/MDXComponents';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // Get the blog post content using new content system
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const { frontmatter } = post;

  return generateArticleMetadata({
    title: frontmatter.title,
    description: frontmatter.description || '',
    slug,
    publishedTime: frontmatter.date,
    author: frontmatter.author,
    tags: frontmatter.tags ? (Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags as string).split(',').map((tag: string) => tag.trim())) : [],
    image: frontmatter.image,
    locale,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get the blog post content using new content system
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;
  const publishDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category */}
          {frontmatter.category && (
            <div className="mb-4">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                {frontmatter.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {frontmatter.title}
          </h1>

          {/* Description */}
          {frontmatter.description && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {frontmatter.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
            {frontmatter.author && (
              <div className="flex items-center gap-2">
                <span>By</span>
                <span className="font-medium text-foreground">{frontmatter.author}</span>
              </div>
            )}
            
            <time dateTime={frontmatter.date} className="flex items-center gap-2">
              <span>Published</span>
              <span className="font-medium text-foreground">{publishDate}</span>
            </time>

            {frontmatter.readingTime && (
              <div className="flex items-center gap-2">
                <span>{frontmatter.readingTime} min read</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {frontmatter.image && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              width={800}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote
            source={content}
            components={MDXComponents}
            options={defaultMdxOptions}
          />
        </article>

        {/* Tags */}
        {frontmatter.tags && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags as string).split(',')).map((tag: string) => (
                <span
                  key={tag.trim()}
                  className="rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {frontmatter.author && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                About {frontmatter.author}
              </h3>
              <p className="text-muted-foreground">
                {frontmatter.author} is part of the Coachini team, dedicated to sharing insights and tips for personal and professional development.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              ← All Posts
            </Link>
            
            <div className="flex gap-4">
              {/* Share buttons could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allPosts = await Promise.all(
    siteConfig.supportedLocales.map(async (locale: string) => {
      const posts = await getAllBlogPosts(locale, { published: true });
      return posts.map((post) => ({
        locale,
        slug: post.slug,
      }));
    })
  );

  return allPosts.flat();
}
