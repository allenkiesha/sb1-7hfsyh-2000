import { Request, Response, NextFunction } from 'express';
import { Shopify } from '@shopify/shopify-api';

declare global {
  namespace Express {
    interface Request {
      shopifySession?: any;
    }
  }
}

export async function shopifyAuth(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Auth check - Headers:', {
      authorization: req.headers.authorization,
      host: req.headers.host,
      origin: req.headers.origin
    });
    console.log('Auth check - Query:', req.query);

    // First try to get session from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      console.log('Attempting token auth...');
      const token = authHeader.split(' ')[1];
      const session = await Shopify.Utils.loadCurrentSession(token);
      
      if (session) {
        console.log('Valid session found from token');
        req.shopifySession = session;
        next();
        return;
      }
      console.log('No valid session found from token');
    }

    // If no valid session from header, try query parameters
    const { shop, token } = req.query;
    if (shop && token) {
      console.log('Attempting query param auth...');
      const session = await Shopify.Utils.loadCurrentSession(token as string);
      
      if (session && session.shop === shop) {
        console.log('Valid session found from query params');
        req.shopifySession = session;
        next();
        return;
      }
      console.log('No valid session found from query params');
    }

    // If we get here, no valid authentication was found
    console.log('Auth failed - no valid authentication method found');
    res.status(401).json({ 
      error: 'Authentication required',
      message: 'No valid session found. Please ensure you are accessing through Shopify Admin.'
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}