export const mockShopifyData = {
  shop: {
    name: 'Demo Store',
    email: 'support@demo-store.com',
    description: 'Welcome to our demo store',
    money_format: '${{amount}}',
    currency: 'USD'
  },
  product_image_placeholder: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  sections: {
    announcement: {
      settings: {
        enable_announcement: true,
        announcement_text: "Our holiday sale is on! Get up to 50% off on selected items!",
        button_text: "Shop Now",
        button_url: "#"
      }
    },
    featured_products: {
      settings: {
        title: "Featured Products",
        products: [
          {
            id: 1,
            title: 'Premium Wireless Headphones',
            handle: 'premium-wireless-headphones',
            price: 29999,
            url: '/products/premium-wireless-headphones',
            featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            available: true
          },
          {
            id: 2,
            title: 'Smart Watch Pro',
            handle: 'smart-watch-pro',
            price: 39999,
            url: '/products/smart-watch-pro',
            featured_image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
            available: true
          }
        ]
      }
    }
  },
  collection: {
    title: 'Featured Collection',
    products: [
      {
        id: 1,
        title: 'Premium Wireless Headphones',
        handle: 'premium-wireless-headphones',
        price: 29999,
        url: '/products/premium-wireless-headphones',
        featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
        ],
        variants: [
          { id: 1, title: 'Black', price: 29999, available: true },
          { id: 2, title: 'White', price: 29999, available: true }
        ],
        available: true,
        description: 'High-quality wireless headphones with noise cancellation'
      },
      {
        id: 2,
        title: 'Smart Watch Pro',
        handle: 'smart-watch-pro',
        price: 39999,
        url: '/products/smart-watch-pro',
        featured_image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
        images: [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
        ],
        variants: [
          { id: 3, title: 'Space Gray', price: 39999, available: true },
          { id: 4, title: 'Silver', price: 39999, available: true }
        ],
        available: true,
        description: 'Advanced smartwatch with health tracking features'
      }
    ]
  },
  collections: {
    all: {
      title: 'All Products',
      products: [
        {
          id: 1,
          title: 'Premium Wireless Headphones',
          handle: 'premium-wireless-headphones',
          price: 29999,
          featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
          ],
          variants: [
            { id: 1, title: 'Black', price: 29999, available: true },
            { id: 2, title: 'White', price: 29999, available: true }
          ],
          available: true,
          description: 'High-quality wireless headphones with noise cancellation'
        },
        {
          id: 2,
          title: 'Smart Watch Pro',
          handle: 'smart-watch-pro',
          price: 39999,
          featured_image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
          images: [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
          ],
          variants: [
            { id: 3, title: 'Space Gray', price: 39999, available: true },
            { id: 4, title: 'Silver', price: 39999, available: true }
          ],
          available: true,
          description: 'Advanced smartwatch with health tracking features'
        }
      ]
    },
    featured: {
      title: 'Featured Products',
      products: [
        {
          id: 1,
          title: 'Premium Wireless Headphones',
          handle: 'premium-wireless-headphones',
          price: 29999,
          featured_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
          ],
          variants: [
            { id: 1, title: 'Black', price: 29999, available: true },
            { id: 2, title: 'White', price: 29999, available: true }
          ],
          available: true,
          description: 'High-quality wireless headphones with noise cancellation'
        },
        {
          id: 2,
          title: 'Smart Watch Pro',
          handle: 'smart-watch-pro',
          price: 39999,
          featured_image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
          images: [
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
          ],
          variants: [
            { id: 3, title: 'Space Gray', price: 39999, available: true },
            { id: 4, title: 'Silver', price: 39999, available: true }
          ],
          available: true,
          description: 'Advanced smartwatch with health tracking features'
        }
      ]
    }
  }
};