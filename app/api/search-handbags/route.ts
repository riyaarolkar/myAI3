import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';

let exaClient: Exa | null = null;

function getExaClient(): Exa | null {
  if (!process.env.EXA_API_KEY) {
    return null;
  }
  if (!exaClient) {
    exaClient = new Exa(process.env.EXA_API_KEY);
  }
  return exaClient;
}

export interface HandbagResult {
  id: string;
  title: string;
  description: string;
  price: number | null;
  priceText: string;
  currency: string;
  imageUrl: string;
  productUrl: string;
  sourceSite: string;
  brand: string | null;
}

function extractSourceSite(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const siteMap: Record<string, string> = {
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
      'bloomingdales.com': 'Bloomingdale\'s',
      'selfridges.com': 'Selfridges',
      'harrods.com': 'Harrods',
      'luisaviaroma.com': 'LUISAVIAROMA',
      'shopbop.com': 'Shopbop',
      'revolve.com': 'Revolve',
      'tradesy.com': 'Tradesy',
      'jomashop.com': 'Jomashop',
    };
    return siteMap[hostname] || hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  } catch {
    return 'Online Store';
  }
}

function extractPrice(text: string): { price: number | null; priceText: string; currency: string } {
  const pricePatterns = [
    /\$[\d,]+(?:\.\d{2})?/g,
    /€[\d,]+(?:\.\d{2})?/g,
    /£[\d,]+(?:\.\d{2})?/g,
    /¥[\d,]+/g,
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
      if (priceText.includes('¥')) currency = 'JPY';
      
      return { price: numericValue, priceText, currency };
    }
  }

  return { price: null, priceText: 'Price on request', currency: 'USD' };
}

function extractBrand(text: string, title: string): string | null {
  const brands = [
    'Hermès', 'Hermes', 'Chanel', 'Louis Vuitton', 'LV', 'Gucci', 'Prada',
    'Dior', 'Christian Dior', 'Celine', 'Céline', 'Bottega Veneta', 'Balenciaga',
    'Saint Laurent', 'YSL', 'Fendi', 'Loewe', 'Chloé', 'Chloe', 'Givenchy',
    'Valentino', 'Burberry', 'Goyard', 'Coach', 'Michael Kors', 'Kate Spade',
    'Tory Burch', 'Marc Jacobs', 'Mulberry', 'Alexander McQueen', 'Bottega'
  ];

  const combined = `${title} ${text}`.toLowerCase();
  for (const brand of brands) {
    if (combined.includes(brand.toLowerCase())) {
      if (brand === 'LV') return 'Louis Vuitton';
      if (brand === 'YSL') return 'Saint Laurent';
      if (brand === 'Hermes') return 'Hermès';
      if (brand === 'Celine') return 'Céline';
      if (brand === 'Chloe') return 'Chloé';
      if (brand === 'Bottega') return 'Bottega Veneta';
      return brand;
    }
  }
  return null;
}

function generatePlaceholderImage(brand: string | null, index: number): string {
  const colors = ['8B5CF6', '6366F1', 'EC4899', 'F43F5E', '14B8A6', '3B82F6', 'F59E0B', '10B981'];
  const color = colors[index % colors.length];
  const text = brand ? encodeURIComponent(brand.substring(0, 2).toUpperCase()) : 'LH';
  return `https://placehold.co/400x400/${color}/FFFFFF?text=${text}`;
}

const DEMO_RESULTS: HandbagResult[] = [
  {
    id: 'demo-1',
    title: 'Hermès Birkin 25 Togo Leather',
    description: 'Iconic Birkin bag in supple Togo leather with palladium hardware. Timeless investment piece.',
    price: 12500,
    priceText: '$12,500',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x500/D97706/FFFFFF?text=HE&font=playfair-display',
    productUrl: 'https://www.hermes.com',
    sourceSite: 'Hermès',
    brand: 'Hermès',
  },
  {
    id: 'demo-2',
    title: 'Chanel Classic Flap Medium Caviar',
    description: 'Classic double flap bag in durable caviar leather with gold chain. The ultimate Chanel icon.',
    price: 9500,
    priceText: '$9,500',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x500/1c1917/FFFFFF?text=CH&font=playfair-display',
    productUrl: 'https://www.chanel.com',
    sourceSite: 'Chanel',
    brand: 'Chanel',
  },
  {
    id: 'demo-3',
    title: 'Louis Vuitton Neverfull MM Monogram',
    description: 'Spacious tote in iconic monogram canvas. Perfect everyday luxury bag.',
    price: 2030,
    priceText: '$2,030',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x500/92400e/FFFFFF?text=LV&font=playfair-display',
    productUrl: 'https://www.louisvuitton.com',
    sourceSite: 'Louis Vuitton',
    brand: 'Louis Vuitton',
  },
  {
    id: 'demo-4',
    title: 'Gucci GG Marmont Small Shoulder Bag',
    description: 'Matelassé leather shoulder bag with signature Double G hardware.',
    price: 2350,
    priceText: '$2,350',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/10B981/FFFFFF?text=GU',
    productUrl: 'https://www.gucci.com',
    sourceSite: 'Gucci',
    brand: 'Gucci',
  },
  {
    id: 'demo-5',
    title: 'Dior Lady Dior Medium Cannage',
    description: 'Iconic Lady Dior in cannage lambskin with signature charms.',
    price: 5900,
    priceText: '$5,900',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/6366F1/FFFFFF?text=DI',
    productUrl: 'https://www.dior.com',
    sourceSite: 'Dior',
    brand: 'Dior',
  },
  {
    id: 'demo-6',
    title: 'Prada Galleria Saffiano Leather',
    description: 'Structured bag in scratch-resistant Saffiano leather with triangle logo.',
    price: 3400,
    priceText: '$3,400',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/F43F5E/FFFFFF?text=PR',
    productUrl: 'https://www.prada.com',
    sourceSite: 'Prada',
    brand: 'Prada',
  },
  {
    id: 'demo-7',
    title: 'Bottega Veneta Cassette Bag',
    description: 'Signature intrecciato weave crossbody in padded leather.',
    price: 3500,
    priceText: '$3,500',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/14B8A6/FFFFFF?text=BV',
    productUrl: 'https://www.bottegaveneta.com',
    sourceSite: 'Bottega Veneta',
    brand: 'Bottega Veneta',
  },
  {
    id: 'demo-8',
    title: 'Saint Laurent Loulou Small',
    description: 'Quilted Y leather shoulder bag with sliding chain strap.',
    price: 2690,
    priceText: '$2,690',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/3B82F6/FFFFFF?text=YS',
    productUrl: 'https://www.ysl.com',
    sourceSite: 'Saint Laurent',
    brand: 'Saint Laurent',
  },
  {
    id: 'demo-9',
    title: 'Celine Triomphe Canvas Teen',
    description: 'Structured bag with Triomphe clasp in canvas and calfskin.',
    price: 2400,
    priceText: '$2,400',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/EC4899/FFFFFF?text=CE',
    productUrl: 'https://www.celine.com',
    sourceSite: 'Céline',
    brand: 'Céline',
  },
  {
    id: 'demo-10',
    title: 'Loewe Puzzle Bag Small',
    description: 'Geometric paneled calfskin bag with multiple carry options.',
    price: 3550,
    priceText: '$3,550',
    currency: 'USD',
    imageUrl: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=LO',
    productUrl: 'https://www.loewe.com',
    sourceSite: 'Loewe',
    brand: 'Loewe',
  },
];

function applyFilters(
  results: HandbagResult[],
  filters: { query?: string; brand?: string; priceMin?: number; priceMax?: number; bagType?: string }
): HandbagResult[] {
  let filtered = [...results];
  
  if (filters.brand && filters.brand !== 'all') {
    filtered = filtered.filter(item => 
      item.brand?.toLowerCase().includes(filters.brand!.toLowerCase())
    );
  }
  
  if (filters.bagType && filters.bagType !== 'all') {
    const bagTypeSearch = filters.bagType.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(bagTypeSearch) ||
      item.description.toLowerCase().includes(bagTypeSearch)
    );
  }
  
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    filtered = filtered.filter(item => {
      if (item.price === null) return true;
      if (filters.priceMin !== undefined && item.price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && item.price > filters.priceMax) return false;
      return true;
    });
  }
  
  const defaultQueries = ['luxury handbag', 'luxury designer', 'handbag', 'luxury'];
  const isDefaultQuery = !filters.query || defaultQueries.some(dq => 
    filters.query!.toLowerCase().includes(dq) || dq.includes(filters.query!.toLowerCase())
  );
  
  if (filters.query && filters.query.trim() && !isDefaultQuery) {
    const searchTerms = filters.query.toLowerCase().split(' ').filter(t => t.length > 2);
    if (searchTerms.length > 0) {
      filtered = filtered.filter(item => {
        const searchText = `${item.title} ${item.description} ${item.brand || ''} ${item.sourceSite}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      });
    }
  }
  
  return filtered;
}

export async function POST(request: NextRequest) {
  try {
    const { query, brand, priceMin, priceMax, country, currency, bagType } = await request.json();

    const exa = getExaClient();
    
    if (!exa) {
      let demoResults = applyFilters(DEMO_RESULTS, { query, brand, priceMin, priceMax, bagType });
      
      return NextResponse.json({ 
        results: demoResults,
        query: query || 'luxury handbag',
        totalResults: demoResults.length,
        isDemo: true
      });
    }

    let searchQuery = query || 'luxury handbag';
    
    if (brand && brand !== 'all') {
      searchQuery = `${brand} ${searchQuery}`;
    }
    
    if (bagType && bagType !== 'all') {
      searchQuery = `${searchQuery} ${bagType}`;
    }
    
    if (country && country !== 'all') {
      const countryNames: Record<string, string> = {
        us: 'United States',
        uk: 'United Kingdom',
        fr: 'France',
        it: 'Italy',
        jp: 'Japan',
        ae: 'Dubai UAE',
        sg: 'Singapore',
        hk: 'Hong Kong',
      };
      searchQuery = `${searchQuery} ${countryNames[country] || ''}`;
    }

    searchQuery += ' handbag bag shop buy price';

    const { results } = await exa.search(searchQuery, {
      contents: {
        text: true,
      },
      numResults: 10,
      type: 'neural',
    });

    let handbagResults: HandbagResult[] = results.map((result: any, index: number) => {
      const { price, priceText, currency: detectedCurrency } = extractPrice(result.text || '');
      const detectedBrand = extractBrand(result.text || '', result.title || '');
      
      const getPlaceholderImage = (brand: string | null): string => {
        const brandColors: Record<string, string> = {
          'Hermès': 'D97706',
          'Chanel': '1c1917',
          'Louis Vuitton': '92400e',
          'Gucci': '166534',
          'Prada': '1e1b4b',
          'Dior': '831843',
          'Céline': 'a16207',
          'Bottega Veneta': '365314',
          'Balenciaga': '1f2937',
          'Saint Laurent': '0f172a',
          'Fendi': 'b45309',
          'Loewe': '7c2d12',
        };
        const color = brandColors[brand || ''] || '78716c';
        const initials = (brand || 'LX').substring(0, 2).toUpperCase();
        return `https://placehold.co/400x500/${color}/FFFFFF?text=${initials}&font=playfair-display`;
      };

      const imageUrl = result.image || getPlaceholderImage(detectedBrand);
      
      return {
        id: `handbag-${index}-${Date.now()}`,
        title: result.title || 'Luxury Handbag',
        description: result.text?.slice(0, 150).trim() + '...' || 'Beautiful luxury handbag',
        price,
        priceText,
        currency: currency && currency !== 'all' ? currency : detectedCurrency,
        imageUrl,
        productUrl: result.url,
        sourceSite: extractSourceSite(result.url),
        brand: detectedBrand,
      };
    });

    if (priceMin !== undefined || priceMax !== undefined) {
      handbagResults = handbagResults.filter(item => {
        if (item.price === null) return true;
        if (priceMin !== undefined && item.price < priceMin) return false;
        if (priceMax !== undefined && item.price > priceMax) return false;
        return true;
      });
    }

    return NextResponse.json({ 
      results: handbagResults,
      query: searchQuery,
      totalResults: handbagResults.length 
    });
  } catch (error) {
    console.error('Error searching for handbags:', error);
    return NextResponse.json(
      { error: 'Failed to search for handbags. Please try again.' },
      { status: 500 }
    );
  }
}
