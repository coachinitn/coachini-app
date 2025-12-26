import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/core/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { ThemeProvider } from '@/core/providers/theme-provider';
import { jsonLdScriptProps } from 'react-schemaorg';
import { WebSite } from 'schema-dts';
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Viewport } from 'next';
import ConfigSidebar from '@/design-system/ui/components/ConfigSidebar';
import { ReduxProvider } from '@/core/providers/redux-provider';
// RTLProvider removed - RTL now handled server-side with <html dir={dir}>
// import { RTL_LANGUAGES } from "@/components/DirectionProvider";
import '../globals.css';
import { siteConfig } from '@/core/config/siteConfig';
import { DebugProvider } from '@/core/providers/debug-provider';
import { FontSizeDebugger } from '@/design-system/ui/components/debug/FontSizeDebugger';
import { DebugTooltip } from '@/design-system/ui/components/debug/DebugTooltip';
import { Toaster as Sonner } from '@/design-system/ui/base/sonner';
import { Toaster } from '@/design-system/ui/base/toaster';
import { TooltipProvider } from '@/design-system/ui/base/tooltip';
import { ContentLayout } from '../../design-system/ui';
import ScrollLockManager from '@/design-system/ui/components/ScrollLockManager';
import { Providers } from '@/app/providers';
import { NotificationLayout } from '@/design-system/ui/layout/notification-layout';
// SEO imports
import { generateMetadata as generateSEOMetadata } from '@/core/seo';
import { AnalyticsProvider } from '@/core/seo/analytics';
// Removed @stagewise/toolbar-next import

// Initialize content system
import '@/core/content/init';
import { AppProviders } from '../../core/providers/app-provider';


// Load Poppins font with comprehensive weights
const poppins = Poppins({
	variable: '--font-poppins',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
});

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Determine if the language is RTL
	const isRTL = siteConfig.rtlLanguages.includes(locale);
	const dir = isRTL ? 'rtl' : 'ltr';

	const t = await getTranslations({ locale, namespace: 'common.metadata' });
	return (
		<html lang={locale} dir={dir} suppressHydrationWarning>
			<head>
				{/* Enhanced SEO metadata is now handled by generateMetadata function */}
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script
					{...jsonLdScriptProps<WebSite>({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: t('title'),
						description: t('description'),
						url: 'https://coachini.com',
						inLanguage: locale,
					})}
				/>
			</head>
			<body
				className={`${poppins.variable} font-sans antialiased scroll-x-hidden`}
				suppressHydrationWarning
			>
				{/* <StagewiseToolbar
          config={{
            plugins: [], 
          }}
        /> */}
				<ThemeProvider
					attribute="class"
					defaultTheme={siteConfig.defaultNextTheme}
					enableSystem
					disableTransitionOnChange
				>
					<AppProviders>

					<Providers>
						<NextIntlClientProvider>
							<ReduxProvider>
								{/* TooltipProvider already included in AppProviders above */}
								{/* <Toaster /> */}
								{/* <Sonner /> */}
								{/* <DebugProvider> */}
										{/* <ContentLayout> */}
											{children}
											{/* </ContentLayout> */}

									{/* <ConfigSidebar /> */}
									{/* <FontSizeDebugger /> */}
									{/* <DebugTooltip /> */}

									{/* Global scroll lock manager */}
									{/* <ScrollLockManager
										disableScrollOnPaths={[
											'/dashboard',
											'/chatbox-demo',
											'/navbar-demo'
										]}
									/> */}
								{/* </DebugProvider> */}
							</ReduxProvider>
						</NextIntlClientProvider>
					</Providers>
					</AppProviders>

				</ThemeProvider>
				{/* Analytics Integration */}
				<AnalyticsProvider>
					<Analytics />
					<SpeedInsights />
				</AnalyticsProvider>
			</body>
		</html>
	);
}

export const viewport: Viewport = {
	themeColor: siteConfig.themeColors,
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'common.metadata' });

	// Use our enhanced SEO metadata system
	return generateSEOMetadata({
		title: t('title'),
		description: t('description'),
		keywords: t('keywords').split(',').map(k => k.trim()),
		path: '/',
		locale,
		type: 'website',
	});
}
