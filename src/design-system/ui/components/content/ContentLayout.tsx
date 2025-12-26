/**
 * Content Layout Component
 * Provides consistent layout for content pages (blog posts, static pages)
 */

import React from 'react';
import Link from 'next/link';
import { cn } from '../../../../core/utils';

interface ContentLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  sidebar?: React.ReactNode;
  className?: string;
}

export function ContentLayout({
  children,
  title,
  description,
  breadcrumbs,
  sidebar,
  className,
}: ContentLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-8', className)}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {crumb.href ? (
                    <Link 
                      href={crumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header */}
        {(title || description) && (
          <header className="mb-8">
            {title && (
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xl text-muted-foreground">
                {description}
              </p>
            )}
          </header>
        )}

        {/* Main Content */}
        <div className={cn(
          'grid gap-8',
          sidebar ? 'lg:grid-cols-4' : 'grid-cols-1'
        )}>
          {/* Content */}
          <main className={cn(
            sidebar ? 'lg:col-span-3' : 'col-span-1'
          )}>
            {children}
          </main>

          {/* Sidebar */}
          {sidebar && (
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

// Content Card Component
interface ContentCardProps {
  title: string;
  description?: string;
  href: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  className?: string;
}

export function ContentCard({
  title,
  description,
  href,
  image,
  date,
  author,
  category,
  tags,
  readingTime,
  className,
}: ContentCardProps) {
  const publishDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null;

  return (
    <article className={cn(
      'group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg',
      className
    )}>
      {/* Image */}
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Category and Reading Time */}
        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          {category && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {category}
            </span>
          )}
          {readingTime && (
            <span>{readingTime} min read</span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
          <Link href={href} className="stretched-link">
            {title}
          </Link>
        </h3>

        {/* Description */}
        {description && (
          <p className="mb-4 text-muted-foreground line-clamp-3">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {author && (
              <span>By {author}</span>
            )}
          </div>
          {publishDate && (
            <time dateTime={date}>
              {publishDate}
            </time>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// Content Grid Component
interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ContentGrid({ 
  children, 
  columns = 3, 
  className 
}: ContentGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn(
      'grid gap-6',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
}

// Content Sidebar Components
export function ContentSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

export function SidebarSection({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// Table of Contents Component
interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={cn('space-y-2', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block text-sm text-muted-foreground hover:text-foreground transition-colors',
                item.level === 2 && 'pl-0',
                item.level === 3 && 'pl-4',
                item.level === 4 && 'pl-8',
                item.level >= 5 && 'pl-12'
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
