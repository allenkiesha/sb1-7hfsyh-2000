import React, { createContext, useContext, useState, useEffect } from 'react';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';

interface Asset {
  key: string;
  value?: string;
  attachment?: string;
  content_type: string;
  public_url?: string;
  size: number;
  created_at: string;
  updated_at: string;
}

interface ShopifyContextType {
  isAuthenticated: boolean;
  themeId: number | null;
  themeAssets: Asset[];
  isLoading: boolean;
  error: string | null;
  refreshAssets: () => Promise<void>;
}

const ShopifyContext = createContext<ShopifyContextType>({
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
    error: null as string | null
  });

  // Get app configuration from URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const host = searchParams.get('host');
  const shop = searchParams.get('shop');
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

  // App Bridge configuration
  const config = {
    apiKey: apiKey || '',
    host: host || '',
    forceRedirect: true
  };

  useEffect(() => {
    const initializeShopify = async () => {
      try {
        // If we don't have required parameters, redirect to auth
        if (!shop || !host) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Missing required parameters'
          }));
          return;
        }

        if (!apiKey) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Missing Shopify API key'
          }));
          return;
        }

        // Check if we're authenticated
        const response = await fetch('/api/auth/check', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Authentication required');
        }

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
      } catch (error) {
        console.error('Failed to initialize Shopify:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize'
        }));
      }
    };

    initializeShopify();
  }, [shop, host, apiKey]);

  const refreshAssets = async () => {
    if (!state.themeId) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`/api/themes/${state.themeId}/assets`);
      if (!response.ok) throw new Error('Failed to fetch theme assets');
      
      const data = await response.json();
      setState(prev => ({
        ...prev,
        themeAssets: data.assets,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh assets'
      }));
    }
  };

  return (
    <AppBridgeProvider config={config}>
      <ShopifyContext.Provider value={{ ...state, refreshAssets }}>
        {children}
      </ShopifyContext.Provider>
    </AppBridgeProvider>
  );
}

export const useShopify = () => useContext(ShopifyContext);