/**
 * Robots.txt Configuration
 * Controls search engine crawling and indexing behavior
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/core/config/siteConfig';
import { getAllBlockedRoutes } from '@/core/seo/routes';

/**
 * Generate robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  const blockedRoutes = getAllBlockedRoutes();
  const siteUrl = siteConfig.url;

  if (process.env.NODE_ENV === 'development' || !siteConfig.seo.robotsPolicy.index) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  const robotsConfig: MetadataRoute.Robots = {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: blockedRoutes,
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };


  return robotsConfig;
}

/**
 * Helper function to get the robots.txt content as string
 * Useful for debugging or custom implementations
 */
export function getRobotsContent(): string {
  const config = robots();
  let content = '';

  if (Array.isArray(config.rules)) {
    config.rules.forEach(rule => {
      content += `User-agent: ${rule.userAgent}\n`;
      
      if (rule.allow) {
        if (Array.isArray(rule.allow)) {
          rule.allow.forEach(path => content += `Allow: ${path}\n`);
        } else {
          content += `Allow: ${rule.allow}\n`;
        }
      }
      
      if (rule.disallow) {
        if (Array.isArray(rule.disallow)) {
          rule.disallow.forEach(path => content += `Disallow: ${path}\n`);
        } else {
          content += `Disallow: ${rule.disallow}\n`;
        }
      }
      
      if (rule.crawlDelay) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }
      
      content += '\n';
    });
  } else {
    const rule = config.rules;
    content += `User-agent: ${rule.userAgent}\n`;
    
    if (rule.allow) {
      if (Array.isArray(rule.allow)) {
        rule.allow.forEach(path => content += `Allow: ${path}\n`);
      } else {
        content += `Allow: ${rule.allow}\n`;
      }
    }
    
    if (rule.disallow) {
      if (Array.isArray(rule.disallow)) {
        rule.disallow.forEach(path => content += `Disallow: ${path}\n`);
      } else {
        content += `Disallow: ${rule.disallow}\n`;
      }
    }
    
    if (rule.crawlDelay) {
      content += `Crawl-delay: ${rule.crawlDelay}\n`;
    }
  }

  if (config.sitemap) {
    content += `\nSitemap: ${config.sitemap}\n`;
  }

  if (config.host) {
    content += `Host: ${config.host}\n`;
  }

  return content;
}
