import React from 'react';
import { logServerAction, mockLoginWithLogging, toggleLogging } from '@/core/logger/server';
import LoggerControls from './LoggerControls';
import { H1, Paragraph, H2 } from '@/design-system/ui/base/Text';

export const metadata = {
  title: 'Logger Demo',
};

export default async function LoggerDemoPage() {
  // Generate some initial server logs
  await logServerAction({
    category: 'logger-demo',
    message: 'Logger demo page loaded',
    level: 'info'
  });
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <H1>Server Logger Demonstration</H1>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <Paragraph className="mb-4">
          This page demonstrates the server-side logger with category-based organization.
          Check the server console and the logs directory to see the logged messages.
        </Paragraph>
        
        <LoggerControls />
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <H2 className="mb-4">Environment Variables Configuration</H2>
        
        <div className="space-y-4">
          <Paragraph>
            To disable both console and file logging using environment variables, create a <code className="bg-muted px-1.5 py-0.5 rounded">.env</code> file 
            in your project root with these settings:
          </Paragraph>
          
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`# Disable all logging
LOGGING_ENABLED=false

# Or disable specific transports
LOG_CONSOLE=false
LOG_FILE=false

# Or set log level to NONE
LOG_LEVEL=none`}
            </pre>
          </div>
          
          <Paragraph>
            You can also selectively enable logging for specific features:
          </Paragraph>
          
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`# Only log auth and api categories
LOG_FEATURES=auth,api

# Log everything (default if not specified)
LOG_FEATURES=*`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <H2 className="mb-4">Logger Implementation Details</H2>
        
        <div className="space-y-4">
          <Paragraph>
            The logger has been implemented with the following features:
          </Paragraph>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Different log levels (DEBUG, INFO, WARN, ERROR)</li>
            <li>Category-based organization with hierarchical namespace (e.g., auth:login)</li>
            <li>Selective enabling/disabling of specific categories</li>
            <li>Console output with appropriate coloring</li>
            <li>File logging with category-based directory structure</li>
            <li>Date-based subdirectories for organized logs</li>
            <li>Log file rotation when size limit is reached</li>
            <li>Server-side only to avoid client-side bundle size increase</li>
            <li>Environment variable configuration for production deployments</li>
          </ul>
          
          <Paragraph className="mt-4">
            Log files are saved in the <code className="bg-muted px-1.5 py-0.5 rounded">/logs</code> directory by default,
            with subdirectories for each category and date.
          </Paragraph>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <H2 className="mb-4">Usage Examples</H2>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`// Basic usage
import { createLogger } from '@/core/logger';

const logger = createLogger('auth');
logger.info('User authenticated', { userId: '123' });

// With context
const signupLogger = logger.context('signup');
signupLogger.debug('Signup process started');

// Disable specific category
import { setLoggerEnabled } from '@/core/logger';
setLoggerEnabled('auth', false); // Disable all auth logs`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 