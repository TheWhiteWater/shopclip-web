import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler,
} from 'mcp-handler';

// OAuth Protected Resource Metadata
// This endpoint tells MCP clients how to authenticate with Grabbit
const handler = protectedResourceHandler({
  // Grabbit uses API tokens, not external OAuth
  // Clients get tokens from the Grabbit dashboard
  authServerUrls: [process.env.NEXT_PUBLIC_APP_URL || 'https://grabbitapp.com'],
});

const corsHandler = metadataCorsOptionsRequestHandler();

export { handler as GET, corsHandler as OPTIONS };
