'use client';

import React, { useState } from 'react';
import { Input } from '@/design-system/ui/base/input-custom';

export default function FileUploadDemo() {
  const [fileUploadStates, setFileUploadStates] = useState<Record<string, { isUploading?: boolean; uploadProgress?: number; uploadError?: string }>>({});

  // Simulate file upload with progress
  const simulateFileUpload = (fileName: string) => {
    // Start upload
    setFileUploadStates(prev => ({
      ...prev,
      [fileName]: { isUploading: true, uploadProgress: 0 }
    }));

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate success or error (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          setFileUploadStates(prev => ({
            ...prev,
            [fileName]: { isUploading: false, uploadProgress: 100 }
          }));
        } else {
          setFileUploadStates(prev => ({
            ...prev,
            [fileName]: { isUploading: false, uploadError: 'Upload failed. Please try again.' }
          }));
        }
      } else {
        setFileUploadStates(prev => ({
          ...prev,
          [fileName]: { isUploading: true, uploadProgress: Math.round(progress) }
        }));
      }
    }, 300);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        // Start upload simulation for each file
        setTimeout(() => simulateFileUpload(file.name), 500);
      });
    }
  };

  const handleUploadStateChange = (fileName: string, state: { isUploading?: boolean; uploadProgress?: number; uploadError?: string }) => {
    setFileUploadStates(prev => ({
      ...prev,
      [fileName]: state
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">File Upload with Loading States Demo</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Multiple File Upload with Loading States</h2>
            <Input
              type="file"
              label="Upload Documents"
              placeholder="Select multiple files"
              helperText="Upload will start automatically after selection"
              fileConfig={{
                accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
                multiple: true,
                dragAndDrop: true,
                showFilePreview: true,
                showLoadingState: true,
              }}
              onFileSelect={handleFileSelect}
              fileUploadStates={fileUploadStates}
              onFileUploadStateChange={handleUploadStateChange}
              floatingLabel
              variant="filled"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Single File Upload</h2>
            <Input
              type="file"
              label="Upload Resume"
              placeholder="Select your resume"
              helperText="PDF, DOC, or DOCX files only"
              fileConfig={{
                accept: '.pdf,.doc,.docx',
                multiple: false,
                dragAndDrop: true,
                showFilePreview: true,
                showLoadingState: true,
              }}
              onFileSelect={handleFileSelect}
              fileUploadStates={fileUploadStates}
              onFileUploadStateChange={handleUploadStateChange}
              floatingLabel
              variant="filled"
            />
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">How to Use Loading States:</h3>
            <div className="text-sm space-y-2">
              <p><strong>1. Enable loading state:</strong> Set <code>showLoadingState: true</code> in fileConfig</p>
              <p><strong>2. Track upload states:</strong> Use <code>fileUploadStates</code> prop to control loading indicators</p>
              <p><strong>3. Update progress:</strong> Use <code>onFileUploadStateChange</code> to update upload progress</p>
              <p><strong>4. Show errors:</strong> Set <code>uploadError</code> to display error messages</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Current Upload States:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(fileUploadStates, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
