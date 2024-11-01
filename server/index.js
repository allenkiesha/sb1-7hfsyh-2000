import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Shopify } from '@shopify/shopify-api';
import { shopifyAuth } from './middleware/auth.js';
import themeRoutes from './routes/themes.js';

const app = express();
const port = process.env.PORT || 3000;

// Initialize Shopify API
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ['read_themes', 'write_themes'],
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ''),
  IS_EMBEDDED_APP: true,
  API_VERSION: '2024-01'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(shopifyAuth);

// Routes
app.use('/api/themes', themeRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});