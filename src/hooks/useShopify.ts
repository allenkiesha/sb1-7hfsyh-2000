import { useContext } from 'react';
import { ShopifyContext } from '../providers/ShopifyProvider';

export const useShopify = () => useContext(ShopifyContext);