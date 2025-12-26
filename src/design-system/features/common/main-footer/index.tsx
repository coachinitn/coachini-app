import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/core/config/siteConfig';
import { useTypedTranslations } from '@/core/i18n/useTypedTranslations';

// Main Footer Component
interface MainFooterProps {
	className?: string;
}

// Contact Info Component
interface ContactInfoProps {
	t: (key: any) => string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ t }) => {
	const contactInfo = [
		{
			iconPath: '/icons/layout/phone-icon.svg',
			text: siteConfig.contact.phone!,
			href: `tel:${siteConfig.contact.phone!.replace(/\s/g, '')}`,
			alt: t('contact.phoneAlt')
		},
		{
			iconPath: '/icons/layout/whatsapp-icon.svg',
			text: siteConfig.contact.phone2!,
			href: `tel:${siteConfig.contact.phone2!.replace(/\s/g, '')}`,
			alt: t('contact.whatsappAlt')
		},
		{
			iconPath: '/icons/layout/email-icon.svg',
			text: siteConfig.contact.email,
			href: `mailto:${siteConfig.contact.email}`,
			alt: t('contact.emailAlt')
		},
		{
			iconPath: '/icons/layout/location-icon.svg',
			text: siteConfig.address?.street || 'Novation City - Technopole de Sousse',
			href: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address?.street || 'Novation City - Technopole de Sousse')}`,
			alt: t('contact.locationAlt')
		}
	];

	return (
		<div className=" flex justify-between items-center flex-col gap-2.5 @[870px]:flex-row @[870px]:items-start">
			{contactInfo.map((contact, index) => (
				<div
					key={index}
					className="flex justify-start items-center flex-row gap-[5px] "
				>
					<div className="w-[18px] h-[18px] flex justify-center items-center flex-row">
						<div>
							<Image
								src={contact.iconPath}
								alt={contact.alt}
								width={18}
								height={18}
								className="w-[18px] h-[18px]"
							/>
						</div>
					</div>
					<a
						href={contact.href}
						className="text-[#334155] text-sm hover:text-primary transition-colors"
						target={contact.href.startsWith('http') ? '_blank' : undefined}
						rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
					>
						{contact.text}
					</a>
				</div>
			))}
		</div>
	);
};

// Social Media Component
interface SocialMediaProps {
	t: (key: any) => string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ t }) => {
	const socialLinks = [
		{
			name: 'LinkedIn',
			href: siteConfig.socialLinks.linkedin!,
			iconPath: '/icons/layout/socials/linkedin-icon.svg',
			alt: t('social.linkedinAlt')
		},
		{
			name: 'Facebook',
			href: siteConfig.socialLinks.facebook!,
			iconPath: '/icons/layout/socials/facebook-icon.svg',
			alt: t('social.facebookAlt')
		},
		{
			name: 'Instagram',
			href: siteConfig.socialLinks.instagram!,
			iconPath: '/icons/layout/socials/instagram-icon.svg',
			alt: t('social.instagramAlt')
		},
		{
			name: 'YouTube',
			href: siteConfig.socialLinks.youtube!,
			iconPath: '/icons/layout/socials/youtube-icon.svg',
			alt: t('social.youtubeAlt')
		},
		{
			name: 'TikTok',
			href: siteConfig.socialLinks.tiktok!,
			iconPath: '/icons/layout/socials/tiktok-icon.svg',
			alt: t('social.tiktokAlt')
		}
	];

	return (
		<div className="flex justify-start items-center flex-row gap-3">
			{socialLinks.map((social, index) => (
				<a
					key={index}
					href={social.href}
					className="w-[24px] h-[24px] flex justify-center items-center flex-row text-[#334155] hover:text-primary transition-colors"
					aria-label={social.name}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						src={social.iconPath}
						alt={social.alt}
						width={20}
						height={20}
						className="w-[20px] h-[20px]"
					/>
				</a>
			))}
		</div>
	);
};

// Footer Links Component
interface FooterLinksProps {
	t: (key: any) => string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ t }) => {
	const footerLinks = [
		{ href: siteConfig.legal.termsOfService as string, label: t('links.termsAndConditions') },
		{ href: siteConfig.legal.accessibility as string, label: t('links.accessibility') },
		{ href: siteConfig.legal.privacyPolicy as string, label: t('links.privacyPolicy') }
	];

	return (
		<div className="flex justify-start items-center flex-col gap-1  @[870px]:flex-row  @[870px]:gap-8  @[870px]:items-start">
			{footerLinks.map((link, index) => (
				<Link key={index} href={link.href} className="hover:text-gray-700">
					<span className="text-[#334155] text-sm font-medium">{link.label}</span>
				</Link>
			))}
		</div>
	);
};

// Copyright Component
interface CopyrightProps {
	t: (key: any) => string;
}

const Copyright: React.FC<CopyrightProps> = ({ t }) => (
	<span className="text-[#334155] text-sm text-right font-medium">
		{t('copyright')}
	</span>
);

const MainFooter: React.FC<MainFooterProps> = ({ className = '' }) => {
	// Translations
	const t = useTypedTranslations('common.footer');

	return (
		<footer className={`@container py-8 px-4 md:px-8 bg-white ${className}`}>
			<div className="mx-auto max-w-7xl">
				<div className="space-y-2">
					{/* Contact Info and Social Media Section */}
					<div className="flex flex-col items-center justify-between pb-4 border-b border-gray-200 gap-2 @[1000px]:flex-row">
						<ContactInfo t={t} />
						<SocialMedia t={t} />
					</div>

					{/* Footer Links and Copyright Section */}
					<div className="flex flex-col items-center justify-between text-gray-500 gap-2 @[1000px]:flex-row">
						<FooterLinks t={t} />
						<Copyright t={t} />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default MainFooter;
