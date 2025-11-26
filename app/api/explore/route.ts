import { NextResponse } from 'next/server';

const EXPLORE_CATEGORIES = [
  {
    id: 'iconic-birkins',
    title: 'Iconic Birkins',
    description: 'The most coveted handbag in the world',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop',
    filter_url: '/explore?brands=Hermès&bag_type=top-handle',
    sample_products: [],
  },
  {
    id: 'chanel-classics',
    title: 'Chanel Classics',
    description: 'Timeless elegance from the House of Chanel',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop',
    filter_url: '/explore?brands=Chanel',
    sample_products: [],
  },
  {
    id: 'everyday-totes',
    title: 'Everyday Totes',
    description: 'Spacious and stylish for daily use',
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=400&fit=crop',
    filter_url: '/explore?bag_type=tote',
    sample_products: [],
  },
  {
    id: 'crossbody-bags',
    title: 'Crossbody Bags',
    description: 'Hands-free luxury for the modern woman',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=400&fit=crop',
    filter_url: '/explore?bag_type=crossbody',
    sample_products: [],
  },
  {
    id: 'investment-pieces',
    title: 'Investment Pieces',
    description: 'Bags that appreciate in value',
    image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=400&fit=crop',
    filter_url: '/explore?min_price=10000',
    sample_products: [],
  },
  {
    id: 'under-3000',
    title: 'Under $3,000',
    description: 'Luxury within reach',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop',
    filter_url: '/explore?max_price=3000',
    sample_products: [],
  },
  {
    id: 'pre-owned',
    title: 'Pre-Owned Treasures',
    description: 'Authenticated luxury at great value',
    image_url: 'https://images.unsplash.com/photo-1614179689702-355944cd0918?w=600&h=400&fit=crop',
    filter_url: '/explore?country=US',
    sample_products: [],
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Fresh from the runway',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop',
    filter_url: '/explore',
    sample_products: [],
  },
];

export async function GET() {
  return NextResponse.json({
    categories: EXPLORE_CATEGORIES,
  });
}
