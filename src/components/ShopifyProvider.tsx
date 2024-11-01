import React, { createContext, useContext, useEffect, useState } from 'react';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { shopifyService } from '../services/shopify';

interface ShopifyContextType {
  isAuthenticated: boolean;
  themeAssets: any[];
  updateAsset: (themeId: number, key: string, value: string) => Promise<void>;
}

const ShopifyContext = createContext<ShopifyContextType>({
  isAuthenticated: false,
  themeAssets: [],
  updateAsset: async () => {},
});

export function ShopifyProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeAssets, setThemeAssets] = useState([]);

  useEffect(() => {
    const initializeShopify = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const host = searchParams.get('host');
      const shop = searchParams.get('shop');

      if (!host || !shop) {
        console.error('Missing required query parameters');
        return;
      }

      try {
        shopifyService.initialize({
          apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
          host: host,
        });

        await shopifyService.authenticate();
        setIsAuthenticated(true);

        // Fetch initial theme assets
        const assets = await shopifyService.getThemeAssets(
          parseInt(searchParams.get('theme_id') || '0', 10)
        );
        setThemeAssets(assets);
      } catch (error) {
        console.error('Failed to initialize Shopify:', error);
      }
    };

    initializeShopify();
  }, []);

  const updateAsset = async (themeId: number, key: string, value: string) => {
    await shopifyService.updateAsset(themeId, key, value);
    const assets = await shopifyService.getThemeAssets(themeId);
    setThemeAssets(assets);
  };

  const config = {
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
    host: new URLSearchParams(window.location.search).get('host') || '',
    forceRedirect: true,
  };

  return (
    <AppBridgeProvider config={config}>
      <ShopifyContext.Provider
        value={{
          isAuthenticated,
          themeAssets,
          updateAsset,
        }}
      >
        {children}
      </ShopifyContext.Provider>
    </AppBridgeProvider>
  );
}

export const useShopify = () => useContext(ShopifyContext);