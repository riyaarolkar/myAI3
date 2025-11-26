import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'luxury-handbags';

let pineconeClient: Pinecone | null = null;
let openaiClient: OpenAI | null = null;

function getPinecone(): Pinecone | null {
  if (!process.env.PINECONE_API_KEY) {
    return null;
  }
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pineconeClient;
}

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface HandbagMetadata {
  id: string;
  title: string;
  brand: string;
  bag_type: string;
  retailer: string;
  retailer_country: string;
  price_amount: number | null;
  price_currency: string;
  image_url: string;
  product_url: string;
  scraped_at: string;
  color?: string;
  size?: string;
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  const openai = getOpenAI();
  if (!openai) return null;

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

export async function indexHandbag(handbag: HandbagMetadata): Promise<boolean> {
  const pinecone = getPinecone();
  if (!pinecone) return false;

  try {
    const textToEmbed = `${handbag.title} ${handbag.brand} ${handbag.bag_type} ${handbag.retailer}`;
    const embedding = await generateEmbedding(textToEmbed);
    
    if (!embedding) return false;

    const index = pinecone.Index(PINECONE_INDEX_NAME);
    await index.upsert([{
      id: handbag.id,
      values: embedding,
      metadata: {
        title: handbag.title,
        brand: handbag.brand,
        bag_type: handbag.bag_type,
        retailer: handbag.retailer,
        retailer_country: handbag.retailer_country,
        price_amount: handbag.price_amount ?? 0,
        price_currency: handbag.price_currency,
        image_url: handbag.image_url,
        product_url: handbag.product_url,
        scraped_at: handbag.scraped_at,
      },
    }]);

    return true;
  } catch (error) {
    console.error('Error indexing handbag:', error);
    return false;
  }
}

export async function querySimilar(
  query: string,
  topK: number = 10,
  filters?: {
    brand?: string;
    bag_type?: string;
    retailer_country?: string;
    min_price?: number;
    max_price?: number;
  }
): Promise<HandbagMetadata[]> {
  const pinecone = getPinecone();
  if (!pinecone) return [];

  try {
    const embedding = await generateEmbedding(query);
    if (!embedding) return [];

    const index = pinecone.Index(PINECONE_INDEX_NAME);
    
    let filter: Record<string, any> = {};
    if (filters?.brand) {
      filter.brand = { $eq: filters.brand };
    }
    if (filters?.bag_type) {
      filter.bag_type = { $eq: filters.bag_type };
    }
    if (filters?.retailer_country) {
      filter.retailer_country = { $eq: filters.retailer_country };
    }
    if (filters?.min_price !== undefined || filters?.max_price !== undefined) {
      filter.price_amount = {};
      if (filters.min_price !== undefined) {
        filter.price_amount.$gte = filters.min_price;
      }
      if (filters.max_price !== undefined) {
        filter.price_amount.$lte = filters.max_price;
      }
    }

    const queryResponse = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    return queryResponse.matches?.map((match) => ({
      id: match.id,
      title: match.metadata?.title as string || '',
      brand: match.metadata?.brand as string || '',
      bag_type: match.metadata?.bag_type as string || '',
      retailer: match.metadata?.retailer as string || '',
      retailer_country: match.metadata?.retailer_country as string || '',
      price_amount: match.metadata?.price_amount as number | null,
      price_currency: match.metadata?.price_currency as string || 'USD',
      image_url: match.metadata?.image_url as string || '',
      product_url: match.metadata?.product_url as string || '',
      scraped_at: match.metadata?.scraped_at as string || '',
    })) || [];
  } catch (error) {
    console.error('Error querying similar handbags:', error);
    return [];
  }
}

export async function findSimilarByProductId(
  productId: string,
  topK: number = 5
): Promise<HandbagMetadata[]> {
  const pinecone = getPinecone();
  if (!pinecone) return [];

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);
    
    const fetchResponse = await index.fetch([productId]);
    const product = fetchResponse.records?.[productId];
    
    if (!product?.values) return [];

    const queryResponse = await index.query({
      vector: product.values,
      topK: topK + 1,
      includeMetadata: true,
    });

    return queryResponse.matches
      ?.filter((match) => match.id !== productId)
      .slice(0, topK)
      .map((match) => ({
        id: match.id,
        title: match.metadata?.title as string || '',
        brand: match.metadata?.brand as string || '',
        bag_type: match.metadata?.bag_type as string || '',
        retailer: match.metadata?.retailer as string || '',
        retailer_country: match.metadata?.retailer_country as string || '',
        price_amount: match.metadata?.price_amount as number | null,
        price_currency: match.metadata?.price_currency as string || 'USD',
        image_url: match.metadata?.image_url as string || '',
        product_url: match.metadata?.product_url as string || '',
        scraped_at: match.metadata?.scraped_at as string || '',
      })) || [];
  } catch (error) {
    console.error('Error finding similar products:', error);
    return [];
  }
}
