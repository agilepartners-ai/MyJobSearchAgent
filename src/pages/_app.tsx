import { Provider } from 'react-redux';
import { store, persistor } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { ToastProvider } from '../components/ui/ToastProvider';
import { initializeServices } from '../services/initializeServices';
import '../index.css';
import '../styles/dashboard-responsive.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    // Initialize all services on app mount
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
