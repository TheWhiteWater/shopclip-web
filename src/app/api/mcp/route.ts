import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';

// Create the MCP handler with ShopClip tools
const handler = createMcpHandler(
  (server) => {
    // Simple test tool
    server.tool(
      'ping',
      'Test connectivity to ShopClip MCP server',
      {},
      async () => {
        return {
          content: [{ type: 'text', text: 'pong! ShopClip MCP is working.' }]
        };
      }
    );

    server.tool(
      'get_wishlist',
      'Get all saved items from user\'s wishlist. Returns list of products with prices, images, and metadata.',
      {
        limit: z.number().int().min(1).max(100).optional().describe('Max items to return (default: 50)'),
        platform: z.enum(['facebook', 'amazon', 'ebay', 'ikea', 'marketplace', 'other']).optional().describe('Filter by platform'),
        priceDropped: z.boolean().optional().describe('Only show items with price drops'),
      },
      async ({ limit = 50 }) => {
        // TODO: Integrate with Supabase when auth is set up
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              items: [],
              count: 0,
              message: 'Authentication required. Get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'get_item',
      'Get details for a single saved item by ID',
      {
        id: z.string().describe('The item ID'),
      },
      async ({ id }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required',
              message: 'Get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'add_item',
      'Save a new product to the wishlist. AI can use this to save items it finds for the user.',
      {
        url: z.string().url().describe('Product URL'),
        title: z.string().describe('Product title'),
        price: z.number().optional().describe('Current price'),
        image: z.string().url().optional().describe('Product image URL'),
        platform: z.enum(['facebook', 'amazon', 'ebay', 'ikea', 'marketplace', 'other']).optional().describe('Source platform'),
      },
      async ({ url, title, price, image, platform = 'other' }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required',
              message: 'Get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'delete_item',
      'Remove an item from the wishlist',
      {
        id: z.string().describe('The item ID to delete'),
      },
      async ({ id }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required',
              message: 'Get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'search_saved',
      'Search within saved items by keyword',
      {
        query: z.string().describe('Search query'),
        limit: z.number().int().min(1).max(50).optional().describe('Max results (default: 20)'),
      },
      async ({ query, limit = 20 }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required',
              message: 'Get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'update_price',
      'Update the current price of a saved item. AI uses this after checking current prices via web search.',
      {
        id: z.string().describe('The item ID'),
        price: z.number().describe('New current price'),
        source: z.enum(['ai_check', 'manual']).optional().describe('Price update source'),
      },
      async ({ id, price, source = 'ai_check' }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required (Pro feature)',
              message: 'Upgrade to Pro and get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'get_price_history',
      'Get price history for an item to see how price changed over time',
      {
        id: z.string().describe('The item ID'),
      },
      async ({ id }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required (Pro feature)',
              message: 'Upgrade to Pro and get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );

    server.tool(
      'get_price_drops',
      'Get all items that have dropped in price since they were saved',
      {
        minDrop: z.number().optional().describe('Minimum price drop amount to include'),
      },
      async ({ minDrop }) => {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: 'Authentication required',
              message: 'Get API token from ShopClip dashboard.',
            }, null, 2)
          }]
        };
      }
    );
  },
  {},
  { basePath: '/api' }
);

export { handler as GET, handler as POST, handler as DELETE };
