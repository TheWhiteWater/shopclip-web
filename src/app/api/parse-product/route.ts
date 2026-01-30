import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface ProductData {
  title: string | null;
  price: string | null;
  image: string | null;
  description: string | null;
  source: string;
  method: 'heuristics' | 'llm';
}

// Heuristics-based parser
function parseWithHeuristics(html: string, url: string): ProductData | null {
  const $ = cheerio.load(html);
  const source = new URL(url).hostname.replace('www.', '');
  
  let title: string | null = null;
  let price: string | null = null;
  let image: string | null = null;
  let description: string | null = null;

  // === Open Graph (works on ~80% of sites) ===
  title = $('meta[property="og:title"]').attr('content') || null;
  image = $('meta[property="og:image"]').attr('content') || null;
  description = $('meta[property="og:description"]').attr('content') || null;

  // === Schema.org JSON-LD ===
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '{}');
      const items = json['@graph'] || [json];
      
      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type']?.includes('Product')) {
          if (!title) title = item.name;
          if (!description) description = item.description;
          if (!image && item.image) {
            image = Array.isArray(item.image) ? item.image[0] : item.image;
          }
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offers.price) {
              const currency = offers.priceCurrency || '';
              price = currency ? `${currency} ${offers.price}` : `$${offers.price}`;
            }
          }
        }
      }
    } catch (e) {
      // Invalid JSON-LD, skip
    }
  });

  // === Fallback: H1 ===
  if (!title) {
    title = $('h1').first().text().trim() || null;
  }

  // === Fallback: Price patterns ===
  if (!price) {
    const text = $('body').text();
    const priceMatch = text.match(/(NZ|AU|US)?\$[\d,]+(\.\d{2})?|€[\d,]+(\.\d{2})?|£[\d,]+(\.\d{2})?/);
    if (priceMatch) {
      price = priceMatch[0];
    }
  }

  // === Site-specific overrides ===
  
  // Facebook Marketplace
  if (source.includes('facebook.com')) {
    const fbTitle = $('[role="main"] h1').first().text().trim();
    if (fbTitle) title = fbTitle;
    
    const priceText = $('[role="main"]').text();
    const fbPriceMatch = priceText.match(/(NZ|AU|US)?\$[\d,]+/);
    if (fbPriceMatch) price = fbPriceMatch[0];
    
    const fbImage = $('img[src*="scontent"]').first().attr('src');
    if (fbImage) image = fbImage;
  }

  // Amazon
  if (source.includes('amazon.')) {
    const amazonTitle = $('#productTitle').text().trim();
    if (amazonTitle) title = amazonTitle;
    
    const amazonPrice = $('.a-price .a-offscreen').first().text().trim();
    if (amazonPrice) price = amazonPrice;
    
    const amazonImage = $('#landingImage').attr('src');
    if (amazonImage) image = amazonImage;
  }

  // eBay
  if (source.includes('ebay.')) {
    const ebayTitle = $('h1.x-item-title__mainTitle').text().trim();
    if (ebayTitle) title = ebayTitle;
    
    const ebayPrice = $('.x-price-primary span').first().text().trim();
    if (ebayPrice) price = ebayPrice;
    
    const ebayImage = $('.ux-image-carousel-item img').first().attr('src');
    if (ebayImage) image = ebayImage;
  }

  // Check if we got enough data
  if (title) {
    return { title, price, image, description, source, method: 'heuristics' };
  }

  return null;
}

// LLM-based parser using ai-router (FREE!)
async function parseWithLLM(html: string, url: string): Promise<ProductData | null> {
  const source = new URL(url).hostname.replace('www.', '');
  
  // Truncate HTML to ~30KB to save tokens
  const truncatedHtml = html.slice(0, 30000);
  
  // Use ai-router (Groq/Cerebras/OpenRouter - all free!)
  const aiRouterUrl = process.env.AI_ROUTER_URL || 'http://localhost:3100';
  
  const prompt = `Extract product information from this HTML. Return ONLY valid JSON:
{
  "title": "product name or null",
  "price": "price with currency or null",
  "image": "main image URL or null",
  "description": "short description or null"
}

HTML:
${truncatedHtml}`;

  try {
    const response = await fetch(`${aiRouterUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      console.error('ai-router error:', response.status);
      return null;
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      if (result.title) {
        return {
          title: result.title || null,
          price: result.price || null,
          image: result.image || null,
          description: result.description || null,
          source,
          method: 'llm',
        };
      }
    }
  } catch (error) {
    console.error('LLM parsing failed:', error);
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { html, url } = await request.json();

    if (!html || !url) {
      return NextResponse.json(
        { error: 'Missing html or url' },
        { status: 400 }
      );
    }

    // Try heuristics first (fast, free)
    let product = parseWithHeuristics(html, url);

    // If heuristics failed, try LLM via ai-router (also free!)
    if (!product) {
      product = await parseWithLLM(html, url);
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Could not parse product data' },
        { status: 422 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
