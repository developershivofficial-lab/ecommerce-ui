import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AuraPods Pro Wireless Earbuds',
    category: 'Audio',
    price: 3499,
    originalPrice: 4999,
    rating: 4.8,
    reviewCount: 428,
    inStock: true,
    stockCount: 14,
    badge: 'Best Seller',
    description: 'Ultra-low latency noise cancelling wireless earbuds with rich bass, spatial audio calibration, and 36-hour battery backup with fast wireless charging.',
    features: [
      'Active Noise Cancellation (ANC) up to 38dB',
      'Transparency Mode with dual environmental mic',
      'IPX5 sweat and water resistance',
      'Instant Bluetooth 5.3 pairing with dual-device switch'
    ],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Canary Yellow', hex: '#FACC15' },
      { name: 'Matte Obsidian', hex: '#1E293B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-2',
    name: 'Solara Studio Chronograph Watch',
    category: 'Accessories',
    price: 5999,
    originalPrice: 8499,
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stockCount: 8,
    badge: 'Trending',
    description: 'Precision Japanese quartz movement timepiece encased in brushed surgical stainless steel with scratch-resistant sapphire crystal and genuine Italian leather strap.',
    features: [
      'Sapphire Crystal Scratch-Proof Glass',
      '50-meter water resistance (5 ATM)',
      'Sub-dial 24-hour chronograph & date window',
      'Interchangeable quick-release leather strap'
    ],
    colors: [
      { name: 'Honey Amber Gold', hex: '#EAB308' },
      { name: 'Silver Steel', hex: '#E2E8F0' },
      { name: 'Midnight Charcoal', hex: '#0F172A' }
    ],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-3',
    name: 'Oversized Heavyweight Sunny Hoodie',
    category: 'Fashion',
    price: 2499,
    originalPrice: 3299,
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    stockCount: 22,
    badge: 'Hot Deal',
    description: 'Custom relaxed streetwear drop-shoulder silhouette woven from 420 GSM French Terry organic cotton. Ultra-soft brushed fleece interior designed for all-season comfort.',
    features: [
      '420 GSM 100% combed organic ring-spun cotton',
      'Double-lined structured hood with hidden drawstring',
      'Pre-shrunk fabric to prevent post-wash shrinking',
      'High-density ribbed cuffs and waist hem'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Warm Cream White', hex: '#FEFCE8' },
      { name: 'Mustard Sun', hex: '#EAB308' },
      { name: 'Slate Gray', hex: '#64748B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-4',
    name: 'HyperGlide Aerodynamic Sneakers',
    category: 'Footwear',
    price: 4799,
    originalPrice: 6999,
    rating: 4.9,
    reviewCount: 564,
    inStock: true,
    stockCount: 11,
    badge: '20% OFF',
    description: 'Engineered breathable mesh upper with responsive nitrogen-infused foam midsole. Delivers cloud-like energy return whether running city miles or casual walking.',
    features: [
      'Nitrogen-infused cloud cushioning outsole',
      'Adaptive knit collar for frictionless ankle fit',
      'Reflective luminous heel accents for night visibility',
      'High-traction directional rubber waffle outsole'
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [
      { name: 'Solar Yellow & White', hex: '#FACC15' },
      { name: 'Chalk White', hex: '#F8FAFC' },
      { name: 'Carbon Stealth', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-5',
    name: 'Minimalist Nordic Warm Glow Desk Lamp',
    category: 'Home',
    price: 2199,
    originalPrice: 2999,
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
    stockCount: 19,
    badge: 'New',
    description: 'Sculptural matte aluminum reading lamp with 3 touch-dimming color temperatures (3000K-6500K) and integrated 15W Qi wireless fast charging pad on the solid beech wood base.',
    features: [
      'Stepless dimming with warm sun mood presets',
      'Built-in 15W Qi wireless fast smartphone charger',
      'Flicker-free eye protection diffusion plate',
      '90-degree adjustable articulated aluminum arm'
    ],
    colors: [
      { name: 'Nordic White & Oak', hex: '#FFFFFF' },
      { name: 'Sun Yellow Accent', hex: '#FDE047' },
      { name: 'Matte Graphite', hex: '#334155' }
    ],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-6',
    name: 'Nova 4K HDR Smart Portable Projector',
    category: 'Electronics',
    price: 18999,
    originalPrice: 24999,
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    stockCount: 5,
    badge: 'Trending',
    description: 'Compact 900 ANSI Lumens cinematic cinema projector with auto-focus, keystone correction, built-in Dolby Audio stereo speakers, and Android TV streaming.',
    features: [
      'True 1080p native resolution with 4K decoding support',
      'Instant 1-second auto-focus & obstacle avoidance',
      'Dual 10W Harman-tuned bass reflex chamber speakers',
      'Built-in battery for 2.5 hours of wire-free movie playback'
    ],
    colors: [
      { name: 'Glacier White', hex: '#FFFFFF' },
      { name: 'Warm Amber Trim', hex: '#F59E0B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-7',
    name: 'Veloce Ceramic Matte Coffee Pour-Over Set',
    category: 'Home',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 220,
    inStock: true,
    stockCount: 16,
    description: 'Hand-crafted artisanal ceramic dripper with thermal insulated server carafe and precision stainless steel reusable filter for the richest artisanal brew.',
    features: [
      'High-fire non-porous ceramic keeps optimal 92°C heat',
      'Includes 600ml borosilicate glass server with level markers',
      'Ergonomic anti-drip spout with acacia wood lid',
      'Dishwasher safe & eco-friendly zero paper waste'
    ],
    colors: [
      { name: 'Cream White', hex: '#FEF08A' },
      { name: 'Sunflower Yellow', hex: '#FACC15' }
    ],
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-8',
    name: 'Pulse ANC Studio Over-Ear Headphones',
    category: 'Audio',
    price: 8999,
    originalPrice: 12999,
    rating: 4.8,
    reviewCount: 380,
    inStock: true,
    stockCount: 7,
    badge: 'Hot Deal',
    description: 'High-Fidelity 40mm beryllium drivers delivering studio reference sound. Features memory foam magnetic ear cushions and a custom equalizer app.',
    features: [
      'Custom 40mm bio-cellulose dynamic drivers',
      'Hybrid ANC with 4 beamforming voice microphones',
      'Up to 50 hours playtime on a single charge',
      'USB-C rapid charge (10 mins charge gives 5 hours)'
    ],
    colors: [
      { name: 'Sunbeam Gold & Ivory', hex: '#FDE047' },
      { name: 'Pearl White', hex: '#FFFFFF' },
      { name: 'Pitch Black', hex: '#18181B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-9',
    name: 'Urban Transit Water-Resistant Roll-top Backpack',
    category: 'Accessories',
    price: 3199,
    originalPrice: 4299,
    rating: 4.7,
    reviewCount: 204,
    inStock: true,
    stockCount: 15,
    badge: 'Best Seller',
    description: 'Weatherproof 25L modular commuter backpack with padded 16-inch laptop compartment, ergonomic ventilated air-mesh back panel, and magnetic Fidlock buckle.',
    features: [
      'Cordura 900D water-repellent ballistic weave',
      'Dedicated suspended sleeve fits up to 16" MacBook Pro',
      'Secret luggage pass-through strap and RFID pocket',
      'German Fidlock quick-release magnetic latch'
    ],
    colors: [
      { name: 'Ivory & Mustard Accent', hex: '#FEF08A' },
      { name: 'Pure Chalk', hex: '#F1F5F9' },
      { name: 'Charcoal Black', hex: '#1E293B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-10',
    name: 'Mechanical Tactile Wireless Keyboard 75%',
    category: 'Electronics',
    price: 5499,
    originalPrice: 7299,
    rating: 4.9,
    reviewCount: 290,
    inStock: true,
    stockCount: 12,
    badge: 'New',
    description: 'Hot-swappable gasket mount mechanical keyboard with custom pre-lubed yellow tactile switches, multi-function rotary media knob, and warm RGB backlighting.',
    features: [
      'Gasket mounted with 5-layer acoustic dampening foam',
      'Pre-lubed custom Milky Yellow tactile switches',
      'Triple-mode connectivity (2.4GHz, BT 5.1, USB-C)',
      'CNC milled solid aluminum control knob'
    ],
    colors: [
      { name: 'Retro Yellow & White', hex: '#FACC15' },
      { name: 'Minimalist Clean White', hex: '#FFFFFF' }
    ],
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-11',
    name: 'Suede Minimalist Low-Top Court Shoes',
    category: 'Footwear',
    price: 3999,
    originalPrice: 5499,
    rating: 4.6,
    reviewCount: 118,
    inStock: true,
    stockCount: 9,
    description: 'Classic European tennis silhouette crafted from supple water-treated suede with natural gum rubber cupsole and antimicrobial cork insole.',
    features: [
      'Water-resistant treated premium split suede',
      'Orthopedic shock-absorbing cork footbed',
      'Reinforced double-stitched heel counter',
      'Flexible vulcanized gum rubber sole'
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: [
      { name: 'Sand Cream', hex: '#FEF9C3' },
      { name: 'Solar Ochre', hex: '#CA8A04' }
    ],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-12',
    name: 'Polarized Titanium Aviator Sunglasses',
    category: 'Accessories',
    price: 2799,
    originalPrice: 3899,
    rating: 4.7,
    reviewCount: 174,
    inStock: true,
    stockCount: 18,
    description: 'Ultra-lightweight Japanese aerospace-grade titanium wireframes with Category 3 polarized amber-tinted lenses offering 100% UV400 solar protection.',
    features: [
      'Japanese ultra-flex titanium weighing just 18 grams',
      'Tri-acetate cellulose (TAC) 100% UV400 polarized lenses',
      'Anti-reflective back coating and scratch protection',
      'Hypoallergenic medical grade silicone nose pads'
    ],
    colors: [
      { name: 'Polished Gold & Amber', hex: '#EAB308' },
      { name: 'Silver Smoke', hex: '#94A3B8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Electronics',
  'Audio',
  'Fashion',
  'Footwear',
  'Home',
  'Accessories'
] as const;

export const PROMO_CODES: Record<string, { discountPercent: number; minSpend: number; description: string }> = {
  YELLOW20: { discountPercent: 20, minSpend: 2000, description: '20% OFF on orders above ₹2000' },
  SOLARA10: { discountPercent: 10, minSpend: 1000, description: '10% OFF on all orders' },
  FREESHIP: { discountPercent: 0, minSpend: 0, description: 'Free Express Shipping' }
};
