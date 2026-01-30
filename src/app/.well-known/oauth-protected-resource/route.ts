import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler,
} from 'mcp-handler';

// OAuth Protected Resource Metadata
// This endpoint tells MCP clients how to authenticate with ShopClip
const handler = protectedResourceHandler({
  // ShopClip uses API tokens, not external OAuth
  // Clients get tokens from the ShopClip dashboard
  authServerUrls: [process.env.NEXT_PUBLIC_APP_URL || 'https://shopclip.app'],
});

const corsHandler = metadataCorsOptionsRequestHandler();

export { handler as GET, corsHandler as OPTIONS };
