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
  'Valentino', 'Burberry', 'Goyard'
];

const BAG_TYPES = [
  'tote', 'shoulder', 'crossbody', 'clutch', 'top-handle', 'satchel', 
  'hobo', 'backpack', 'bucket', 'flap', 'belt bag', 'mini bag', 'birkin', 
  'kelly', 'classic flap', 'boy bag', 'speedy', 'neverfull', 'lady dior'
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
      'collectorsquare.com': { name: 'Collector Square', country: 'FR' },
      'labellov.com': { name: 'LabelLOV', country: 'BE' },
      '24s.com': { name: '24S', country: 'FR' },
      'matchesfashion.com': { name: 'Matches Fashion', country: 'UK' },
      'bloomingdales.com': { name: "Bloomingdale's", country: 'US' },
      'selfridges.com': { name: 'Selfridges', country: 'UK' },
      'harrods.com': { name: 'Harrods', country: 'UK' },
      'luisaviaroma.com': { name: 'LUISAVIAROMA', country: 'IT' },
      'brownsfashion.com': { name: 'Browns Fashion', country: 'UK' },
      'italist.com': { name: 'Italist', country: 'IT' },
      'cettire.com': { name: 'Cettire', country: 'AU' },
      'modesens.com': { name: 'ModeSens', country: 'US' },
      'jomashop.com': { name: 'Jomashop', country: 'US' },
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
  const colors = ['black', 'brown', 'tan', 'beige', 'white', 'cream', 'red', 'blue', 'green', 'pink', 'gold', 'silver', 'navy', 'burgundy', 'orange', 'yellow', 'purple', 'grey', 'gray', 'nude', 'camel'];
  const sizes = ['mini', 'small', 'medium', 'large', 'jumbo', '25', '30', '35', '40', 'pm', 'mm', 'gm', 'nano', 'micro'];
  const materials = ['leather', 'canvas', 'suede', 'exotic', 'tweed', 'denim', 'nylon', 'lambskin', 'calfskin', 'caviar', 'togo', 'epsom', 'clemence', 'crocodile', 'python'];

  const lowerText = text.toLowerCase();
  
  return {
    color: colors.find(c => lowerText.includes(c)),
    size: sizes.find(s => lowerText.includes(s)),
    material: materials.find(m => lowerText.includes(m)),
  };
}

function isSpecificProductPage(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    const hostname = parsedUrl.hostname.toLowerCase();
    
    if (pathname === '/' || pathname === '') {
      return false;
    }
    
    const pathSegments = pathname.split('/').filter(seg => seg.length > 0);
    
    if (pathSegments.length < 2) {
      return false;
    }
    
    const categoryOnlyPatterns = [
      /^\/(women|men|bags|handbags|accessories|shop|collection|category|search|browse|sale|new-arrivals?|designers?)\/?$/,
      /^\/(women|men)\/(bags|handbags|accessories)\/?$/,
      /^\/(shop|browse|shopping)\/(women|men|bags|handbags)\/?$/,
      /^\/(women|men)\/(bags|handbags)\/[a-z-]+\/?$/,
      /\/search\?/,
      /\/browse\//,
    ];
    
    if (categoryOnlyPatterns.some(pattern => pattern.test(pathname))) {
      return false;
    }
    
    const fullUrl = pathname;
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const productIdPatterns = [
      /\d{5,}/,
      /-\d{4,}$/,
      /-\d{4,}\./,
      /item-\d+/i,
      /-p\d{3,}/i,
      /\/p\/[a-z0-9]+/i,
      /sku[=:][a-z0-9]+/i,
      /productid[=:]\d+/i,
      /\.shtml$/,
      /-[a-f0-9]{8,}/i,
    ];
    
    const hasProductId = productIdPatterns.some(pattern => pattern.test(fullUrl) || pattern.test(lastSegment));
    
    if (hasProductId) {
      return true;
    }
    
    const retailerProductPatterns: Record<string, RegExp> = {
      'therealreal.com': /\/products\/[^\/]+\/[^\/]+\/[^\/]+-\d+/,
      'fashionphile.com': /\/(product|p)\/[a-z0-9-]+-\d+/,
      'rebag.com': /\/infinity\/[a-z0-9-]+|\/clair\/[a-z0-9-]+/,
      'vestiairecollective.com': /[a-z-]+-\d+\.shtml/,
      'farfetch.com': /\/shopping\/[^\/]+\/item-\d+/,
      'mytheresa.com': /[a-z-]+-p\d+/,
      'net-a-porter.com': /\/product\/\d+/,
      'ssense.com': /\/[a-z]+\/[a-z]+\/[a-z0-9-]+-\d+/,
      '24s.com': /[a-z-]+-\d{5,}/,
      'cettire.com': /[a-z-]+-\d{5,}/,
    };
    
    for (const [domain, pattern] of Object.entries(retailerProductPatterns)) {
      if (hostname.includes(domain)) {
        return pattern.test(pathname);
      }
    }
    
    const genericProductIndicators = [
      /\/product\/[a-z0-9-]+$/i,
      /\/item\/[a-z0-9-]+$/i,
      /\/p\/[a-z0-9]+$/i,
      /[a-z]+-[a-z]+-[a-z0-9]+-\d{3,}$/,
    ];
    
    return genericProductIndicators.some(pattern => pattern.test(pathname));
  } catch {
    return false;
  }
}

function extractImageFromText(text: string): string | null {
  const imgPatterns = [
    /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>]*)?/gi,
    /https?:\/\/[^\s"'<>]*(?:image|img|photo|pic)[^\s"'<>]*\.(?:jpg|jpeg|png|webp)/gi,
  ];
  
  for (const pattern of imgPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      const validImage = matches.find(url => 
        !url.includes('logo') && 
        !url.includes('icon') && 
        !url.includes('avatar') &&
        !url.includes('placeholder') &&
        (url.includes('product') || url.includes('bag') || url.includes('item') || matches.indexOf(url) < 3)
      );
      if (validImage) return validImage;
    }
  }
  return null;
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
        message: 'Search requires EXA_API_KEY configuration.',
      });
    }

    let searchQuery = '';
    if (brands.length > 0) {
      searchQuery = `${brands[0]} handbag bag for sale`;
    } else if (q) {
      searchQuery = `${q} luxury handbag for sale price`;
    } else {
      searchQuery = 'luxury designer handbag for sale price authentic';
    }
    
    if (bagTypes.length > 0) {
      searchQuery += ` ${bagTypes[0]}`;
    }

    const retailerDomains = [
      'therealreal.com',
      'fashionphile.com', 
      'rebag.com',
      'vestiairecollective.com',
      'farfetch.com',
      'mytheresa.com',
      'net-a-porter.com',
      'ssense.com',
      '24s.com',
      'cettire.com',
    ];

    const searchResults = await exa.searchAndContents(searchQuery, {
      text: { maxCharacters: 1500 },
      highlights: { numSentences: 3 },
      numResults: 25,
      type: 'neural',
      includeDomains: retailerDomains,
      livecrawl: 'always',
    });

    const seenImages = new Set<string>();
    const seenTitles = new Set<string>();
    
    let results = searchResults.results
      .filter((result: any) => {
        if (!result.url) return false;
        
        if (!isSpecificProductPage(result.url)) {
          return false;
        }
        
        const titleNormalized = (result.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
        if (titleNormalized && seenTitles.has(titleNormalized)) {
          return false;
        }
        if (titleNormalized) seenTitles.add(titleNormalized);
        
        return true;
      })
      .map((result: any, index: number) => {
        const text = result.text || '';
        const title = result.title || '';
        const highlights = result.highlights?.join(' ') || '';
        const combinedText = `${title} ${text} ${highlights}`;
        
        const priceInfo = detectCurrencyFromText(combinedText);
        const brand = extractBrand(combinedText, title);
        const bagType = extractBagType(combinedText, title);
        const retailer = extractRetailer(result.url);
        const attributes = extractAttributes(combinedText);

        let finalPrice = priceInfo.amount;
        let finalCurrency = priceInfo.currency;
        
        if (currency !== priceInfo.currency && priceInfo.amount) {
          finalPrice = convertPrice(priceInfo.amount, priceInfo.currency, currency);
          finalCurrency = currency;
        }

        let imageUrl = result.image;
        
        if (!imageUrl || seenImages.has(imageUrl)) {
          const extractedImage = extractImageFromText(text);
          if (extractedImage && !seenImages.has(extractedImage)) {
            imageUrl = extractedImage;
          }
        }
        
        if (!imageUrl || seenImages.has(imageUrl)) {
          const uniqueImageId = Math.abs(hashCode(result.url + title)) % 1000;
          imageUrl = `https://source.unsplash.com/600x600/?luxury,handbag,${brand.toLowerCase()},${uniqueImageId}`;
        }
        
        if (imageUrl) seenImages.add(imageUrl);

        return {
          id: `product-${hashCode(result.url)}-${index}`,
          title: cleanTitle(title),
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
      results = results.filter((r: any) => 
        brands.some(b => r.brand.toLowerCase().includes(b.toLowerCase()) || r.title.toLowerCase().includes(b.toLowerCase()))
      );
    }
    if (bagTypes.length > 0) {
      results = results.filter((r: any) => 
        bagTypes.some(t => r.bag_type.toLowerCase().includes(t.toLowerCase()) || r.title.toLowerCase().includes(t.toLowerCase()))
      );
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

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*[-|]\s*(Farfetch|The RealReal|Fashionphile|Rebag|SSENSE|Mytheresa|Net-a-Porter|Vestiaire Collective|24S|Cettire).*$/i, '')
    .replace(/\s*\|\s*.*$/, '')
    .replace(/Buy\s+/i, '')
    .replace(/Shop\s+/i, '')
    .trim();
}
