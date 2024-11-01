import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Shopify } from '@shopify/shopify-api';
import { shopifyAuth } from './middleware/auth';
import themeRoutes from './routes/themes';
import openaiRoutes from './routes/openai';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize Shopify API
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY || '',
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET || '',
  SCOPES: ['read_themes', 'write_themes'],
  HOST_NAME: (process.env.HOST || '').replace(/https?:\/\//, ''),
  IS_EMBEDDED_APP: true,
  API_VERSION: '2024-01'
});

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Auth endpoints
app.get('/api/auth', async (req, res) => {
  try {
    const shop = req.query.shop as string;
    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    const authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/api/auth/callback',
      false,
    );

    res.json({ authUrl: authRoute });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Failed to initiate OAuth' });
  }
});

app.get('/api/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as Record<string, string>
    );

    // After successful auth, redirect to the app with the shop parameter
    const shop = session.shop.replace('.myshopify.com', '');
    res.redirect(`/?shop=${shop}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

// Protected API routes
app.use('/api/themes', shopifyAuth, themeRoutes);
app.use('/api/openai', openaiRoutes); // OpenAI routes don't need Shopify auth

// Important: Serve static files before the catch-all route
app.use(express.static(path.join(__dirname, '../../dist')));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  // Log the request
  console.log('Catch-all route hit:', req.url);
  
  // Send the index.html file
  res.sendFile(path.join(__dirname, '../../dist/index.html'), err => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});