import { Shopify } from '@shopify/shopify-api';

export async function shopifyAuth(req, res, next) {
  try {
    // Get the session token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the session token
    const session = await Shopify.Utils.loadCurrentSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Add the session to the request object
    req.shopifySession = session;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}