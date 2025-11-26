# Luxury Handbag Explorer

## Overview
A Sora/Instagram Explore-style luxury handbag discovery platform. Users can search across multiple online stores to find luxury handbags with beautiful product cards that link directly to the original product pages.

## Project Status
- **Last Updated**: November 26, 2025
- **Platform**: Replit
- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Language**: TypeScript
- **Port**: 5000 (frontend)

## Recent Changes
- **Nov 26, 2025**: Complete redesign to Sora/Instagram Explore-style interface
  - Dark, modern gradient theme with purple/pink accents
  - 3-column responsive grid layout (3 desktop, 2 tablet, 1 mobile)
  - Beautiful product cards with hover effects and animations
  - Comprehensive filters (Country, Currency, Price Range, Brand, Bag Type)
  - Auto-loading explore view with default handbag search
  - Clickable product cards linking to original store pages

## Key Features
1. **Explore Grid**: Instagram/Sora-style 3-column layout with 10 handbag cards
2. **Live Search**: Search across multiple luxury retailers
3. **Advanced Filters**: 
   - Country (US, UK, France, Italy, Japan, etc.)
   - Currency (USD, EUR, GBP, JPY)
   - Price Range (Under $500 to Over $25,000)
   - Brand (18 luxury brands including Hermès, Chanel, LV, Gucci, etc.)
   - Bag Type (Tote, Crossbody, Shoulder, Clutch, etc.)
4. **Product Cards**: Image, name, price, source site, and view button
5. **Direct Links**: All cards link to original product pages

## Environment Configuration

### Required Environment Variables
1. **EXA_API_KEY** (Required for search functionality)
   - Used for: Web search to find handbag listings
   - Get from: https://dashboard.exa.ai/

### Setting Up
1. Go to https://dashboard.exa.ai/ and sign up
2. Copy your API key
3. Add it as a secret named `EXA_API_KEY` in the Secrets tab

## Project Architecture

### Key Directories
- **app/**: Next.js app router structure
  - **api/search-handbags/**: API endpoint for handbag search
  - **page.tsx**: Main explore page
- **components/**: React components
  - **handbags/**: Handbag-specific components
    - `product-card.tsx`: Beautiful product card with hover effects
    - `explore-filters.tsx`: Collapsible filter panel
    - `explore-grid.tsx`: 3-column responsive grid
  - **ui/**: Base UI components (shadcn/ui)

### Main Configuration Files
- **config.ts**: Application configuration
- **next.config.ts**: Next.js configuration
- **package.json**: Dependencies and scripts

## Supported Luxury Brands
- Hermès, Chanel, Louis Vuitton, Gucci, Prada
- Dior, Céline, Bottega Veneta, Balenciaga, Saint Laurent
- Fendi, Loewe, Chloé, Givenchy, Valentino, Burberry, Goyard

## Supported Retailers (auto-detected)
- Farfetch, Net-a-Porter, Mytheresa, SSENSE
- Nordstrom, Saks Fifth Avenue, Neiman Marcus, Bloomingdale's
- The RealReal, Vestiaire Collective, Rebag, Fashionphile
- Official brand websites (Louis Vuitton, Chanel, Gucci, etc.)

## Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, dark gradient theme
- **Search API**: Exa (neural web search)
- **UI Components**: Radix UI primitives, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## UI Design
- **Theme**: Dark with purple/pink gradient accents
- **Layout**: 3-column grid (responsive: 3 → 2 → 1 columns)
- **Cards**: Glassmorphism style with hover lift effect
- **Animations**: Smooth scale, glow, and transition effects
- **Typography**: Inter font with clear hierarchy

## Development

### Running the Application
The application runs via the Next.js Dev Server workflow on port 5000.

### Adding New Brands
Edit `components/handbags/explore-filters.tsx` and add to the `BRANDS` array.

### Adding New Bag Types
Edit `components/handbags/explore-filters.tsx` and add to the `BAG_TYPES` array.

### Modifying Card Design
Edit `components/handbags/product-card.tsx` to customize card appearance.

## Known Limitations
- Product images use placeholder images (actual scraping would require additional implementation)
- Price extraction relies on text parsing
- Results depend on Exa API search quality

## Future Enhancements
- Integrate actual product image scraping
- Add saved searches and favorites
- Implement price alerts
- Add user accounts and wishlist
