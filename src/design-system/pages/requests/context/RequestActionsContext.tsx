'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { Request, RequestStatus, DealProgress } from '../types';

// Generic action types that can be extended
export interface RequestActionHandlers {
  // Core actions
  onView: (request: Request) => void;
  onEdit: (request: Request) => void;
  onDelete: (requestId: string) => void;
  
  // Status actions
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
  
  // Business-specific actions
  onDealProgressChange?: (requestId: string, newProgress: DealProgress) => void;
  onCallStatusChange?: (requestId: string, newCallStatus: 'call-made' | 'call-not-made') => void;
  
  // Coach-specific actions
  onFileDownload?: (fileId: string, fileName: string) => void;
  
  // Generic action for extensibility
  onCustomAction?: (actionType: string, requestId: string, payload?: any) => void;
}

// Context type
interface RequestActionsContextType {
  actions: RequestActionHandlers;
  isLoading: (requestId: string, actionType?: string) => boolean;
  hasError: (requestId: string, actionType?: string) => boolean;
}

// Create context
const RequestActionsContext = createContext<RequestActionsContextType | null>(null);

// Default action implementations
const createDefaultActions = (): RequestActionHandlers => ({
  onView: (request: Request) => {
    console.log('View request:', request.id);
    toast.info(`Viewing request for ${request.user.name}`);
  },
  
  onEdit: (request: Request) => {
    console.log('Edit request:', request.id);
    toast.info(`Editing request for ${request.user.name}`);
  },
  
  onDelete: (requestId: string) => {
    console.log('Delete request:', requestId);
    toast.info('Request deleted');
  },
  
  onStatusChange: (requestId: string, newStatus: RequestStatus) => {
    console.log('Status change:', requestId, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  },
  
  onDealProgressChange: (requestId: string, newProgress: DealProgress) => {
    console.log('Deal progress change:', requestId, newProgress);
    toast.success(`Deal progress updated to ${newProgress}`);
  },
  
  onCallStatusChange: (requestId: string, newCallStatus: 'call-made' | 'call-not-made') => {
    console.log('Call status change:', requestId, newCallStatus);
    toast.success(`Call status updated to ${newCallStatus}`);
  },
  
  onFileDownload: (fileId: string, fileName: string) => {
    console.log('Download file:', fileId, fileName);
    toast.success(`Downloading ${fileName}`);
  },
  
  onCustomAction: (actionType: string, requestId: string, payload?: any) => {
    console.log('Custom action:', actionType, requestId, payload);
    toast.info(`Action ${actionType} executed`);
  },
});

// Provider props
interface RequestActionsProviderProps {
  children: ReactNode;
  customActions?: Partial<RequestActionHandlers>;
  loadingStates?: Record<string, boolean>;
  errorStates?: Record<string, string>;
}

// Provider component
export function RequestActionsProvider({
  children,
  customActions = {},
  loadingStates = {},
  errorStates = {},
}: RequestActionsProviderProps) {
  const defaultActions = createDefaultActions();
  
  // Merge default actions with custom ones
  const actions: RequestActionHandlers = {
    ...defaultActions,
    ...customActions,
  };

  const isLoading = (requestId: string, actionType?: string) => {
    const key = actionType ? `${requestId}-${actionType}` : requestId;
    return loadingStates[key] || false;
  };

  const hasError = (requestId: string, actionType?: string) => {
    const key = actionType ? `${requestId}-${actionType}` : requestId;
    return !!errorStates[key];
  };

  const contextValue: RequestActionsContextType = {
    actions,
    isLoading,
    hasError,
  };

  return (
    <RequestActionsContext.Provider value={contextValue}>
      {children}
    </RequestActionsContext.Provider>
  );
}

// Custom hook to use request actions
export function useRequestActions() {
  const context = useContext(RequestActionsContext);
  
  if (!context) {
    throw new Error('useRequestActions must be used within a RequestActionsProvider');
  }
  
  return context;
}

// Specialized hooks for different request types
export function useBusinessRequestActions() {
  const { actions, isLoading, hasError } = useRequestActions();
  
  return {
    onView: actions.onView,
    onEdit: actions.onEdit,
    onDelete: actions.onDelete,
    onStatusChange: actions.onStatusChange,
    onDealProgressChange: actions.onDealProgressChange!,
    onCallStatusChange: actions.onCallStatusChange!,
    onCustomAction: actions.onCustomAction,
    isLoading,
    hasError,
  };
}

export function useCoachRequestActions() {
  const { actions, isLoading, hasError } = useRequestActions();
  
  return {
    onView: actions.onView,
    onEdit: actions.onEdit,
    onDelete: actions.onDelete,
    onStatusChange: actions.onStatusChange,
    onFileDownload: actions.onFileDownload!,
    onCustomAction: actions.onCustomAction,
    isLoading,
    hasError,
  };
}
