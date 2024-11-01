export interface Asset {
  key: string;
  value?: string;
  attachment?: string;
  content_type: string;
  public_url?: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface ShopifyContextType {
  isAuthenticated: boolean;
  themeId: number | null;
  themeAssets: Asset[];
  isLoading: boolean;
  error: string | null;
  refreshAssets: () => Promise<void>;
}