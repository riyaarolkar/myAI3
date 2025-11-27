# Luxury Handbag Explorer

## Overview
A professional luxury handbag price-aggregator platform inspired by Chrono24 and Skyscanner. Users can search across multiple premium retailers to find designer handbags, compare prices, and click through to original product pages.

## Project Status
- **Last Updated**: November 26, 2025
- **Platform**: Replit
- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Language**: TypeScript
- **Port**: 5000 (frontend)
- **Deployment**: Configured for Replit autoscale deployment

## Recent Changes
- **Nov 27, 2025**: GPT-style conversational chat interface
  - Replaced search bar with persistent chat UI
  - Personal Concierge AI that stays in conversation (never disappears)
  - Chat message history with user/assistant bubbles
  - Products displayed inline within conversation
  - Quick suggestion buttons for common queries
  - "New Chat" button to start fresh conversations
  - Natural language filter extraction (brand, price, color, occasion, bag type)
  - /api/concierge endpoint for AI-powered responses
  
- **Nov 26, 2025**: Complete rebuild per specification
  - Chrono24-style Explore page with curated category grid
  - Multi-select filters: Brands, Countries, Bag Types, Price Range, Currency
  - 4-column responsive product grid (4 desktop, 2 tablet, 1 mobile)
  - Compare functionality with checkboxes on product cards
  - Pinecone integration for vector similarity search
  - OpenAI embeddings for product indexing
  - Real product images from Exa web search

## Key Features
1. **GPT-Style Chat Interface**: 
   - Persistent conversation with Personal Concierge
   - Natural language queries like "Find a bag for a cocktail dinner under $5000"
   - Products shown inline with AI responses
   - Chat history maintained throughout session
   - Quick suggestion buttons for new users
2. **Explore Page**: Chrono24-style category grid (Iconic Birkins, Chanel Classics, etc.)
3. **Natural Language Understanding**:
   - Extracts brand, color, price range, bag type, and occasion
   - AI provides personalized recommendations and tips
   - Conversational responses like a luxury boutique personal shopper
4. **Product Cards**: 
   - Brand pill (top-left, uppercase)
   - Compare checkbox
   - Lazy-loaded images with fallback
   - Retailer name and country
   - Price with currency
   - View button (opens retailer in new tab)
5. **Vector Search**: Pinecone-powered similarity recommendations
6. **Live Search**: Exa API for real-time product discovery

## Environment Configuration

### Required Environment Variables
1. **EXA_API_KEY** (Required for search)
   - Used for: Web search to find handbag listings
   - Get from: https://dashboard.exa.ai/

2. **OPENAI_API_KEY** (Required for embeddings)
   - Used for: Generating product embeddings
   - Get from: https://platform.openai.com/

3. **PINECONE_API_KEY** (Required for similarity search)
   - Used for: Vector database for product similarity
   - Get from: https://app.pinecone.io/
   - Index: Create with 1536 dimensions, cosine metric

### Optional Configuration
- **PINECONE_INDEX_NAME**: Custom index name (default: "luxury-handbags")

## Project Architecture

### API Endpoints
- **POST /api/concierge**: AI concierge for natural language queries
  - Body: { message: string }
  - Returns: { message, tip, filters, searchQuery }
  
- **GET /api/search**: Search handbags with filters
  - Query params: q, brands, bag_type, country, min_price, max_price, currency, page, per_page
  - Returns: Paginated list of products
  
- **GET /api/explore**: Get curated category collections
  - Returns: Array of categories with images and filter URLs
  
- **GET /api/similar**: Find similar products
  - Query params: id (product ID) or q (query text), topK
  - Returns: Array of similar products from Pinecone

### Key Directories
```
app/
├── api/
│   ├── concierge/route.ts   # AI concierge endpoint
│   ├── search/route.ts      # Main search endpoint
│   ├── explore/route.ts     # Category collections
│   └── similar/route.ts     # Similarity search
├── explore/page.tsx         # Explore page with categories
└── page.tsx                 # Landing page with search

components/
├── handbags/
│   ├── brand-pill.tsx       # Brand badge component
│   ├── search-bar.tsx       # Search input component
│   ├── filters-panel.tsx    # Multi-select filter panel
│   ├── explore-filters.tsx  # Simple dropdown filters
│   ├── explore-grid.tsx     # Product grid with skeleton
│   └── product-card.tsx     # Product card with compare
└── ui/                      # Base shadcn/ui components

lib/
├── api.ts                   # Client API wrappers
├── currency.ts              # Currency conversion helpers
├── handbag-pinecone.ts      # Pinecone vector operations
└── utils.ts                 # General utilities
```

### Data Model (Product Schema)
```json
{
  "id": "string",
  "title": "string",
  "brand": "string",
  "bag_type": "string",
  "retailer": "string",
  "retailer_country": "string",
  "price": {"amount": number | null, "currency": "USD"},
  "price_display": "string",
  "image_url": "https://...",
  "product_url": "https://...",
  "scraped_at": "ISO8601",
  "attributes": {"color": "...", "size": "...", "material": "..."}
}
```

## Supported Luxury Brands
Hermès, Chanel, Louis Vuitton, Gucci, Prada, Dior, Céline, Bottega Veneta, Balenciaga, Saint Laurent, Fendi, Loewe, Chloé, Givenchy, Valentino, Burberry, Goyard

## Supported Bag Types
Tote, Shoulder, Crossbody, Clutch, Top-handle, Satchel, Hobo, Backpack, Bucket, Flap, Belt Bag, Mini Bag

## Supported Countries
United States, United Kingdom, France, Italy, Germany, Japan, UAE, Singapore, Hong Kong, Canada, Spain

## Supported Currencies
USD ($), EUR (€), GBP (£), JPY (¥), CHF, INR (₹)

## Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, luxury white/cream/stone/amber theme
- **Search API**: Exa (neural web search)
- **Vector DB**: Pinecone (similarity search)
- **Embeddings**: OpenAI text-embedding-3-small
- **UI Components**: Radix UI primitives, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## UI Design
- **Theme**: Luxury white with stone and amber accents
- **Colors**: White, stone-50 (cream), stone-900 (near black), amber-600 (accent)
- **Layout**: 4-column responsive grid (4 → 2 → 1 columns)
- **Cards**: White with subtle shadows, 2xl rounded corners, hover scale effect
- **Typography**: Serif headings (Playfair-style), sans-serif body
- **Animations**: Smooth transitions, scale on hover, loading skeletons

## Development

### Running the Application
The application runs via the Next.js Dev Server workflow on port 5000.

### Deployment
Deployment is configured for Replit autoscale:
- Build: `npm run build`
- Run: `npm run start`
Click the Publish button to deploy.

### API Testing Examples
```bash
# Search for Hermès bags
curl "https://your-app.replit.dev/api/search?q=birkin&brands=Hermès"

# Get explore categories
curl "https://your-app.replit.dev/api/explore"

# Find similar products
curl "https://your-app.replit.dev/api/similar?q=black+leather+tote&topK=5"
```

## User Preferences
- Professional luxury aesthetic with white/stone/amber color scheme
- Chrono24-inspired explore page with category tiles
- Multi-select filters for power users
- Compare functionality for price comparison
- Real product images when available from retailers
