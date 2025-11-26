import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

export interface HandbagResult {
  id: string;
  title: string;
  url: string;
  retailer: string;
  price: number | null;
  priceText: string;
  currency: string;
  imageUrl: string | null;
  description: string;
  condition: string;
}

function extractRetailer(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const retailerMap: Record<string, string> = {
      'farfetch.com': 'Farfetch',
      'net-a-porter.com': 'Net-a-Porter',
      'mytheresa.com': 'Mytheresa',
      'ssense.com': 'SSENSE',
      'nordstrom.com': 'Nordstrom',
      'saks.com': 'Saks Fifth Avenue',
      'neimanmarcus.com': 'Neiman Marcus',
      'bergdorfgoodman.com': 'Bergdorf Goodman',
      'therealreal.com': 'The RealReal',
      'vestiairecollective.com': 'Vestiaire Collective',
      'rebag.com': 'Rebag',
      'fashionphile.com': 'Fashionphile',
      'stockx.com': 'StockX',
      'ebay.com': 'eBay',
      'louisvuitton.com': 'Louis Vuitton',
      'chanel.com': 'Chanel',
      'hermes.com': 'Hermès',
      'gucci.com': 'Gucci',
      'prada.com': 'Prada',
      'dior.com': 'Dior',
      'celine.com': 'Celine',
      'bottegaveneta.com': 'Bottega Veneta',
      'balenciaga.com': 'Balenciaga',
      'ysl.com': 'Saint Laurent',
      'fendi.com': 'Fendi',
      'loewe.com': 'Loewe',
      'chloe.com': 'Chloé',
      '24s.com': '24S',
      'matchesfashion.com': 'Matches Fashion',
    };
    return retailerMap[hostname] || hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  } catch {
    return 'Unknown';
  }
}

function extractPrice(text: string): { price: number | null; priceText: string; currency: string } {
  const pricePatterns = [
    /\$[\d,]+(?:\.\d{2})?/g,
    /€[\d,]+(?:\.\d{2})?/g,
    /£[\d,]+(?:\.\d{2})?/g,
    /USD\s*[\d,]+(?:\.\d{2})?/gi,
    /EUR\s*[\d,]+(?:\.\d{2})?/gi,
    /GBP\s*[\d,]+(?:\.\d{2})?/gi,
  ];

  for (const pattern of pricePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      const priceText = matches[0];
      const numericValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      let currency = 'USD';
      if (priceText.includes('€') || priceText.toLowerCase().includes('eur')) currency = 'EUR';
      if (priceText.includes('£') || priceText.toLowerCase().includes('gbp')) currency = 'GBP';
      
      return { price: numericValue, priceText, currency };
    }
  }

  return { price: null, priceText: 'Price on request', currency: 'USD' };
}

function extractCondition(text: string, url: string): string {
  const lowerText = text.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  const preownedSites = ['therealreal', 'vestiaire', 'rebag', 'fashionphile', 'ebay'];
  const isPreownedSite = preownedSites.some(site => lowerUrl.includes(site));
  
  if (lowerText.includes('pre-owned') || lowerText.includes('preowned') || lowerText.includes('pre owned')) {
    return 'Pre-owned';
  }
  if (lowerText.includes('vintage')) {
    return 'Vintage';
  }
  if (lowerText.includes('like new') || lowerText.includes('excellent condition')) {
    return 'Like New';
  }
  if (lowerText.includes('gently used') || lowerText.includes('good condition')) {
    return 'Good';
  }
  if (isPreownedSite) {
    return 'Pre-owned';
  }
  
  return 'New';
}

export async function POST(request: NextRequest) {
  try {
    const { query, brand, minPrice, maxPrice } = await request.json();

    if (!process.env.EXA_API_KEY) {
      return NextResponse.json(
        { error: 'Search API not configured. Please add EXA_API_KEY.' },
        { status: 500 }
      );
    }

    let searchQuery = `${brand ? brand + ' ' : ''}${query} handbag bag price buy`;
    
    if (minPrice || maxPrice) {
      searchQuery += ` $${minPrice || 0} - $${maxPrice || 50000}`;
    }

    const { results } = await exa.search(searchQuery, {
      contents: {
        text: true,
      },
      numResults: 15,
      type: 'neural',
    });

    const handbagResults: HandbagResult[] = results.map((result, index) => {
      const { price, priceText, currency } = extractPrice(result.text || '');
      
      return {
        id: `result-${index}-${Date.now()}`,
        title: result.title || 'Luxury Handbag',
        url: result.url,
        retailer: extractRetailer(result.url),
        price,
        priceText,
        currency,
        imageUrl: null,
        description: result.text?.slice(0, 300) || '',
        condition: extractCondition(result.text || '', result.url),
      };
    });

    const sortedResults = handbagResults.sort((a, b) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    });

    return NextResponse.json({ results: sortedResults });
  } catch (error) {
    console.error('Error searching for handbags:', error);
    return NextResponse.json(
      { error: 'Failed to search for handbags' },
      { status: 500 }
    );
  }
}
