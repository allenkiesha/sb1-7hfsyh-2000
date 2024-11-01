import { getSessionToken } from "@shopify/app-bridge-utils";
import { AppBridgeState, createApp } from "@shopify/app-bridge";

interface ShopifyClient {
  shop: string;
  accessToken: string;
}

class ShopifyService {
  private client: ShopifyClient | null = null;
  private app: AppBridgeState | null = null;

  initialize(config: { apiKey: string; host: string; }) {
    this.app = createApp({
      apiKey: config.apiKey,
      host: config.host,
    });
  }

  async authenticate(): Promise<void> {
    if (!this.app) {
      throw new Error('Shopify App Bridge not initialized');
    }

    try {
      const sessionToken = await getSessionToken(this.app);
      
      // Exchange session token for access token via your backend
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_token: sessionToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Shopify');
      }

      const { shop, accessToken } = await response.json();
      this.client = { shop, accessToken };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async getThemeAssets(themeId: number): Promise<any> {
    if (!this.client) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`/api/themes/${themeId}/assets`, {
        headers: {
          'Authorization': `Bearer ${this.client.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch theme assets');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching theme assets:', error);
      throw error;
    }
  }

  async updateAsset(themeId: number, key: string, value: string): Promise<void> {
    if (!this.client) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`/api/themes/${themeId}/assets`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.client.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: {
            key,
            value,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  }
}

export const shopifyService = new ShopifyService();