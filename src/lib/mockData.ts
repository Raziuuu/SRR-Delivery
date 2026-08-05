import { Category, Product, Coupon, Banner, DeliverySettings, StoreSettings } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Vegetables',
    slug: 'vegetables',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Leaf',
    display_order: 1,
  },
  {
    id: 'cat-2',
    name: 'Fruits',
    slug: 'fruits',
    image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Apple',
    display_order: 2,
  },
  {
    id: 'cat-3',
    name: 'Dairy',
    slug: 'dairy',
    image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Milk',
    display_order: 3,
  },
  {
    id: 'cat-4',
    name: 'Groceries',
    slug: 'groceries',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Wheat',
    display_order: 4,
  },
  {
    id: 'cat-5',
    name: 'Beverages',
    slug: 'beverages',
    image_url: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Coffee',
    display_order: 5,
  },
  {
    id: 'cat-6',
    name: 'Bakery',
    slug: 'bakery',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Croissant',
    display_order: 6,
  },
  {
    id: 'cat-7',
    name: 'Snacks',
    slug: 'snacks',
    image_url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Cookie',
    display_order: 7,
  },
  {
    id: 'cat-8',
    name: 'Meat (Chicken, Mutton, Fish)',
    slug: 'meat',
    image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
    icon_name: 'Drumstick',
    display_order: 8,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Category 8: Meat (Chicken, Mutton, Fish)
  {
    id: 'prod-meat-1',
    category_id: 'cat-8',
    name: 'Fresh Farm Chicken Curry Cut',
    slug: 'fresh-farm-chicken-curry-cut',
    description: 'Antibiotic-free, clean skinless fresh chicken cut into perfect curry pieces.',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Meat (Chicken, Mutton, Fish)',
    brands: [
      {
        id: 'brand-m1',
        product_id: 'prod-meat-1',
        name: 'SRR Fresh Meats',
        variants: [
          { id: 'v-m101', brand_id: 'brand-m1', unit: 'gram', quantity: '500 g', price: 140, stock: 40, is_available: true },
          { id: 'v-m102', brand_id: 'brand-m1', unit: 'kg', quantity: '1 kg', price: 260, stock: 30, is_available: true },
        ],
      },
      {
        id: 'brand-m2',
        product_id: 'prod-meat-1',
        name: 'Tender Cuts',
        variants: [
          { id: 'v-m103', brand_id: 'brand-m2', unit: 'kg', quantity: '1 kg', price: 280, stock: 25, is_available: true },
        ],
      },
    ],
  },
  {
    id: 'prod-meat-2',
    category_id: 'cat-8',
    name: 'Fresh Tender Goat Mutton',
    slug: 'fresh-tender-goat-mutton',
    description: 'Premium, tender goat meat cut into rich curry and biryani pieces.',
    image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Meat (Chicken, Mutton, Fish)',
    brands: [
      {
        id: 'brand-m3',
        product_id: 'prod-meat-2',
        name: 'SRR Fresh Meats',
        variants: [
          { id: 'v-m201', brand_id: 'brand-m3', unit: 'gram', quantity: '500 g', price: 420, stock: 20, is_available: true },
          { id: 'v-m202', brand_id: 'brand-m3', unit: 'kg', quantity: '1 kg', price: 820, stock: 15, is_available: true },
        ],
      },
    ],
  },
  {
    id: 'prod-meat-3',
    category_id: 'cat-8',
    name: 'Freshwater Rohu & Catla Fish',
    slug: 'freshwater-rohu-catla-fish',
    description: 'Freshly cleaned, descaled freshwater fish cut into steak slices.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Meat (Chicken, Mutton, Fish)',
    brands: [
      {
        id: 'brand-m4',
        product_id: 'prod-meat-3',
        name: 'Ocean Fresh',
        variants: [
          { id: 'v-m301', brand_id: 'brand-m4', unit: 'gram', quantity: '500 g', price: 160, stock: 35, is_available: true },
          { id: 'v-m302', brand_id: 'brand-m4', unit: 'kg', quantity: '1 kg', price: 310, stock: 20, is_available: true },
        ],
      },
    ],
  },

  // Category 4: Groceries
  {
    id: 'prod-1',
    category_id: 'cat-4',
    name: 'Premium Basmati Rice',
    slug: 'premium-basmati-rice',
    description: 'Aromatic, long-grain aged basmati rice perfect for biryani and daily meals.',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Groceries',
    brands: [
      {
        id: 'brand-1',
        product_id: 'prod-1',
        name: 'India Gate',
        variants: [
          { id: 'v-101', brand_id: 'brand-1', unit: 'gram', quantity: '500 g', price: 95, stock: 50, is_available: true },
          { id: 'v-102', brand_id: 'brand-1', unit: 'kg', quantity: '1 kg', price: 185, stock: 40, is_available: true },
          { id: 'v-103', brand_id: 'brand-1', unit: 'kg', quantity: '5 kg', price: 890, stock: 25, is_available: true },
        ],
      },
      {
        id: 'brand-2',
        product_id: 'prod-1',
        name: 'Daawat',
        variants: [
          { id: 'v-104', brand_id: 'brand-2', unit: 'gram', quantity: '500 g', price: 105, stock: 60, is_available: true },
          { id: 'v-105', brand_id: 'brand-2', unit: 'kg', quantity: '1 kg', price: 199, stock: 35, is_available: true },
          { id: 'v-106', brand_id: 'brand-2', unit: 'kg', quantity: '5 kg', price: 950, stock: 20, is_available: true },
        ],
      },
    ],
  },
  {
    id: 'prod-4',
    category_id: 'cat-4',
    name: 'Refined Sunflower Oil',
    slug: 'refined-sunflower-oil',
    description: 'Light, healthy refined sunflower cooking oil with Vitamin A & D.',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Groceries',
    brands: [
      {
        id: 'brand-7',
        product_id: 'prod-4',
        name: 'Fortune Sunlite',
        variants: [
          { id: 'v-401', brand_id: 'brand-7', unit: 'liter', quantity: '1 L', price: 140, stock: 50, is_available: true },
          { id: 'v-402', brand_id: 'brand-7', unit: 'liter', quantity: '5 L', price: 685, stock: 20, is_available: true },
        ],
      },
    ],
  },

  // Category 3: Dairy
  {
    id: 'prod-2',
    category_id: 'cat-3',
    name: 'Fresh Cow Milk',
    slug: 'fresh-cow-milk',
    description: 'Farm-fresh pasteurized milk, rich in calcium and natural proteins.',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Dairy',
    brands: [
      {
        id: 'brand-4',
        product_id: 'prod-2',
        name: 'Amul Taaza',
        variants: [
          { id: 'v-201', brand_id: 'brand-4', unit: 'ml', quantity: '500 ml', price: 27, stock: 100, is_available: true },
          { id: 'v-202', brand_id: 'brand-4', unit: 'liter', quantity: '1 L', price: 54, stock: 80, is_available: true },
        ],
      },
    ],
  },

  // Category 1: Vegetables
  {
    id: 'prod-3',
    category_id: 'cat-1',
    name: 'Fresh Organic Tomatoes',
    slug: 'fresh-organic-tomatoes',
    description: 'Juicy, vine-ripened red tomatoes sourced directly from local farms.',
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Vegetables',
    brands: [
      {
        id: 'brand-6',
        product_id: 'prod-3',
        name: 'SRR Fresh Farm',
        variants: [
          { id: 'v-301', brand_id: 'brand-6', unit: 'gram', quantity: '500 g', price: 24, stock: 120, is_available: true },
          { id: 'v-302', brand_id: 'brand-6', unit: 'kg', quantity: '1 kg', price: 45, stock: 80, is_available: true },
        ],
      },
    ],
  },

  // Category 2: Fruits
  {
    id: 'prod-5',
    category_id: 'cat-2',
    name: 'Fresh Kashmiri Apples',
    slug: 'fresh-kashmiri-apples',
    description: 'Crisp, sweet, handpicked premium Kashmiri red apples.',
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Fruits',
    brands: [
      {
        id: 'brand-9',
        product_id: 'prod-5',
        name: 'SRR Orchards',
        variants: [
          { id: 'v-501', brand_id: 'brand-9', unit: 'gram', quantity: '500 g', price: 85, stock: 60, is_available: true },
          { id: 'v-502', brand_id: 'brand-9', unit: 'kg', quantity: '1 kg', price: 160, stock: 40, is_available: true },
        ],
      },
    ],
  },

  // Category 5: Beverages
  {
    id: 'prod-6',
    category_id: 'cat-5',
    name: 'Natural Orange Juice',
    slug: 'natural-orange-juice',
    description: '100% pure squeezed orange juice with pulp, zero added sugar.',
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    category_name: 'Beverages',
    brands: [
      {
        id: 'brand-10',
        product_id: 'prod-6',
        name: 'Real Fruit Power',
        variants: [
          { id: 'v-601', brand_id: 'brand-10', unit: 'ml', quantity: '200 ml', price: 30, stock: 90, is_available: true },
          { id: 'v-602', brand_id: 'brand-10', unit: 'liter', quantity: '1 L', price: 125, stock: 50, is_available: true },
        ],
      },
    ],
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'SRR10',
    discount_percentage: 10,
    min_order_amount: 199,
    max_discount_amount: 50,
    is_active: true,
  },
  {
    id: 'c-2',
    code: 'FRESH20',
    discount_percentage: 20,
    min_order_amount: 499,
    max_discount_amount: 120,
    is_active: true,
  },
  {
    id: 'c-3',
    code: 'FESTIVAL50',
    discount_percentage: 15,
    min_order_amount: 999,
    max_discount_amount: 250,
    is_active: true,
  },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b-1',
    title: 'Welcome Offer',
    text: '🎉 SRR10 • Flat 10% OFF • Minimum Order ₹199 • Maximum Discount ₹50',
    is_active: true,
    display_order: 1,
  },
  {
    id: 'b-2',
    title: 'Free Delivery',
    text: '🚚 Free Express Delivery on orders above ₹499!',
    is_active: true,
    display_order: 2,
  },
  {
    id: 'b-3',
    title: 'Festival Offer',
    text: '🎊 Special Festival Offer • Extra 15% OFF with code FESTIVAL50',
    is_active: true,
    display_order: 3,
  },
];

export const INITIAL_DELIVERY_SETTINGS: DeliverySettings = {
  charge_per_km: 10,
  min_delivery_charge: 25,
  max_delivery_radius_km: 15,
  free_delivery_threshold: 499,
};

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  store_name: 'SRR Fresh Grocery Delivery',
  contact_number: '+91 98765 43210',
  whatsapp_number: '+91 98765 43210',
  business_address: '123 SRR Main Road, Market Complex, SRR City',
  working_hours: '7:00 AM - 10:00 PM (7 Days a Week)',
};

export const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    review: 'SRR Delivery is amazingly fast! Ordered vegetables & fresh chicken at 8 AM and got everything delivered by 8:25 AM.',
  },
  {
    id: 'rev-2',
    name: 'Rajesh Verma',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    review: 'The quality of fresh mutton, fish, and Basmati rice from SRR is top notch. The instant variant selector makes ordering super easy.',
  },
  {
    id: 'rev-3',
    name: 'Ananya Reddy',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    review: 'Live order tracking is accurate! Loved how the admin status auto-updates from shopping in progress to delivered.',
  },
  {
    id: 'rev-4',
    name: 'Suresh Kumar',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    review: 'Free delivery above ₹499 is a huge money saver. Highly recommended for every family in SRR city!',
  },
];
