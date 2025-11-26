import { NextRequest, NextResponse } from 'next/server';
import Exa from 'exa-js';
import { convertPrice, formatPrice, detectCurrencyFromText } from '@/lib/currency';

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

const BRANDS = [
  'Hermès', 'Hermes', 'Chanel', 'Louis Vuitton', 'LV', 'Gucci', 'Prada',
  'Dior', 'Christian Dior', 'Celine', 'Céline', 'Bottega Veneta', 'Balenciaga',
  'Saint Laurent', 'YSL', 'Fendi', 'Loewe', 'Chloé', 'Chloe', 'Givenchy',
  'Valentino', 'Burberry', 'Goyard', 'Coach', 'Michael Kors', 'Kate Spade',
  'Tory Burch', 'Marc Jacobs', 'Mulberry', 'Alexander McQueen'
];

const BAG_TYPES = [
  'tote', 'shoulder', 'crossbody', 'clutch', 'top-handle', 'satchel', 
  'hobo', 'backpack', 'bucket', 'flap', 'belt bag', 'mini bag', 'birkin', 'kelly', 'classic flap', 'boy bag'
];

const RETAILER_DOMAINS = [
  'farfetch.com', 'net-a-porter.com', 'mytheresa.com', 'ssense.com', 
  'nordstrom.com', 'saks.com', 'neimanmarcus.com', 'therealreal.com',
  'vestiairecollective.com', 'rebag.com', 'fashionphile.com', 'tradesy.com',
  'yoogiscloset.com', 'portero.com', 'bagista.co.uk', 'collectorsquare.com',
  'labellov.com', 'sellier.com', '24s.com', 'matchesfashion.com',
  'luisaviaroma.com', 'brownsfashion.com', 'italist.com', 'cettire.com'
];

function extractBrand(text: string, title: string): string {
  const combined = `${title} ${text}`.toLowerCase();
  for (const brand of BRANDS) {
    if (combined.includes(brand.toLowerCase())) {
      if (brand === 'LV') return 'Louis Vuitton';
      if (brand === 'YSL') return 'Saint Laurent';
      if (brand === 'Hermes') return 'Hermès';
      if (brand === 'Celine') return 'Céline';
      if (brand === 'Chloe') return 'Chloé';
      return brand;
    }
  }
  return 'Designer';
}

function extractBagType(text: string, title: string): string {
  const combined = `${title} ${text}`.toLowerCase();
  for (const type of BAG_TYPES) {
    if (combined.includes(type)) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  return 'Handbag';
}

function extractRetailer(url: string): { name: string; country: string } {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const retailers: Record<string, { name: string; country: string }> = {
      'farfetch.com': { name: 'Farfetch', country: 'UK' },
      'net-a-porter.com': { name: 'Net-a-Porter', country: 'UK' },
      'mytheresa.com': { name: 'Mytheresa', country: 'DE' },
      'ssense.com': { name: 'SSENSE', country: 'CA' },
      'nordstrom.com': { name: 'Nordstrom', country: 'US' },
      'saks.com': { name: 'Saks Fifth Avenue', country: 'US' },
      'neimanmarcus.com': { name: 'Neiman Marcus', country: 'US' },
      'bergdorfgoodman.com': { name: 'Bergdorf Goodman', country: 'US' },
      'therealreal.com': { name: 'The RealReal', country: 'US' },
      'vestiairecollective.com': { name: 'Vestiaire Collective', country: 'FR' },
      'rebag.com': { name: 'Rebag', country: 'US' },
      'fashionphile.com': { name: 'Fashionphile', country: 'US' },
      'tradesy.com': { name: 'Tradesy', country: 'US' },
      'yoogiscloset.com': { name: "Yoogi's Closet", country: 'US' },
      'portero.com': { name: 'Portero', country: 'US' },
      'bagista.co.uk': { name: 'Bagista', country: 'UK' },
      'collectorsquare.com': { name: 'Collector Square', country: 'FR' },
      'labellov.com': { name: 'LabelLOV', country: 'BE' },
      'sellier.com': { name: 'Sellier', country: 'FR' },
      'louisvuitton.com': { name: 'Louis Vuitton', country: 'FR' },
      'chanel.com': { name: 'Chanel', country: 'FR' },
      'hermes.com': { name: 'Hermès', country: 'FR' },
      'gucci.com': { name: 'Gucci', country: 'IT' },
      'prada.com': { name: 'Prada', country: 'IT' },
      'dior.com': { name: 'Dior', country: 'FR' },
      'celine.com': { name: 'Celine', country: 'FR' },
      'bottegaveneta.com': { name: 'Bottega Veneta', country: 'IT' },
      'balenciaga.com': { name: 'Balenciaga', country: 'FR' },
      'ysl.com': { name: 'Saint Laurent', country: 'FR' },
      'fendi.com': { name: 'Fendi', country: 'IT' },
      'loewe.com': { name: 'Loewe', country: 'ES' },
      'chloe.com': { name: 'Chloé', country: 'FR' },
      '24s.com': { name: '24S', country: 'FR' },
      'matchesfashion.com': { name: 'Matches Fashion', country: 'UK' },
      'bloomingdales.com': { name: "Bloomingdale's", country: 'US' },
      'selfridges.com': { name: 'Selfridges', country: 'UK' },
      'harrods.com': { name: 'Harrods', country: 'UK' },
      'luisaviaroma.com': { name: 'LUISAVIAROMA', country: 'IT' },
      'brownsfashion.com': { name: 'Browns Fashion', country: 'UK' },
      'italist.com': { name: 'Italist', country: 'IT' },
      'cettire.com': { name: 'Cettire', country: 'AU' },
    };
    return retailers[hostname] || { 
      name: hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1),
      country: 'US'
    };
  } catch {
    return { name: 'Online Store', country: 'US' };
  }
}

function extractAttributes(text: string): { color?: string; size?: string; material?: string } {
  const colors = ['black', 'brown', 'tan', 'beige', 'white', 'cream', 'red', 'blue', 'green', 'pink', 'gold', 'silver', 'navy', 'burgundy', 'orange', 'yellow', 'purple', 'grey', 'gray'];
  const sizes = ['mini', 'small', 'medium', 'large', 'jumbo', '25', '30', '35', '40', 'pm', 'mm', 'gm', 'nano', 'micro'];
  const materials = ['leather', 'canvas', 'suede', 'exotic', 'tweed', 'denim', 'nylon', 'lambskin', 'calfskin', 'caviar', 'togo', 'epsom', 'clemence'];

  const lowerText = text.toLowerCase();
  
  return {
    color: colors.find(c => lowerText.includes(c)),
    size: sizes.find(s => lowerText.includes(s)),
    material: materials.find(m => lowerText.includes(m)),
  };
}

function isProductPage(url: string): boolean {
  const productIndicators = [
    '/product/', '/p/', '/pd/', '/dp/', '/item/', '/shop/', 
    '/buy/', '/listing/', '/products/', '-p-', '/bags/',
    'productid', 'itemid', 'sku', '/handbag/', '/bag/'
  ];
  const lowerUrl = url.toLowerCase();
  return productIndicators.some(indicator => lowerUrl.includes(indicator)) || 
         /\/[a-z0-9-]+\/[a-z0-9-]+-\d+/.test(lowerUrl);
}

function generateUniqueImageUrl(brand: string, bagType: string, color: string | undefined, index: number): string {
  const brandImageMap: Record<string, string[]> = {
    'Hermès': [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&h=600&fit=crop',
    ],
    'Chanel': [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop',
    ],
    'Louis Vuitton': [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    ],
    'Gucci': [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=600&h=600&fit=crop',
    ],
    'Dior': [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    ],
    'Prada': [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&h=600&fit=crop',
    ],
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560891958-68bb1d610e0b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop&sat=-100',
  ];

  const brandImages = brandImageMap[brand] || defaultImages;
  return brandImages[index % brandImages.length] || defaultImages[index % defaultImages.length];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const bagTypes = searchParams.get('bag_type')?.split(',').filter(Boolean) || [];
    const countries = searchParams.get('country')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined;
    const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined;
    const currency = searchParams.get('currency') || 'USD';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');

    const exa = getExaClient();
    
    if (!exa) {
      return NextResponse.json({
        page,
        per_page: perPage,
        total: 0,
        results: [],
        message: 'Search functionality requires API configuration. Please add EXA_API_KEY to enable live search.',
      });
    }

    let searchQuery = q || 'luxury designer handbag for sale';
    if (brands.length > 0) {
      searchQuery = `${brands.join(' OR ')} handbag bag for sale`;
    }
    if (bagTypes.length > 0) {
      searchQuery = `${searchQuery} ${bagTypes.join(' OR ')}`;
    }
    searchQuery += ' price buy shop authentic';

    const includeDomains = RETAILER_DOMAINS.slice(0, 10);

    const { results: exaResults } = await exa.searchAndContents(searchQuery, {
      text: { maxCharacters: 2000 },
      numResults: Math.min(perPage * 3, 30),
      type: 'auto',
      includeDomains,
      livecrawl: 'always',
    });

    const seenUrls = new Set<string>();
    const seenTitles = new Set<string>();
    
    let results = exaResults
      .filter((result: any) => {
        if (!result.url || seenUrls.has(result.url)) return false;
        
        const baseUrl = new URL(result.url).origin;
        if (result.url === baseUrl || result.url === baseUrl + '/') return false;
        
        const titleKey = result.title?.toLowerCase().slice(0, 50);
        if (titleKey && seenTitles.has(titleKey)) return false;
        
        seenUrls.add(result.url);
        if (titleKey) seenTitles.add(titleKey);
        
        return true;
      })
      .map((result: any, index: number) => {
        const priceInfo = detectCurrencyFromText(result.text || '');
        const brand = extractBrand(result.text || '', result.title || '');
        const bagType = extractBagType(result.text || '', result.title || '');
        const retailer = extractRetailer(result.url);
        const attributes = extractAttributes(result.text || result.title || '');

        let finalPrice = priceInfo.amount;
        let finalCurrency = priceInfo.currency;
        
        if (currency !== priceInfo.currency && priceInfo.amount) {
          finalPrice = convertPrice(priceInfo.amount, priceInfo.currency, currency);
          finalCurrency = currency;
        }

        const imageUrl = result.image || generateUniqueImageUrl(brand, bagType, attributes.color, index);

        return {
          id: `handbag-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: result.title || 'Luxury Designer Handbag',
          brand,
          bag_type: bagType,
          retailer: retailer.name,
          retailer_country: retailer.country,
          price: { amount: finalPrice, currency: finalCurrency },
          price_display: formatPrice(finalPrice, finalCurrency),
          image_url: imageUrl,
          product_url: result.url,
          scraped_at: new Date().toISOString(),
          attributes,
        };
      });

    if (brands.length > 0) {
      results = results.filter((r: any) => brands.some(b => r.brand.toLowerCase().includes(b.toLowerCase())));
    }
    if (bagTypes.length > 0) {
      results = results.filter((r: any) => bagTypes.some(t => r.bag_type.toLowerCase().includes(t.toLowerCase())));
    }
    if (countries.length > 0) {
      results = results.filter((r: any) => countries.includes(r.retailer_country));
    }
    if (minPrice !== undefined) {
      results = results.filter((r: any) => r.price.amount === null || r.price.amount >= minPrice);
    }
    if (maxPrice !== undefined) {
      results = results.filter((r: any) => r.price.amount === null || r.price.amount <= maxPrice);
    }

    const start = (page - 1) * perPage;
    const paginatedResults = results.slice(start, start + perPage);

    return NextResponse.json({
      page,
      per_page: perPage,
      total: results.length,
      results: paginatedResults,
    });
  } catch (error) {
    console.error('Error searching for handbags:', error);
    return NextResponse.json(
      { error: 'Failed to search for handbags. Please try again.' },
      { status: 500 }
    );
  }
}
