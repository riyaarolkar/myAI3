# Luxury Handbag Explorer

## Overview
A premium luxury handbag discovery platform. Users can search across multiple online stores to find designer handbags with elegant product cards that link directly to the original product pages.

## Project Status
- **Last Updated**: November 26, 2025
- **Platform**: Replit
- **Framework**: Next.js 16.0.0 with React 19.2.0
- **Language**: TypeScript
- **Port**: 5000 (frontend)
- **Deployment**: Configured for Replit autoscale deployment

## Recent Changes
- **Nov 26, 2025**: Luxury redesign with premium white/cream/brown/black theme
  - Elegant white and cream color palette with stone and amber accents
  - Serif typography for luxury branding ("Find Your Perfect Bag")
  - 3-column responsive grid layout (3 desktop, 2 tablet, 1 mobile)
  - Refined product cards with subtle shadows and hover effects
  - Professional uppercase brand badges
  - Exa API integrated for live web search with real product images

## Key Features
1. **Explore Grid**: 3-column layout with luxury product cards
2. **Live Search**: Search across multiple luxury retailers via Exa API
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
    - `product-card.tsx`: Elegant product card with hover effects
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
- **Styling**: Tailwind CSS 4, luxury white/cream/brown theme
- **Search API**: Exa (neural web search)
- **UI Components**: Radix UI primitives, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## UI Design
- **Theme**: Luxury white with stone/amber accents
- **Colors**: White, cream (stone-50), brown (stone-900), amber accents
- **Layout**: 3-column grid (responsive: 3 → 2 → 1 columns)
- **Cards**: Clean white cards with subtle shadows and hover lift
- **Typography**: Serif headings, clean sans-serif body
- **Animations**: Smooth scale, shadow, and transition effects

## Development

### Running the Application
The application runs via the Next.js Dev Server workflow on port 5000.

### Deployment
Deployment is configured for Replit autoscale:
- Build: `npm run build`
- Run: `npm run start`
Click the Publish button to deploy.

### Adding New Brands
Edit `components/handbags/explore-filters.tsx` and add to the `BRANDS` array.

### Adding New Bag Types
Edit `components/handbags/explore-filters.tsx` and add to the `BAG_TYPES` array.

### Modifying Card Design
Edit `components/handbags/product-card.tsx` to customize card appearance.

## User Preferences
- Luxury aesthetic with white/brown/black color scheme
- Clean, elegant design similar to high-end fashion sites
- Real product images when available from search results
