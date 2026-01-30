import { z } from 'zod';
import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { createClient } from '@/lib/supabase/server';

// Create the MCP handler with ShopClip tools
const handler = createMcpHandler(
  (server) => {
    // ============================================
    // WISHLIST MANAGEMENT TOOLS
    // ============================================

    server.tool(
      'get_wishlist',
      'Get all saved items from user\'s wishlist. Returns list of products with prices, images, and metadata.',
      {
        limit: z.number().int().min(1).max(100).optional().describe('Max items to return (default: 50)'),
        platform: z.enum(['facebook', 'amazon', 'ebay', 'ikea', 'marketplace', 'other']).optional().describe('Filter by platform'),
        priceDropped: z.boolean().optional().describe('Only show items with price drops'),
      },
      async ({ limit = 50, platform, priceDropped }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        let query = supabase
          .from('listings')
          .select('*')
          .eq('user_id', userId)
          .eq('is_deleted', false)
          .order('saved_at', { ascending: false })
          .limit(limit);

        if (platform) {
          query = query.eq('platform', platform);
        }
        if (priceDropped) {
          query = query.eq('price_dropped', true);
        }

        const { data, error } = await query;

        if (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
        }

        const items = data.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          currentPrice: item.current_price,
          originalPrice: item.original_price,
          priceDropped: item.price_dropped,
          image: item.image_url,
          platform: item.platform,
          savedAt: item.saved_at,
        }));

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ items, count: items.length }, null, 2)
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
      async ({ id }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error || !data) {
          return { content: [{ type: 'text', text: 'Error: Item not found' }] };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              id: data.id,
              title: data.title,
              url: data.url,
              currentPrice: data.current_price,
              originalPrice: data.original_price,
              priceDropped: data.price_dropped,
              image: data.image_url,
              platform: data.platform,
              location: data.location,
              notes: data.notes,
              savedAt: data.saved_at,
              updatedAt: data.updated_at,
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
      async ({ url, title, price, image, platform = 'other' }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        // Generate external_id from URL hash
        const encoder = new TextEncoder();
        const data = encoder.encode(url);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const externalId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const { data: item, error } = await supabase
          .from('listings')
          .upsert({
            user_id: userId,
            external_id: externalId,
            url,
            title,
            price: price || 0,
            current_price: price || 0,
            original_price: price || 0,
            image_url: image,
            platform,
            saved_at: new Date().toISOString(),
          }, { onConflict: 'user_id,external_id' })
          .select()
          .single();

        if (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
        }

        return {
          content: [{
            type: 'text',
            text: `Saved "${title}" to wishlist. Item ID: ${item.id}`
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
      async ({ id }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        const { error } = await supabase
          .from('listings')
          .update({ is_deleted: true })
          .eq('id', id)
          .eq('user_id', userId);

        if (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
        }

        return {
          content: [{ type: 'text', text: 'Item removed from wishlist' }]
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
      async ({ query, limit = 20 }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', userId)
          .eq('is_deleted', false)
          .ilike('title', `%${query}%`)
          .limit(limit);

        if (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
        }

        const items = data.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          currentPrice: item.current_price,
          platform: item.platform,
        }));

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ query, results: items, count: items.length }, null, 2)
          }]
        };
      }
    );

    // ============================================
    // PRICE TRACKING TOOLS (Pro tier)
    // ============================================

    server.tool(
      'update_price',
      'Update the current price of a saved item. AI uses this after checking current prices via web search.',
      {
        id: z.string().describe('The item ID'),
        price: z.number().describe('New current price'),
        source: z.enum(['ai_check', 'manual']).optional().describe('Price update source'),
      },
      async ({ id, price, source = 'ai_check' }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        // Get current item
        const { data: item } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (!item) {
          return { content: [{ type: 'text', text: 'Error: Item not found' }] };
        }

        const oldPrice = item.current_price;
        const priceDropped = price < oldPrice;
        const priceChange = oldPrice - price;

        // Update item
        const { error: updateError } = await supabase
          .from('listings')
          .update({
            current_price: price,
            price_dropped: priceDropped,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', userId);

        if (updateError) {
          return { content: [{ type: 'text', text: `Error: ${updateError.message}` }] };
        }

        // Record price history
        await supabase
          .from('price_history')
          .insert({
            listing_id: id,
            price,
            source: source === 'ai_check' ? 'scrape' : 'manual',
            recorded_at: new Date().toISOString(),
          });

        let message = `Price updated: $${oldPrice} → $${price}`;
        if (priceDropped) {
          message += ` (dropped by $${priceChange.toFixed(2)}!)`;
        } else if (price > oldPrice) {
          message += ` (increased by $${(price - oldPrice).toFixed(2)})`;
        }

        return {
          content: [{ type: 'text', text: message }]
        };
      }
    );

    server.tool(
      'get_price_history',
      'Get price history for an item to see how price changed over time',
      {
        id: z.string().describe('The item ID'),
      },
      async ({ id }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        // Verify user owns this item
        const { data: item } = await supabase
          .from('listings')
          .select('id, title')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (!item) {
          return { content: [{ type: 'text', text: 'Error: Item not found' }] };
        }

        const { data: history, error } = await supabase
          .from('price_history')
          .select('*')
          .eq('listing_id', id)
          .order('recorded_at', { ascending: false });

        if (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              itemId: id,
              itemTitle: item.title,
              history: history.map(h => ({
                price: h.price,
                date: h.recorded_at,
                source: h.source,
              }))
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
      async ({ minDrop }, { authInfo }) => {
        const supabase = await createClient();
        const userId = authInfo?.extra?.userId;

        if (!userId) {
          return { content: [{ type: 'text', text: 'Error: Not authenticated' }] };
        }

        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', userId)
          .eq('is_deleted', false)
          .eq('price_dropped', true)
          .order('saved_at', { ascending: false });

        if (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
        }

        let items = data.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          currentPrice: item.current_price,
          originalPrice: item.original_price,
          drop: (item.original_price || 0) - item.current_price,
          dropPercent: item.original_price
            ? (((item.original_price - item.current_price) / item.original_price) * 100).toFixed(1)
            : '0',
          platform: item.platform,
        }));

        if (minDrop) {
          items = items.filter(i => i.drop >= minDrop);
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              priceDrops: items,
              count: items.length,
              totalSavings: items.reduce((sum, i) => sum + i.drop, 0).toFixed(2)
            }, null, 2)
          }]
        };
      }
    );
  },
{},
  { basePath: '/api' }
);

// Token verification for OAuth
const verifyToken = async (
  req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> => {
  if (!bearerToken) return undefined;

  const supabase = await createClient();

  // Hash the token to compare with stored hash
  const encoder = new TextEncoder();
  const data = encoder.encode(bearerToken);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Look up token in database
  const { data: tokenData } = await supabase
    .from('api_tokens')
    .select('user_id, expires_at')
    .eq('token_hash', tokenHash)
    .single();

  if (!tokenData) return undefined;

  // Check expiry
  if (new Date(tokenData.expires_at) < new Date()) {
    return undefined;
  }

  // Update last_used_at
  await supabase
    .from('api_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('token_hash', tokenHash);

  return {
    token: bearerToken,
    scopes: ['wishlist:read', 'wishlist:write', 'price:read', 'price:write'],
    clientId: tokenData.user_id,
    extra: {
      userId: tokenData.user_id,
    },
  };
};

// Wrap handler with auth
const authHandler = withMcpAuth(handler, verifyToken, {
  required: true,
  requiredScopes: ['wishlist:read'],
  resourceMetadataPath: '/.well-known/oauth-protected-resource',
});

export { authHandler as GET, authHandler as POST, authHandler as DELETE };
