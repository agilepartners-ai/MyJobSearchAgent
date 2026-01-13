"use client";
import React, { useEffect, useState } from 'react';

import { ReactNode } from 'react';
import ErrorBoundary from '../src/components/dashboard/ErrorBoundary';
import { ToastProvider } from '../src/components/ui/ToastProvider';
import { initializeServices } from '../src/services/initializeServices';

export function Providers({ children }: { children: ReactNode }) {
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    // Initialize all services on mount
    initializeServices()
      .then(() => {
        setServicesInitialized(true);
      })
      .catch((error) => {
        console.error('Failed to initialize services:', error);
        // Still set to true to allow app to render (with degraded functionality)
        setServicesInitialized(true);
      });
  }, []);

  // Show loading state while services initialize
  if (!servicesInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing services...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>{children}</ToastProvider>
    </ErrorBoundary>
  );
}
