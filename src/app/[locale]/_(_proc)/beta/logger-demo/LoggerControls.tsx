'use client';

import React, { useState } from 'react';
import { toggleLogging, logServerAction, configureLoggingDestinations } from '@/core/logger/server';
import { H3 } from '@/design-system/ui/base/Text';

// Predefined categories to toggle
const LOG_CATEGORIES = [
  'auth',
  'auth:login',
  'auth:signup',
  'api',
  'db',
  'theme'
];

export default function LoggerControls() {
  const [status, setStatus] = useState<string | null>(null);
  const [logMessage, setLogMessage] = useState('Test log message');
  const [logCategory, setLogCategory] = useState('auth');
  const [logContext, setLogContext] = useState('');
  const [logLevel, setLogLevel] = useState<'debug' | 'info' | 'warn' | 'error'>('info');
  const [disabledCategories, setDisabledCategories] = useState<string[]>([]);
  const [loggingDestinations, setLoggingDestinations] = useState({
    console: true,
    file: true
  });

  // Toggle a category on/off
  const handleToggleCategory = async (category: string) => {
    try {
      const isCurrentlyEnabled = !disabledCategories.includes(category);
      const result = await toggleLogging(category, !isCurrentlyEnabled);
      
      if (result.success) {
        setDisabledCategories(prev => 
          isCurrentlyEnabled 
            ? [...prev, category] 
            : prev.filter(c => c !== category)
        );
        
        setStatus(`${category} logging ${isCurrentlyEnabled ? 'disabled' : 'enabled'}`);
      }
    } catch (error) {
      console.error('Error toggling category:', error);
      setStatus('Error toggling category');
    }
  };

  // Toggle logging destinations
  const handleToggleDestination = async (destination: 'console' | 'file') => {
    try {
      const newValue = !loggingDestinations[destination];
      const options = { ...loggingDestinations, [destination]: newValue };
      
      const result = await configureLoggingDestinations(options);
      
      if (result.success) {
        setLoggingDestinations(options);
        setStatus(`${destination} logging ${newValue ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error(`Error toggling ${destination} logging:`, error);
      setStatus(`Error toggling ${destination} logging`);
    }
  };

  // Send a test log
  const handleSendLog = async () => {
    try {
      const result = await logServerAction({
        category: logCategory,
        context: logContext,
        message: logMessage,
        level: logLevel,
        meta: { source: 'logger-demo', timestamp: new Date().toISOString() }
      });
      
      if (result.success) {
        setStatus(`Log sent at ${result.timestamp} to category: ${result.fullCategory}`);
      } else if (result.error) {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending log:', error);
      setStatus('Error sending log');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <H3 className="mb-2">Toggle Categories</H3>
        <div className="flex flex-wrap gap-2">
          {LOG_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleToggleCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                disabledCategories.includes(category)
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {category} {disabledCategories.includes(category) ? '(Off)' : '(On)'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <H3 className="mb-2">Logging Destinations</H3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleToggleDestination('console')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              loggingDestinations.console
                ? 'bg-green-600 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Console {loggingDestinations.console ? '(On)' : '(Off)'}
          </button>
          <button
            onClick={() => handleToggleDestination('file')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              loggingDestinations.file
                ? 'bg-green-600 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            File {loggingDestinations.file ? '(On)' : '(Off)'}
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <H3 className="mb-2">Send Test Log</H3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="logCategory" className="block text-sm font-medium mb-1">
                Category
              </label>
              <input
                type="text"
                id="logCategory"
                value={logCategory}
                onChange={(e) => setLogCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="logContext" className="block text-sm font-medium mb-1">
                Context (Optional)
              </label>
              <input
                type="text"
                id="logContext"
                value={logContext}
                onChange={(e) => setLogContext(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. login, signup"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="logMessage" className="block text-sm font-medium mb-1">
              Message
            </label>
            <input
              type="text"
              id="logMessage"
              value={logMessage}
              onChange={(e) => setLogMessage(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="logLevel" className="block text-sm font-medium mb-1">
              Log Level
            </label>
            <select
              id="logLevel"
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value as any)}
              className="w-full p-2 border rounded-md"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <button
            onClick={handleSendLog}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Send Log
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          {status}
        </div>
      )}
    </div>
  );
} 