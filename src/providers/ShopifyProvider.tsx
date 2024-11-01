import React, { createContext, useState, useEffect } from 'react';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { ShopifyContextType, Asset } from '../types/shopify';

export const ShopifyContext = createContext<ShopifyContextType>({
  isAuthenticated: false,
  themeId: null,
  themeAssets: [],
  isLoading: true,
  error: null,
  refreshAssets: async () => {}
});

export function ShopifyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isAuthenticated: false,
    themeId: null as number | null,
    themeAssets: [] as Asset[],
    isLoading: true,
    error: null as string | null,
  });

  // Get URL params without decoding
  const params = new URLSearchParams(window.location.search);
  const host = params.get('host');
  const shop = params.get('shop');
  
  // IMPORTANT: Only initialize AppBridge if we have the required parameters
  if (!host || !shop) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Access Error</h2>
          <p className="text-gray-600 mb-4">
            This app must be accessed through the Shopify Admin panel.
          </p>
        </div>
      </div>
    );
  }

  // AppBridge configuration
  const config = {
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '',
    host: host,
    forceRedirect: true
  };

  useEffect(() => {
    const initializeShopify = async () => {
      try {
        // Check authentication status
        const response = await fetch('/api/auth/check', {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Shop-Domain': shop
          }
        });

        if (!response.ok) {
          // Need to authenticate
          const authResponse = await fetch(`/api/auth?shop=${encodeURIComponent(shop)}`);
          const { authUrl } = await authResponse.json();
          
          if (authUrl) {
            console.log('Redirecting to auth:', authUrl);
            window.location.href = authUrl;
            return;
          }
          
          throw new Error('Failed to get auth URL');
        }

        // Successfully authenticated
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

      } catch (error) {
        console.error('Shopify initialization error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize app'
        }));
      }
    };

    initializeShopify();
  }, [shop]);

  return (
    <AppBridgeProvider config={config}>
      <ShopifyContext.Provider value={{ ...state, refreshAssets: async () => {} }}>
        {children}
      </ShopifyContext.Provider>
    </AppBridgeProvider>
  );
}