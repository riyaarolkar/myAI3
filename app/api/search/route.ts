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
  'hobo', 'backpack', 'bucket', 'flap', 'belt bag', 'mini bag'
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
  return 'Unknown';
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
      'sothebys.com': { name: "Sotheby's", country: 'UK' },
      'christies.com': { name: "Christie's", country: 'UK' },
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
  const colors = ['black', 'brown', 'tan', 'beige', 'white', 'cream', 'red', 'blue', 'green', 'pink', 'gold', 'silver', 'navy', 'burgundy'];
  const sizes = ['mini', 'small', 'medium', 'large', 'jumbo', '25', '30', '35', '40'];
  const materials = ['leather', 'canvas', 'suede', 'exotic', 'tweed', 'denim', 'nylon'];

  const lowerText = text.toLowerCase();
  
  return {
    color: colors.find(c => lowerText.includes(c)),
    size: sizes.find(s => lowerText.includes(s)),
    material: materials.find(m => lowerText.includes(m)),
  };
}

interface DemoResult {
  id: string;
  title: string;
  brand: string;
  bag_type: string;
  retailer: string;
  retailer_country: string;
  price: { amount: number | null; currency: string };
  price_display: string;
  image_url: string;
  product_url: string;
  scraped_at: string;
  attributes: { color: string; size: string; material: string };
}

const DEMO_RESULTS: DemoResult[] = [
  {
    id: 'demo-1',
    title: 'Hermès Birkin 30 Togo Leather Gold Hardware',
    brand: 'Hermès',
    bag_type: 'Top-handle',
    retailer: 'Fashionphile',
    retailer_country: 'US',
    price: { amount: 18500, currency: 'USD' },
    price_display: '$18,500',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    product_url: 'https://www.fashionphile.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'tan', size: '30cm', material: 'leather' },
  },
  {
    id: 'demo-2',
    title: 'Chanel Classic Flap Medium Caviar Black',
    brand: 'Chanel',
    bag_type: 'Shoulder',
    retailer: 'The RealReal',
    retailer_country: 'US',
    price: { amount: 8950, currency: 'USD' },
    price_display: '$8,950',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    product_url: 'https://www.therealreal.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'black', size: 'medium', material: 'leather' },
  },
  {
    id: 'demo-3',
    title: 'Louis Vuitton Neverfull MM Monogram',
    brand: 'Louis Vuitton',
    bag_type: 'Tote',
    retailer: 'Louis Vuitton',
    retailer_country: 'FR',
    price: { amount: 2030, currency: 'USD' },
    price_display: '$2,030',
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop',
    product_url: 'https://www.louisvuitton.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'brown', size: 'MM', material: 'canvas' },
  },
  {
    id: 'demo-4',
    title: 'Gucci GG Marmont Small Shoulder Bag',
    brand: 'Gucci',
    bag_type: 'Shoulder',
    retailer: 'Gucci',
    retailer_country: 'IT',
    price: { amount: 2350, currency: 'USD' },
    price_display: '$2,350',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
    product_url: 'https://www.gucci.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'black', size: 'small', material: 'leather' },
  },
  {
    id: 'demo-5',
    title: 'Dior Lady Dior Medium Cannage Lambskin',
    brand: 'Dior',
    bag_type: 'Top-handle',
    retailer: 'Dior',
    retailer_country: 'FR',
    price: { amount: 5900, currency: 'USD' },
    price_display: '$5,900',
    image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop',
    product_url: 'https://www.dior.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'black', size: 'medium', material: 'leather' },
  },
  {
    id: 'demo-6',
    title: 'Prada Galleria Saffiano Large Tote',
    brand: 'Prada',
    bag_type: 'Tote',
    retailer: 'Neiman Marcus',
    retailer_country: 'US',
    price: { amount: 3400, currency: 'USD' },
    price_display: '$3,400',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    product_url: 'https://www.neimanmarcus.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'black', size: 'large', material: 'leather' },
  },
  {
    id: 'demo-7',
    title: 'Bottega Veneta Cassette Crossbody Intrecciato',
    brand: 'Bottega Veneta',
    bag_type: 'Crossbody',
    retailer: 'Mytheresa',
    retailer_country: 'DE',
    price: { amount: 3500, currency: 'USD' },
    price_display: '$3,500',
    image_url: 'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&h=600&fit=crop',
    product_url: 'https://www.mytheresa.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'green', size: 'medium', material: 'leather' },
  },
  {
    id: 'demo-8',
    title: 'Saint Laurent Loulou Medium Chain Bag',
    brand: 'Saint Laurent',
    bag_type: 'Shoulder',
    retailer: 'SSENSE',
    retailer_country: 'CA',
    price: { amount: 2690, currency: 'USD' },
    price_display: '$2,690',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop',
    product_url: 'https://www.ssense.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'black', size: 'medium', material: 'leather' },
  },
  {
    id: 'demo-9',
    title: 'Celine Triomphe Shoulder Bag Canvas',
    brand: 'Céline',
    bag_type: 'Shoulder',
    retailer: '24S',
    retailer_country: 'FR',
    price: { amount: 2400, currency: 'USD' },
    price_display: '$2,400',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    product_url: 'https://www.24s.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'tan', size: 'medium', material: 'canvas' },
  },
  {
    id: 'demo-10',
    title: 'Loewe Puzzle Small Calfskin Bag',
    brand: 'Loewe',
    bag_type: 'Crossbody',
    retailer: 'Loewe',
    retailer_country: 'ES',
    price: { amount: 3550, currency: 'USD' },
    price_display: '$3,550',
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop',
    product_url: 'https://www.loewe.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'tan', size: 'small', material: 'leather' },
  },
  {
    id: 'demo-11',
    title: 'Fendi Baguette Medium FF Jacquard',
    brand: 'Fendi',
    bag_type: 'Shoulder',
    retailer: 'Farfetch',
    retailer_country: 'UK',
    price: { amount: 3190, currency: 'USD' },
    price_display: '$3,190',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
    product_url: 'https://www.farfetch.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'brown', size: 'medium', material: 'canvas' },
  },
  {
    id: 'demo-12',
    title: 'Balenciaga Hourglass XS Top Handle',
    brand: 'Balenciaga',
    bag_type: 'Top-handle',
    retailer: 'Net-a-Porter',
    retailer_country: 'UK',
    price: { amount: 2290, currency: 'USD' },
    price_display: '$2,290',
    image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop',
    product_url: 'https://www.net-a-porter.com',
    scraped_at: new Date().toISOString(),
    attributes: { color: 'black', size: 'XS', material: 'leather' },
  },
];

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
      let results = [...DEMO_RESULTS];
      
      if (brands.length > 0) {
        results = results.filter(r => brands.some(b => r.brand.toLowerCase().includes(b.toLowerCase())));
      }
      if (bagTypes.length > 0) {
        results = results.filter(r => bagTypes.some(t => r.bag_type.toLowerCase().includes(t.toLowerCase())));
      }
      if (countries.length > 0) {
        results = results.filter(r => countries.includes(r.retailer_country));
      }
      if (minPrice !== undefined) {
        results = results.filter(r => r.price.amount === null || r.price.amount >= minPrice);
      }
      if (maxPrice !== undefined) {
        results = results.filter(r => r.price.amount === null || r.price.amount <= maxPrice);
      }

      if (currency !== 'USD') {
        results = results.map(r => ({
          ...r,
          price: {
            amount: r.price.amount ? convertPrice(r.price.amount, 'USD', currency) : null,
            currency,
          },
          price_display: r.price.amount ? formatPrice(convertPrice(r.price.amount, 'USD', currency), currency) : 'Price on request',
        }));
      }

      const start = (page - 1) * perPage;
      const paginatedResults = results.slice(start, start + perPage);

      return NextResponse.json({
        page,
        per_page: perPage,
        total: results.length,
        results: paginatedResults,
      });
    }

    let searchQuery = q || 'luxury designer handbag';
    if (brands.length > 0) {
      searchQuery = `${brands.join(' OR ')} ${searchQuery}`;
    }
    if (bagTypes.length > 0) {
      searchQuery = `${searchQuery} ${bagTypes.join(' ')}`;
    }
    searchQuery += ' handbag bag buy price shop';

    const { results: exaResults } = await exa.search(searchQuery, {
      contents: { text: true },
      numResults: Math.min(perPage * 2, 20),
      type: 'neural',
    });

    let results = exaResults.map((result: any, index: number) => {
      const priceInfo = detectCurrencyFromText(result.text || '');
      const brand = extractBrand(result.text || '', result.title || '');
      const bagType = extractBagType(result.text || '', result.title || '');
      const retailer = extractRetailer(result.url);
      const attributes = extractAttributes(result.text || '');

      let finalPrice = priceInfo.amount;
      let finalCurrency = priceInfo.currency;
      
      if (currency !== priceInfo.currency && priceInfo.amount) {
        finalPrice = convertPrice(priceInfo.amount, priceInfo.currency, currency);
        finalCurrency = currency;
      }

      return {
        id: `handbag-${index}-${Date.now()}`,
        title: result.title || 'Luxury Handbag',
        brand,
        bag_type: bagType,
        retailer: retailer.name,
        retailer_country: retailer.country,
        price: { amount: finalPrice, currency: finalCurrency },
        price_display: formatPrice(finalPrice, finalCurrency),
        image_url: result.image || `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop`,
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

    return NextResponse.json({
      page,
      per_page: perPage,
      total: results.length,
      results,
    });
  } catch (error) {
    console.error('Error searching for handbags:', error);
    return NextResponse.json(
      { error: 'Failed to search for handbags. Please try again.' },
      { status: 500 }
    );
  }
}
