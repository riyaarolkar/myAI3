# LuxeBag Finder - Luxury Handbag Price Aggregator

## Overview
LuxeBag Finder is a price comparison tool for luxury handbags, similar to Skyscanner but for designer bags. Users can search for specific handbags and compare prices across multiple retailers to find the best deals.

## Project Status
- **Last Updated**: November 26, 2025
- **Platform**: Replit
- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Language**: TypeScript
- **Port**: 5000 (frontend)

## Recent Changes
- **Nov 26, 2025**: Transformed from AI chatbot to luxury handbag price aggregator
  - Created new search interface with brand/model filters
  - Built API endpoint for searching handbag prices using Exa web search
  - Added handbag result cards with retailer, price, and condition info
  - Implemented sorting and filtering functionality
  - Updated branding to "LuxeBag Finder"

## Key Features
1. **Search**: Search for luxury handbags by name, model, or brand
2. **Brand Filter**: Filter by major luxury brands (Hermès, Chanel, Louis Vuitton, etc.)
3. **Price Range Filter**: Filter results by price range
4. **Sorting**: Sort by price (low to high or high to low)
5. **Condition Badges**: Identify new vs. pre-owned items
6. **Multi-Retailer**: Results from various retailers (Farfetch, Net-a-Porter, The RealReal, etc.)

## Environment Configuration

### Required Environment Variables
1. **EXA_API_KEY** (Required for search functionality)
   - Used for: Web search to find handbag prices
   - Get from: https://dashboard.exa.ai/

### Optional Environment Variables (from original project)
- **OPENAI_API_KEY**: For any AI features
- **PINECONE_API_KEY**: For vector database (not used in current version)

## Project Architecture

### Key Directories
- **app/**: Next.js app router structure
  - **api/search-handbags/**: API endpoint for handbag price search
  - **page.tsx**: Main search interface
- **components/**: React components
  - **handbags/**: Handbag-specific components
    - `handbag-card.tsx`: Individual result card
    - `search-filters.tsx`: Search and filter controls
    - `results-grid.tsx`: Results display grid
  - **ui/**: Base UI components (shadcn/ui)
- **lib/**: Utility libraries

### Main Configuration Files
- **config.ts**: Application configuration
- **next.config.ts**: Next.js configuration (configured for Replit)
- **package.json**: Dependencies and scripts

## How It Works
1. User enters a search query (e.g., "Birkin 25") or selects a brand
2. Optionally applies price range and sorting filters
3. System searches the web using Exa API for matching handbag listings
4. Results are parsed to extract:
   - Price information
   - Retailer name
   - Condition (new, pre-owned, vintage)
5. Results are displayed in a grid with sorting applied

## Supported Luxury Brands
- Hermès
- Chanel
- Louis Vuitton
- Gucci
- Prada
- Dior
- Celine
- Bottega Veneta
- Balenciaga
- Saint Laurent
- Fendi
- Loewe
- Chloé
- Givenchy
- Valentino
- Burberry
- Goyard

## Supported Retailers (auto-detected)
- Farfetch
- Net-a-Porter
- Mytheresa
- SSENSE
- Nordstrom
- Saks Fifth Avenue
- Neiman Marcus
- The RealReal (pre-owned)
- Vestiaire Collective (pre-owned)
- Rebag (pre-owned)
- Fashionphile (pre-owned)
- StockX
- eBay
- Official brand websites

## Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Search API**: Exa (neural web search)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner

## Development

### Running the Application
The application runs automatically via the Next.js Dev Server workflow on port 5000.

### Adding New Retailers
Edit `app/api/search-handbags/route.ts` and add to the `retailerMap` object.

### Adding New Brands
Edit `components/handbags/search-filters.tsx` and add to the `LUXURY_BRANDS` array.

## User Preferences
(None documented yet)

## Known Limitations
- Price extraction relies on text parsing; some listings may show "Price on request"
- Results depend on Exa API search quality
- No product images (would require additional scraping)
- Pre-owned condition detection is based on URL and text patterns

## Future Enhancements
- Add product images via web scraping
- Implement saved searches
- Add price alerts
- Direct comparison between specific items
- Historical price tracking
