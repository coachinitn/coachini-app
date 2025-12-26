'use client';

import React from 'react';
import { Button } from '@/design-system/ui/base/button';
import { DemoRequestModal } from './DemoRequestModal';
import { DemoRequestType } from '@/lib/api/demo/demo-request.types';

const DemoRequestTestPage = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-8">Demo Request Modal Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Business Demo Request</h2>
        <p className="text-gray-600">For coachees/businesses who want coaching services</p>
        <DemoRequestModal requestType={DemoRequestType.BUSINESS}>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
            Request Business Demo
          </Button>
        </DemoRequestModal>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Coach Demo Request</h2>
        <p className="text-gray-600">For coaches who want to join the platform</p>
        <DemoRequestModal requestType={DemoRequestType.COACH}>
          <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white">
            Request Coach Demo
          </Button>
        </DemoRequestModal>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Role Selector Demo Request</h2>
        <p className="text-gray-600">Shows role selection modal first, then appropriate form</p>
        <DemoRequestModal showRoleSelector={true}>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
            Request Demo (Choose Role)
          </Button>
        </DemoRequestModal>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click "Request Business Demo" to see the business form (company info, job title, etc.)</li>
          <li>Click "Request Coach Demo" to see the coach form (experience, expertise, resume upload, etc.)</li>
          <li>Both forms should have 2 steps and show appropriate fields</li>
          <li>Form validation should work for both types</li>
        </ul>
      </div>
    </div>
  );
};

export default DemoRequestTestPage;
