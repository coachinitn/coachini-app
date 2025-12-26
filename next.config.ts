import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
// import { withDesignTokens } from "./.next/plugins/design-tokens-plugin";
// import { withTranslations } from "./.next/plugins/translations-plugin";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Disable TypeScript checks during build
	typescript: {
		ignoreBuildErrors: true,
	},
	// Enable standalone output for Docker (commented out for development)
	// output: 'standalone',
	// Disable image optimization warnings
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ui-avatars.com',
				port: '',
				pathname: '/api/**',
			},
		],
	},
	webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');

// Compose plugins: Translations -> Design Tokens -> Next Intl -> Final Config
export default withNextIntl(
// 	withDesignTokens({
//   verbose: process.env.NODE_ENV === 'development',
//   createBackups: true,
//   enableWatching: process.env.DESIGN_TOKENS_WATCH !== 'false',
// })
// (withTranslations({
//   verbose: process.env.NODE_ENV === 'development',
//   createBackups: true,
//   enableWatching: process.env.TRANSLATIONS_WATCH !== 'false',
// })
// (nextConfig))
(nextConfig)
);
