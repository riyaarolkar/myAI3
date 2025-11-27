export interface ParsedQuery {
  searchText: string;
  brand: string | null;
  color: string | null;
  maxPrice: number | null;
  minPrice: number | null;
  bagType: string | null;
  occasion: string | null;
}

const BRANDS: Record<string, string> = {
  'hermes': 'Hermès',
  'hermès': 'Hermès',
  'chanel': 'Chanel',
  'louis vuitton': 'Louis Vuitton',
  'lv': 'Louis Vuitton',
  'gucci': 'Gucci',
  'prada': 'Prada',
  'dior': 'Dior',
  'celine': 'Céline',
  'céline': 'Céline',
  'bottega veneta': 'Bottega Veneta',
  'bottega': 'Bottega Veneta',
  'balenciaga': 'Balenciaga',
  'saint laurent': 'Saint Laurent',
  'ysl': 'Saint Laurent',
  'fendi': 'Fendi',
  'loewe': 'Loewe',
  'chloe': 'Chloé',
  'chloé': 'Chloé',
  'givenchy': 'Givenchy',
  'valentino': 'Valentino',
  'burberry': 'Burberry',
  'goyard': 'Goyard',
};

const COLORS = [
  'black', 'white', 'red', 'blue', 'green', 'pink', 'gold', 'silver',
  'brown', 'tan', 'beige', 'cream', 'navy', 'burgundy', 'orange',
  'yellow', 'purple', 'grey', 'gray', 'nude', 'camel', 'cognac',
];

const BAG_TYPES: Record<string, string> = {
  'tote': 'Tote',
  'shoulder': 'Shoulder',
  'shoulder bag': 'Shoulder',
  'crossbody': 'Crossbody',
  'cross body': 'Crossbody',
  'clutch': 'Clutch',
  'top handle': 'Top-handle',
  'top-handle': 'Top-handle',
  'satchel': 'Satchel',
  'hobo': 'Hobo',
  'backpack': 'Backpack',
  'bucket': 'Bucket',
  'bucket bag': 'Bucket',
  'flap': 'Flap',
  'flap bag': 'Flap',
  'belt bag': 'Belt Bag',
  'mini bag': 'Mini Bag',
  'mini': 'Mini Bag',
  'evening bag': 'Clutch',
  'evening': 'Clutch',
  'work bag': 'Tote',
  'office bag': 'Tote',
  'travel bag': 'Tote',
  'weekend bag': 'Tote',
};

const OCCASION_TO_BAG_TYPE: Record<string, string> = {
  'cocktail': 'Clutch',
  'cocktail dinner': 'Clutch',
  'dinner': 'Clutch',
  'party': 'Clutch',
  'evening': 'Clutch',
  'night out': 'Clutch',
  'date night': 'Clutch',
  'wedding': 'Clutch',
  'gala': 'Clutch',
  'formal': 'Clutch',
  'work': 'Tote',
  'office': 'Tote',
  'business': 'Tote',
  'professional': 'Tote',
  'everyday': 'Shoulder',
  'daily': 'Shoulder',
  'casual': 'Crossbody',
  'weekend': 'Crossbody',
  'travel': 'Tote',
  'vacation': 'Crossbody',
  'brunch': 'Crossbody',
  'shopping': 'Tote',
};

export function parseConversationalQuery(input: string): ParsedQuery {
  const lowerInput = input.toLowerCase().trim();
  
  let brand: string | null = null;
  let color: string | null = null;
  let maxPrice: number | null = null;
  let minPrice: number | null = null;
  let bagType: string | null = null;
  let occasion: string | null = null;

  for (const [key, value] of Object.entries(BRANDS)) {
    if (lowerInput.includes(key)) {
      brand = value;
      break;
    }
  }

  for (const c of COLORS) {
    if (lowerInput.includes(c)) {
      color = c;
      break;
    }
  }

  for (const [key, value] of Object.entries(BAG_TYPES)) {
    if (lowerInput.includes(key)) {
      bagType = value;
      break;
    }
  }

  if (!bagType) {
    for (const [key, value] of Object.entries(OCCASION_TO_BAG_TYPE)) {
      if (lowerInput.includes(key)) {
        occasion = key;
        bagType = value;
        break;
      }
    }
  }

  const pricePatterns = [
    /under\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /below\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /less than\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /max\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /up to\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /budget\s*(?:of|is)?\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /\$\s*(\d{1,3}(?:,?\d{3})*)\s*(?:or less|max|maximum)/i,
  ];

  for (const pattern of pricePatterns) {
    const match = input.match(pattern);
    if (match) {
      maxPrice = parseInt(match[1].replace(/,/g, ''));
      break;
    }
  }

  const minPricePatterns = [
    /over\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /above\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /more than\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /at least\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
    /starting\s*(?:at|from)?\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i,
  ];

  for (const pattern of minPricePatterns) {
    const match = input.match(pattern);
    if (match) {
      minPrice = parseInt(match[1].replace(/,/g, ''));
      break;
    }
  }

  const rangePattern = /\$?\s*(\d{1,3}(?:,?\d{3})*)\s*(?:to|-)\s*\$?\s*(\d{1,3}(?:,?\d{3})*)/i;
  const rangeMatch = input.match(rangePattern);
  if (rangeMatch) {
    minPrice = parseInt(rangeMatch[1].replace(/,/g, ''));
    maxPrice = parseInt(rangeMatch[2].replace(/,/g, ''));
  }

  let searchText = input;
  
  const searchParts: string[] = [];
  if (brand) searchParts.push(brand);
  if (color) searchParts.push(color);
  if (bagType) searchParts.push(bagType.toLowerCase());
  searchParts.push('handbag');
  
  searchText = searchParts.join(' ');

  return {
    searchText,
    brand,
    color,
    maxPrice,
    minPrice,
    bagType,
    occasion,
  };
}
