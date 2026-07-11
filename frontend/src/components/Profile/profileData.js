// =============================================================================
// profileData.js — Shared Profile Data Constants
// Smart Krishi Mitra
// =============================================================================
// All dummy data for Farmer, Vendor, and Customer profiles.
// Imported by FarmerProfile, VendorProfile, and CustomerProfile.
//
// When the real backend (Node.js + MongoDB + JWT) is connected:
//   Replace this static data with API calls / context state.
// =============================================================================

export const PROFILE_DATA = {
  farmer: {
    name: 'Raj Patel',
    role: 'Farmer',
    avatar: '👨‍🌾',
    banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&h=300&fit=crop',
    location: 'Nashik, Maharashtra',
    memberSince: 'March 2024',
    verified: true,
    completion: 92,
    personal: {
      fullName: 'Rajesh Patel',
      email: 'raj.patel@agrimail.in',
      phone: '+91 98765 43210',
      gender: 'Male',
      dob: '1985-05-14',
      address: 'Gat No. 104, Patel Farms, Niphad',
      state: 'Maharashtra',
      city: 'Nashik',
      village: 'Niphad',
      pincode: '422301',
      language: 'Marathi, Hindi',
      occupation: 'Organic Farmer',
    },
    roleSpecific: {
      farmName: 'Patel Organic Farms',
      farmSize: '8.5 Acres',
      soilType: 'Black Soil (Vertisols)',
      primaryCrops: 'Wheat, Onion, Tomato, Grapes',
      experience: '12 Years',
      organicFarming: 'Certified (NPOP Standard)',
      equipmentOwned: 'Tractor (John Deere), Drip Irrigation System, Rotavator, Seed Drill',
    },
    stats: [
      { label: 'Crops Sold', value: '142 Quintals', icon: '🌾', trend: '+12% vs last year' },
      { label: 'Total Earnings', value: '₹4,82,500', icon: '💰', trend: 'MSP guaranteed' },
      { label: 'Seller Rating', value: '4.9 / 5', icon: '⭐', trend: '120 reviews' },
      { label: 'Completed Deals', value: '98 Orders', icon: '📦', trend: '100% fulfillment' },
    ],
    achievements: [
      { name: '🌾 Top Seller', desc: 'Highest sales in Nashik region' },
      { name: '🏆 Trusted Farmer', desc: 'High buyer ratings and fast delivery' },
      { name: '🥇 Century Club', desc: 'Completed 100+ transactions' },
      { name: '🎯 Early Adopter', desc: 'Joined in beta test launch' },
    ],
    recentTransactions: [
      { id: 'TXN-84920', crop: '🌾 Wheat', quantity: '50 Q', buyer: 'AgroMart Store', amount: '₹1,17,500', status: 'Completed', date: 'Jun 28, 2026' },
      { id: 'TXN-90210', crop: '🍚 Rice', quantity: '30 Q', buyer: 'Amit Sharma', amount: '₹66,000', status: 'Shipped', date: 'Jun 27, 2026' },
      { id: 'TXN-65109', crop: '🫘 Soybean', quantity: '40 Q', buyer: 'Jalgaon Oil Millers', amount: '₹1,80,000', status: 'Completed', date: 'Jun 25, 2026' },
      { id: 'TXN-43180', crop: '🥔 Potato', quantity: '100 Q', buyer: 'SnackBites Crisps', amount: '₹1,10,000', status: 'Completed', date: 'Jun 22, 2026' },
      { id: 'TXN-32984', crop: '🧅 Onion', quantity: '60 Q', buyer: 'Metro Supermarket', amount: '₹1,08,000', status: 'Pending', date: 'Jun 20, 2026' },
    ],
  },
  vendor: {
    name: 'AgroMart Wholesale',
    role: 'Vendor',
    avatar: 'Store',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&h=300&fit=crop',
    location: 'Pune, Maharashtra',
    memberSince: 'May 2024',
    verified: true,
    completion: 85,
    personal: {
      fullName: 'AgroMart Store (Prop. Vikram Salvi)',
      email: 'contact@agromartstore.com',
      phone: '+91 87654 32109',
      gender: 'Male',
      dob: '1979-09-22',
      address: 'Shop No. 12, APMC Market Yard',
      state: 'Maharashtra',
      city: 'Pune',
      village: 'Gultekdi',
      pincode: '411037',
      language: 'English, Hindi, Marathi',
      occupation: 'Retailer & Distributor',
    },
    roleSpecific: {
      businessName: 'AgroMart Solutions India Pvt Ltd',
      gstNumber: '27AAAAA1111A1Z1',
      shopAddress: 'G-Block, Plot 42, Market Yard, Pune',
      businessType: 'Wholesale Seeds & Fertilisers Distributor',
      productsSold: 'Chemical & Bio-fertilisers, Pesticides, Hybrid Seeds, Sprayers',
      warehouseLocation: 'Hadapsar Warehouse, Pune (Capacity: 500 MT)',
    },
    stats: [
      { label: 'Products Listed', value: '45 Items', icon: '🛒', trend: 'High stock levels' },
      { label: 'Total Purchases', value: '₹8,40,000', icon: '💰', trend: 'Direct from farmers' },
      { label: 'Vendor Rating', value: '4.8 / 5', icon: '⭐', trend: '94 buyer ratings' },
      { label: 'Active Contracts', value: '14 Active', icon: '📄', trend: 'Contract farming active' },
    ],
    achievements: [
      { name: '⭐ Verified Vendor', desc: 'GST and business credentials verified' },
      { name: '🚚 Speed Logistics', desc: 'Average order dispatch in under 24h' },
      { name: '🌱 Bio Guardian', desc: 'Promotes eco-friendly fertilizers' },
    ],
    recentTransactions: [
      { id: 'TXN-84920', crop: '🌾 Wheat Buy', quantity: '50 Q', buyer: 'You', amount: '₹1,17,500', status: 'Completed', date: 'Jun 28, 2026' },
      { id: 'TXN-65109', crop: '🫘 Soybean Buy', quantity: '40 Q', buyer: 'You', amount: '₹1,80,000', status: 'Completed', date: 'Jun 25, 2026' },
      { id: 'TXN-32984', crop: '🧅 Onion Buy', quantity: '60 Q', buyer: 'You', amount: '₹1,08,000', status: 'Pending', date: 'Jun 20, 2026' },
    ],
  },
  customer: {
    name: 'Amit Sharma',
    role: 'Customer',
    avatar: '🤵',
    banner: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&h=300&fit=crop',
    location: 'Mumbai, Maharashtra',
    memberSince: 'January 2025',
    verified: false,
    completion: 78,
    personal: {
      fullName: 'Amit Kumar Sharma',
      email: 'amit.sharma@mumbaimail.co.in',
      phone: '+91 76543 21098',
      gender: 'Male',
      dob: '1992-11-05',
      address: 'A-402, Highrise Residency, Link Road, Andheri West',
      state: 'Maharashtra',
      city: 'Mumbai',
      village: 'Andheri West',
      pincode: '400058',
      language: 'Hindi, English',
      occupation: 'Restaurant Purchasing Head',
    },
    roleSpecific: {
      deliveryAddress: 'Main Kitchen, Spice Route Restaurant, Andheri West, Mumbai',
      preferredCrops: 'Organic Rice, Sweet Corn, Fresh Vegetables, Exotic Chillies',
      savedSellers: 'Raj Patel Farm, Satara Organic Grains, Priya Cotton Farms',
      favouriteProducts: 'NPOP Organic Basmati, Farm fresh field Tomatoes, Seedless Grapes',
    },
    stats: [
      { label: 'Orders Placed', value: '18 Orders', icon: '🛒', trend: 'Regular buyer' },
      { label: 'Total Spent', value: '₹1,24,000', icon: '💰', trend: 'Direct-to-farm savings' },
      { label: 'Customer Trust', value: 'Verified', icon: '🔒', trend: 'Pre-paid active' },
      { label: 'Favorite Farmers', value: '3 Saved', icon: '❤️', trend: 'Regular support' },
    ],
    achievements: [
      { name: '🎯 Early Member', desc: 'Registered in first community release' },
      { name: '🥗 Green Eater', desc: 'Prefers certified organic produce only' },
    ],
    recentTransactions: [
      { id: 'TXN-90210', crop: '🍚 Rice Buy', quantity: '30 Q', buyer: 'You', amount: '₹66,000', status: 'Shipped', date: 'Jun 27, 2026' },
    ],
  },
};

export const SUGGESTIONS = [
  { id: 1, action: 'Upload profile photo', completed: true },
  { id: 2, action: 'Verify phone number via OTP', completed: true },
  { id: 3, action: 'Add detailed farm/business specific metrics', completed: false },
  { id: 4, action: 'Link bank account / UPI ID', completed: false },
];

export const RECENT_ACTIVITIES = [
  { id: 1, action: 'Listed 20 quintals of Grapes in Marketplace', time: 'Today, 11:30 AM', icon: '🍇' },
  { id: 2, action: 'Sold 50 quintals of Wheat to AgroMart', time: 'Yesterday, 05:45 PM', icon: '🌾' },
  { id: 3, action: 'Updated farm coordinates for crop mapping', time: 'Jun 27, 2026', icon: '📍' },
  { id: 4, action: 'Asked AI crop rotation advice for next Rabi season', time: 'Jun 26, 2026', icon: '🤖' },
];
