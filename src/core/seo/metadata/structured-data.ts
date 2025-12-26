/**
 * Structured Data (JSON-LD) Generators
 * Generate rich structured data for search engines
 */

import { seoConfig } from '../seo';
import { siteConfig, getSocialLinksArray, getContactEmail } from '../../config/siteConfig';

/**
 * Generate JSON-LD structured data for the organization
 */
export function generateOrganizationJsonLd() {
  const socialLinks = getSocialLinksArray();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    description: seoConfig.siteDescription,
    url: seoConfig.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${seoConfig.siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    email: getContactEmail(),
    sameAs: socialLinks.map((link: any) => link.url),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: siteConfig.emails.contact,
        contactType: 'customer service',
        availableLanguage: seoConfig.supportedLocales,
      },
      {
        '@type': 'ContactPoint',
        email: siteConfig.emails.support,
        contactType: 'technical support',
        availableLanguage: seoConfig.supportedLocales,
      },
    ],
    address: siteConfig.address ? {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
      postalCode: siteConfig.address.postalCode,
    } : undefined,
    foundingDate: siteConfig.company.foundingDate,
    numberOfEmployees: siteConfig.company.numberOfEmployees,
    slogan: siteConfig.tagLine,
  };
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleJsonLd(options: {
  title: string;
  description: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
  tags?: string[];
  category?: string;
}) {
  const {
    title,
    description,
    url,
    publishedTime,
    modifiedTime,
    author,
    image,
    tags = [],
    category,
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: author ? {
      '@type': 'Person',
      name: author,
    } : {
      '@type': 'Organization',
      name: seoConfig.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    image: image ? {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    } : undefined,
    keywords: tags.join(', '),
    articleSection: category,
    inLanguage: seoConfig.defaultLocale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate JSON-LD structured data for person/profile
 */
export function generatePersonJsonLd(options: {
  name: string;
  bio?: string;
  image?: string;
  url: string;
  jobTitle?: string;
  worksFor?: string;
  socialLinks?: string[];
}) {
  const {
    name,
    bio,
    image,
    url,
    jobTitle,
    worksFor,
    socialLinks = [],
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description: bio,
    url,
    image: image ? {
      '@type': 'ImageObject',
      url: image,
    } : undefined,
    jobTitle,
    worksFor: worksFor ? {
      '@type': 'Organization',
      name: worksFor,
    } : {
      '@type': 'Organization',
      name: seoConfig.siteName,
    },
    sameAs: socialLinks,
    knowsAbout: ['Coaching', 'Professional Development', 'Personal Growth'],
  };
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    description: seoConfig.siteDescription,
    url: seoConfig.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
    },
    inLanguage: seoConfig.supportedLocales,
  };
}

/**
 * Generate JSON-LD structured data for service
 */
export function generateServiceJsonLd(options: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string[];
  serviceType?: string;
}) {
  const {
    name,
    description,
    provider,
    areaServed = ['Worldwide'],
    serviceType = 'Coaching',
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider || seoConfig.siteName,
    },
    areaServed: areaServed.map(area => ({
      '@type': 'Place',
      name: area,
    })),
    serviceType,
    category: 'Professional Development',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Coaching Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Life Coaching',
            description: 'Personal development and life coaching services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Coaching',
            description: 'Professional business coaching and mentoring',
          },
        },
      ],
    },
  };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
