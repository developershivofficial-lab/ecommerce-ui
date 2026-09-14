import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Gopal Regal Golden Sateen Party Clutch',
    category: 'Clutches',
    price: 1899,
    originalPrice: 2799,
    rating: 4.9,
    reviewCount: 384,
    inStock: true,
    stockCount: 16,
    badge: 'Bestseller',
    description: 'An exquisite hand-embellished evening clutch framed in polished golden brass hardware with a detachable woven serpent chain. Crafted specifically for weddings, sangeet, and festive celebrations.',
    material: 'Rich Dupion Silk with Zari Embellishment & Brass Hardware',
    dimensions: '20 cm x 12 cm x 5 cm',
    features: [
      'Handcrafted zari and metallic sequins embroidery',
      'Sturdy magnetic snap clasp closure',
      'Detachable 120 cm golden brass crossbody chain',
      'Velvet lined interior with dedicated card and lipstick slot'
    ],
    colors: [
      { name: 'Royal Gold', hex: '#EAB308' },
      { name: 'Ivory Pearl', hex: '#FEFCE8' },
      { name: 'Midnight Black', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-2',
    name: 'Aura Saffiano Structured Handbag',
    category: 'Handbags',
    price: 2999,
    originalPrice: 4299,
    rating: 4.8,
    reviewCount: 512,
    inStock: true,
    stockCount: 12,
    badge: 'Bestseller',
    description: 'A timeless silhouette designed for modern women. Engineered with scratch-resistant Saffiano textured vegan leather, sturdy rolled top handles, and protective golden metal bottom feet.',
    material: 'High-Grade Saffiano Vegan Leather',
    dimensions: '31 cm x 24 cm x 13 cm',
    features: [
      'Triple compartment layout with central zippered divider',
      'Reinforced rolled vegan leather handles (14 cm drop)',
      'Adjustable and detachable matching shoulder strap',
      'Golden metallic studs at base to prevent scratches'
    ],
    colors: [
      { name: 'Sun Mustard', hex: '#CA8A04' },
      { name: 'Pure White & Gold', hex: '#FFFFFF' },
      { name: 'Classic Black', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-3',
    name: 'Marigold Blossom Embroidered Bridal Box Clutch',
    category: 'Clutches',
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewCount: 290,
    inStock: true,
    stockCount: 9,
    badge: 'Handcrafted',
    description: 'Artisanal bridal hard-box clutch embellished with intricate floral thread-work, pearls, and gold-finish metal lock closure. Pairs seamlessly with lehengas, sarees, and cocktail dresses.',
    material: 'Embroidered Raw Silk & Hard Alloy Shell',
    dimensions: '18 cm x 11 cm x 5.5 cm',
    features: [
      'Hand-sewn micro-pearls and golden thread motifs',
      'Smooth push-lock gemstone clasp',
      'Includes detachable golden link snake chain',
      'Spacious enough to comfortably hold iPhone Pro Max & makeup essentials'
    ],
    colors: [
      { name: 'Sunbeam Gold', hex: '#FACC15' },
      { name: 'Bridal Crimson', hex: '#991B1B' },
      { name: 'Pastel Peach Cream', hex: '#FEF08A' }
    ],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-4',
    name: 'Classic Parisian Vegan Leather Tote Bag',
    category: 'Tote Bags',
    price: 3199,
    originalPrice: 4499,
    rating: 4.8,
    reviewCount: 420,
    inStock: true,
    stockCount: 14,
    badge: 'Trending',
    description: 'The quintessential everyday luxury tote. Accommodates up to a 14-inch laptop alongside books, cosmetics, and your daily essentials in effortless elegance.',
    material: 'Premium Pebble-Grain Vegan Leather',
    dimensions: '38 cm x 29 cm x 14 cm',
    features: [
      'Padded interior compartment fits up to 14" laptop / iPad',
      'Comfortable shoulder drop length with double-stitched joints',
      'Smooth Japanese YKK metal zip closure',
      'Includes complimentary matching zippered pouch'
    ],
    colors: [
      { name: 'Warm Tan Gold', hex: '#D97706' },
      { name: 'Chalk White', hex: '#F8FAFC' },
      { name: 'Coal Black', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-5',
    name: 'Sunset Mustard Quilted Crossbody Sling',
    category: 'Sling Bags',
    price: 1799,
    originalPrice: 2499,
    rating: 4.7,
    reviewCount: 265,
    inStock: true,
    stockCount: 20,
    badge: 'New Arrival',
    description: 'Chevron quilted sling with plush cushioned touch, high-polish golden turn-lock clasp, and interwoven leather-chain crossbody strap. Compact yet remarkably roomy.',
    material: 'Plush Quilted Microfiber Vegan Leather',
    dimensions: '22 cm x 15 cm x 7 cm',
    features: [
      'Signature chevron diamond quilting pattern',
      'Luxurious interlocking turn-lock hardware',
      'Convertible chain strap (wear as shoulder bag or crossbody)',
      'Rear quick-access pocket for smartphone or metro card'
    ],
    colors: [
      { name: 'Mustard Yellow', hex: '#EAB308' },
      { name: 'Porcelain White', hex: '#FFFFFF' },
      { name: 'Espresso Tan', hex: '#78350F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-6',
    name: 'Luxe Croc-Embossed Top-Handle Satchel',
    category: 'Handbags',
    price: 3599,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 310,
    inStock: true,
    stockCount: 8,
    badge: 'Trending',
    description: 'Statement high-shine crocodile-embossed structured satchel. Features an architectural top handle, gold padlock charm accent, and detachable guitar-weave shoulder strap.',
    material: 'High-Gloss Croc-Embossed Vegan Leather',
    dimensions: '28 cm x 21 cm x 11 cm',
    features: [
      'Hand-polished golden padlock & key charm',
      'Dual carrying options: rigid top handle or wide shoulder strap',
      'Satin peach lining with dual phone and zipper pockets',
      'Solid bottom brass base studs'
    ],
    colors: [
      { name: 'Honey Amber', hex: '#F59E0B' },
      { name: 'Onyx Black', hex: '#18181B' },
      { name: 'Snow Cream', hex: '#FEFCE8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-7',
    name: 'Crystal Encrusted Minaudière Evening Clutch',
    category: 'Clutches',
    price: 2899,
    originalPrice: 3999,
    rating: 4.9,
    reviewCount: 195,
    inStock: true,
    stockCount: 7,
    badge: 'Festive Pick',
    description: 'Jewelry-inspired hard case minaudière encrusted with multifaceted Austrian crystals set in a yellow-gold framework. A showstopper accessory for gala receptions and weddings.',
    material: 'Austrian Crystals & 18K Gold Plated Brass Shell',
    dimensions: '19 cm x 10 cm x 5 cm',
    features: [
      'Over 400 precision hand-placed crystal facets',
      'Faceted jewel push-lock top clasp',
      'Seamless velvet interior lining',
      'Includes premium drop-in snake chain'
    ],
    colors: [
      { name: 'Dazzling Gold', hex: '#FACC15' },
      { name: 'Silver Crystal', hex: '#E2E8F0' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-8',
    name: 'Monogram Canvas Structured Work Tote',
    category: 'Tote Bags',
    price: 2799,
    originalPrice: 3899,
    rating: 4.8,
    reviewCount: 340,
    inStock: true,
    stockCount: 15,
    badge: 'Hot Deal',
    description: 'Designed for professional hustle and weekend shopping. Heavy-duty coated canvas with contrasting yellow leather handles and water-repellent nylon interior.',
    material: 'Coated Twill Canvas with Leather Trim',
    dimensions: '36 cm x 27 cm x 13 cm',
    features: [
      'High-capacity main chamber with zipper security',
      'Water and stain resistant protective outer coating',
      'Interior bottle holder and key leash clip',
      'Reinforced load-bearing cross-stitching'
    ],
    colors: [
      { name: 'Warm Beige & Gold', hex: '#FEF08A' },
      { name: 'Black & Gold Monogram', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-9',
    name: 'Honeycomb Half-Moon Leather Shoulder Bag',
    category: 'Handbags',
    price: 2299,
    originalPrice: 3199,
    rating: 4.7,
    reviewCount: 182,
    inStock: true,
    stockCount: 11,
    badge: 'Trending',
    description: 'Sleek 90s vintage half-moon curve shoulder bag. Fits neatly beneath the arm with a comfortable ergonomic strap and polished gold zip closure.',
    material: 'Smooth Ultra-Matte Vegan Leather',
    dimensions: '26 cm x 14 cm x 6.5 cm',
    features: [
      'Modern geometric crescent silhouette',
      'Gold-toned metallic puller and buckle adjuster',
      'Scratch-resistant water-wipeable finish',
      'Spacious enough for phone, keys, sunglasses, and wallet'
    ],
    colors: [
      { name: 'Canary Yellow', hex: '#FACC15' },
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Caramel Brown', hex: '#B45309' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-10',
    name: 'Gilded Chain Mini Flap Sling Bag',
    category: 'Sling Bags',
    price: 1699,
    originalPrice: 2399,
    rating: 4.8,
    reviewCount: 228,
    inStock: true,
    stockCount: 18,
    badge: 'Bestseller',
    description: 'Chic everyday mini flap bag with chunky golden curb chain handle and an additional long crossbody strap. Perfect for brunch dates, shopping, and evening strolls.',
    material: 'Supple Nappa-grain Vegan Leather',
    dimensions: '19 cm x 13 cm x 6 cm',
    features: [
      'Chunky architectural curb chain top handle',
      'Magnetic flap snap closure for quick access',
      'Dual interior compartments with card slots',
      'Includes adjustable matching leather strap'
    ],
    colors: [
      { name: 'Warm Cream White', hex: '#FEFCE8' },
      { name: 'Golden Honey', hex: '#EAB308' },
      { name: 'Jet Black', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-11',
    name: 'Imperial Velvet Zari Work Potli Clutch',
    category: 'Clutches',
    price: 1599,
    originalPrice: 2199,
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    stockCount: 14,
    badge: 'Handcrafted',
    description: 'Traditional Royal Indian potli clutch crafted in plush golden velvet with heavy pearl tassel latkans and drawstring closure. A quintessential match for festive occasions.',
    material: 'Micro-Velvet with Golden Zardozi & Pearl Tassels',
    dimensions: '22 cm x 20 cm',
    features: [
      'Authentic Zardozi hand-embroidery by master artisans',
      'Heavy beaded drawstring with pearl hangings',
      'Sturdy braided golden handle strap',
      'Expands to accommodate phones and jewelry boxes'
    ],
    colors: [
      { name: 'Golden Velvet', hex: '#EAB308' },
      { name: 'Pearl Cream', hex: '#FEF9C3' },
      { name: 'Ruby Maroon', hex: '#881337' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'prod-12',
    name: 'Slim Bifold Leather Wallet & Card Clutch',
    category: 'Wallets',
    price: 1199,
    originalPrice: 1699,
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    stockCount: 25,
    badge: 'Hot Deal',
    description: 'Slim bifold travel wallet with 8 card slots, zipper coin pocket, ID window, and cash sleeves. Fits easily into any handbag or carried solo as a minimalist clutch.',
    material: 'Grain Vegan Leather with RFID Blocking Layer',
    dimensions: '19 cm x 10 cm x 2 cm',
    features: [
      'Built-in RFID blocking fabric prevents electronic theft',
      '8 quick-access card slots + zippered coin compartment',
      'Gold foil embossed Gopal Bags emblem',
      'Slim profile stays light and organized'
    ],
    colors: [
      { name: 'Ochre Yellow', hex: '#CA8A04' },
      { name: 'Ivory White', hex: '#FFFFFF' },
      { name: 'Midnight Charcoal', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Handbags',
  'Clutches',
  'Tote Bags',
  'Sling Bags',
  'Wallets'
] as const;

export const PROMO_CODES: Record<string, { discountPercent: number; minSpend: number; description: string }> = {
  GOPAL20: { discountPercent: 20, minSpend: 1500, description: '20% OFF on Gopal Bags over ₹1500' },
  YELLOW20: { discountPercent: 20, minSpend: 1500, description: '20% OFF launch discount' },
  FIRST10: { discountPercent: 10, minSpend: 999, description: '10% OFF on all orders' },
  FREESHIP: { discountPercent: 0, minSpend: 0, description: 'Free Express Courier Shipping' }
};
