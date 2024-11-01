import { Router } from 'express';
import { Shopify } from '@shopify/shopify-api';

const router = Router();

// Get theme assets
router.get('/:themeId/assets', async (req, res) => {
  try {
    const { themeId } = req.params;
    const client = new Shopify.Clients.Rest(
      req.shopifySession.shop,
      req.shopifySession.accessToken
    );

    const response = await client.get({
      path: `themes/${themeId}/assets`,
    });

    res.json(response.body);
  } catch (error) {
    console.error('Error fetching theme assets:', error);
    res.status(500).json({ error: 'Failed to fetch theme assets' });
  }
});

// Update theme asset
router.put('/:themeId/assets', async (req, res) => {
  try {
    const { themeId } = req.params;
    const { key, value } = req.body.asset;

    const client = new Shopify.Clients.Rest(
      req.shopifySession.shop,
      req.shopifySession.accessToken
    );

    const response = await client.put({
      path: `themes/${themeId}/assets`,
      data: {
        asset: {
          key,
          value,
        },
      },
    });

    res.json(response.body);
  } catch (error) {
    console.error('Error updating theme asset:', error);
    res.status(500).json({ error: 'Failed to update theme asset' });
  }
});

export default router;