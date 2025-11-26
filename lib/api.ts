export interface SearchParams {
  q?: string;
  brands?: string[];
  bag_type?: string[];
  country?: string[];
  min_price?: number;
  max_price?: number;
  currency?: string;
  page?: number;
  per_page?: number;
}

export interface PriceInfo {
  amount: number | null;
  currency: string;
}

export interface ProductAttributes {
  color?: string;
  size?: string;
  material?: string;
  condition?: string;
}

export interface HandbagListing {
  id: string;
  title: string;
  brand: string;
  bag_type: string;
  retailer: string;
  retailer_country: string;
  price: PriceInfo;
  price_display: string;
  image_url: string;
  product_url: string;
  scraped_at: string;
  attributes: ProductAttributes;
}

export interface SearchResponse {
  page: number;
  per_page: number;
  total: number;
  results: HandbagListing[];
}

export interface ExploreCategory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  filter_url: string;
  sample_products: HandbagListing[];
}

export interface ExploreResponse {
  categories: ExploreCategory[];
}

export async function searchHandbags(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.set('q', params.q);
  if (params.brands?.length) searchParams.set('brands', params.brands.join(','));
  if (params.bag_type?.length) searchParams.set('bag_type', params.bag_type.join(','));
  if (params.country?.length) searchParams.set('country', params.country.join(','));
  if (params.min_price !== undefined) searchParams.set('min_price', String(params.min_price));
  if (params.max_price !== undefined) searchParams.set('max_price', String(params.max_price));
  if (params.currency) searchParams.set('currency', params.currency);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.per_page) searchParams.set('per_page', String(params.per_page));

  const response = await fetch(`/api/search?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to search handbags');
  }

  return response.json();
}

export async function getExploreCategories(): Promise<ExploreResponse> {
  const response = await fetch('/api/explore');
  
  if (!response.ok) {
    throw new Error('Failed to fetch explore categories');
  }

  return response.json();
}

export async function getSimilarProducts(productId: string, topK: number = 5): Promise<HandbagListing[]> {
  const response = await fetch(`/api/similar?id=${productId}&topK=${topK}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch similar products');
  }

  const data = await response.json();
  return data.results;
}
