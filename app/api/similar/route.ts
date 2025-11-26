import { NextRequest, NextResponse } from 'next/server';
import { findSimilarByProductId, querySimilar } from '@/lib/handbag-pinecone';
import { formatPrice } from '@/lib/currency';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('id');
    const query = searchParams.get('q');
    const topK = parseInt(searchParams.get('topK') || '5');

    if (!productId && !query) {
      return NextResponse.json(
        { error: 'Either id or q parameter is required' },
        { status: 400 }
      );
    }

    let results;
    
    if (productId) {
      results = await findSimilarByProductId(productId, topK);
    } else if (query) {
      results = await querySimilar(query, topK);
    }

    if (!results || results.length === 0) {
      return NextResponse.json({
        results: [],
        message: 'No similar products found. Vector search requires indexed products.',
      });
    }

    const formattedResults = results.map((r) => ({
      id: r.id,
      title: r.title,
      brand: r.brand,
      bag_type: r.bag_type,
      retailer: r.retailer,
      retailer_country: r.retailer_country,
      price: { amount: r.price_amount, currency: r.price_currency },
      price_display: formatPrice(r.price_amount, r.price_currency),
      image_url: r.image_url,
      product_url: r.product_url,
      scraped_at: r.scraped_at,
      attributes: {},
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error('Error finding similar products:', error);
    return NextResponse.json(
      { error: 'Failed to find similar products' },
      { status: 500 }
    );
  }
}
