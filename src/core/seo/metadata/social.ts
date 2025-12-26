/**
 * Social Media Metadata Generation
 * Comprehensive social media platform support for metadata
 */

import { seoConfig } from '../seo';
import { siteConfig } from '../../config/siteConfig';

export interface SocialMetadataOptions {
  title: string;
  description: string;
  image: string;
  url: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  enableAllPlatforms?: boolean;
}

export interface SocialMetadataResult {
  twitter: {
    card: string;
    site?: string;
    creator?: string;
    title: string;
    description: string;
    images: string[];
  };
  verification: Record<string, string>;
  other: Record<string, string>;
}

/**
 * Generate comprehensive social media metadata
 */
export function generateSocialMetadata(options: SocialMetadataOptions): SocialMetadataResult {
  const {
    title,
    description,
    image,
    url,
    twitterCard = 'summary_large_image',
    enableAllPlatforms = true,
  } = options;

  const result: SocialMetadataResult = {
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [image],
    },
    verification: {},
    other: {},
  };

  // Twitter metadata
  if (siteConfig.socialLinks.twitter) {
    const twitterHandle = extractTwitterHandle(siteConfig.socialLinks.twitter);
    result.twitter.site = twitterHandle;
    result.twitter.creator = twitterHandle;
  }

  if (!enableAllPlatforms) {
    return result;
  }

  // Facebook/Meta specific metadata
  if (siteConfig.socialLinks.facebook) {
    if (siteConfig.socialPlatforms.facebookAppId) {
      result.other['fb:app_id'] = siteConfig.socialPlatforms.facebookAppId;
    }
    result.other['og:type'] = 'website';
    result.other['og:site_name'] = siteConfig.name;
    result.other['og:url'] = siteConfig.socialLinks.facebook;
  }

  // LinkedIn metadata
  if (siteConfig.socialLinks.linkedin) {
    const linkedinId = siteConfig.socialPlatforms.linkedinCompanyId || extractLinkedInId(siteConfig.socialLinks.linkedin);
    result.other['linkedin:owner'] = linkedinId;
    result.other['linkedin:url'] = siteConfig.socialLinks.linkedin;

  }

  // TikTok metadata
  if (siteConfig.socialLinks.tiktok) {
    const tiktokHandle = extractTikTokHandle(siteConfig.socialLinks.tiktok);
    if (siteConfig.socialPlatforms.tiktokAppId) {
      result.other['tiktok:app_id'] = siteConfig.socialPlatforms.tiktokAppId;
    }
    result.other['tiktok:creator'] = tiktokHandle;
  }

  // YouTube metadata
  if (siteConfig.socialLinks.youtube) {
    const youtubeChannel = siteConfig.socialPlatforms.youtubeChannelId || extractYouTubeChannel(siteConfig.socialLinks.youtube);
    result.other['youtube:channel'] = youtubeChannel;
  }

  // Pinterest metadata
  result.other['pinterest:rich_pin'] = 'true';
  result.other['pinterest:description'] = description;

  // WhatsApp sharing optimization
  result.other['whatsapp:title'] = title;
  result.other['whatsapp:description'] = description;
  result.other['whatsapp:image'] = image;

  // Telegram sharing optimization
  result.other['telegram:title'] = title;
  result.other['telegram:description'] = description;
  result.other['telegram:image'] = image;

  // Discord embed optimization
  result.other['discord:title'] = title;
  result.other['discord:description'] = description;
  result.other['discord:image'] = image;

  return result;
}

/**
 * Extract Twitter handle from URL
 */
function extractTwitterHandle(twitterUrl: string): string {
  const match = twitterUrl.match(/twitter\.com\/([^/?]+)/);
  return match ? `@${match[1]}` : '@coachini';
}

/**
 * Extract Facebook ID from URL (simplified - would need proper implementation)
 */
function extractFacebookId(facebookUrl: string): string | null {
  // This would need proper implementation based on Facebook URL structure
  // For now, return null as we'd need the actual Facebook App ID
  return null;
}

/**
 * Extract LinkedIn company/profile ID from URL
 */
function extractLinkedInId(linkedinUrl: string): string {
  const match = linkedinUrl.match(/linkedin\.com\/(?:company|in)\/([^/?]+)/);
  return match ? match[1] : 'coachini';
}

/**
 * Extract TikTok handle from URL
 */
function extractTikTokHandle(tiktokUrl: string): string {
  const match = tiktokUrl.match(/tiktok\.com\/@([^/?]+)/);
  return match ? `@${match[1]}` : '@coachini';
}

/**
 * Extract YouTube channel ID from URL
 */
function extractYouTubeChannel(youtubeUrl: string): string {
  const channelMatch = youtubeUrl.match(/youtube\.com\/channel\/([^/?]+)/);
  const userMatch = youtubeUrl.match(/youtube\.com\/@([^/?]+)/);
  const cMatch = youtubeUrl.match(/youtube\.com\/c\/([^/?]+)/);
  
  if (channelMatch) return channelMatch[1];
  if (userMatch) return userMatch[1];
  if (cMatch) return cMatch[1];
  
  return 'coachini';
}

/**
 * Generate platform-specific sharing URLs
 */
export function generateSharingUrls(options: {
  url: string;
  title: string;
  description: string;
}): Record<string, string> {
  const { url, title, description } = options;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };
}

/**
 * Get social media verification meta tags
 */
export function getSocialVerificationTags(): Record<string, string> {
  const tags: Record<string, string> = {};

  // These would typically come from environment variables or site config
  const verificationIds = {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION,
    'pinterest-site-verification': process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION,
    'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  };

  Object.entries(verificationIds).forEach(([key, value]) => {
    if (value) {
      tags[key] = value;
    }
  });

  return tags;
}
