'use client';

import React from 'react';
import { SyncBaseReadyGuard } from '@/design-system/ui/components/syncbase-ready-guard';
import { Button } from '@/design-system/ui/base/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/ui/base/card';

export default function SyncBaseSimulationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">SyncBase Ready Guard Simulation</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Normal Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Normal Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <SyncBaseReadyGuard>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ SyncBase Ready!</h3>
                  <p className="text-green-700 text-sm">
                    This content is only shown when SyncBase is fully initialized and connected.
                  </p>
                  <Button className="mt-3" size="sm">
                    Interact with SyncBase
                  </Button>
                </div>
              </SyncBaseReadyGuard>
            </CardContent>
          </Card>

          {/* Simulation Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <SyncBaseReadyGuard enableSimulation={true}>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🎯 Simulation Complete!</h3>
                  <p className="text-blue-700 text-sm">
                    If you see this, the simulation has completed its cycle.
                  </p>
                  <Button className="mt-3" size="sm" variant="outline">
                    Simulation Content
                  </Button>
                </div>
              </SyncBaseReadyGuard>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Simulation Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h4 className="font-medium">Loading State (3 seconds)</h4>
                  <p className="text-sm text-muted-foreground">Shows the fallback loading skeleton</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h4 className="font-medium">Error State (2 seconds)</h4>
                  <p className="text-sm text-muted-foreground">Shows the SyncBase error boundary</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h4 className="font-medium">Refresh State (1 second)</h4>
                  <p className="text-sm text-muted-foreground">Shows a refresh indicator</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                <div>
                  <h4 className="font-medium">Cycle Repeats</h4>
                  <p className="text-sm text-muted-foreground">Returns to loading state and repeats the cycle</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">💡 How to Use</h4>
              <p className="text-sm text-amber-700">
                Add <code className="bg-amber-100 px-1 rounded">enableSimulation={`{true}`}</code> to any SyncBaseReadyGuard 
                component to see this simulation in action. Perfect for testing loading states and error handling.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
