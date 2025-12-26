/**
 * Content Debug Page
 * 
 * Debug page to test content system functionality
 */

import { setRequestLocale } from 'next-intl/server';

// Import from new content system
import { 
  getTermsOfServicePage,
  getPrivacyPolicyPage,
  getAboutPage,
  pagesContentType
} from '../../../../../core/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ContentDebugPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  let termsContent = null;
  let privacyContent = null;
  let aboutContent = null;
  let errors: string[] = [];

  try {
    termsContent = await getTermsOfServicePage(locale);
  } catch (error) {
    errors.push(`Terms of Service error: ${error}`);
  }

  try {
    privacyContent = await getPrivacyPolicyPage(locale);
  } catch (error) {
    errors.push(`Privacy Policy error: ${error}`);
  }

  try {
    aboutContent = await getAboutPage(locale);
  } catch (error) {
    errors.push(`About page error: ${error}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Content System Debug
        </h1>

        {/* Errors */}
        {errors.length > 0 && (
          <section className="mb-8 p-6 border border-red-500 rounded-lg bg-red-50 dark:bg-red-950">
            <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-4">
              Errors
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-red-600 dark:text-red-400">
                  {error}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Content Type Config */}
        <section className="mb-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Pages Content Type Config
          </h2>
          <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-4 rounded">
            {JSON.stringify({
              id: pagesContentType.id,
              directory: pagesContentType.directory,
              fileExtension: pagesContentType.fileExtension,
              basePath: pagesContentType.basePath,
            }, null, 2)}
          </pre>
        </section>

        {/* Terms of Service */}
        <section className="mb-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Terms of Service
          </h2>
          {termsContent ? (
            <div>
              <p className="text-green-600 dark:text-green-400 mb-4">✅ Content loaded successfully</p>
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Frontmatter:</h3>
                <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-4 rounded">
                  {JSON.stringify(termsContent.frontmatter, null, 2)}
                </pre>
              </div>
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Generated Keywords Test:</h3>
                <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-4 rounded">
                  {JSON.stringify(pagesContentType.seo.generateMetadata(termsContent, locale).keywords, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-red-600 dark:text-red-400">❌ Failed to load content</p>
          )}
        </section>

        {/* Privacy Policy */}
        <section className="mb-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Privacy Policy
          </h2>
          {privacyContent ? (
            <div>
              <p className="text-green-600 dark:text-green-400 mb-4">✅ Content loaded successfully</p>
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Frontmatter:</h3>
                <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-4 rounded">
                  {JSON.stringify(privacyContent.frontmatter, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-red-600 dark:text-red-400">❌ Failed to load content</p>
          )}
        </section>

        {/* About */}
        <section className="mb-8 p-6 border border-border rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            About Page
          </h2>
          {aboutContent ? (
            <div>
              <p className="text-green-600 dark:text-green-400 mb-4">✅ Content loaded successfully</p>
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Frontmatter:</h3>
                <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-4 rounded">
                  {JSON.stringify(aboutContent.frontmatter, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-red-600 dark:text-red-400">❌ Failed to load content</p>
          )}
        </section>
      </div>
    </div>
  );
}
