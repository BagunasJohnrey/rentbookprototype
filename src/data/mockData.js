export const CATALOG_ITEMS = [
  {
    id: "ITEM-1001",
    name: "Ivory Wedding Gown",
    category: "gowns",
    baseRate: 5500,
    deposit: 2000,
    status: "Rented",
    tags: ["#Wedding", "#Formal", "#Ivory"],
    imageUrl: "https://images.unsplash.com/photo-1519657337289-077653f724ed?w=500&q=80",
  },
  {
    id: "ITEM-1002",
    name: "Emerald Green Evening Gown",
    category: "gowns",
    baseRate: 3500,
    deposit: 1500,
    status: "Available",
    tags: ["#Evening", "#Prom", "#Green"],
    imageUrl: "https://images.unsplash.com/photo-1566165565349-f55e094132dd?w=500&q=80",
  },
  {
    id: "ITEM-1003",
    name: "Classic Black Tuxedo",
    category: "suits",
    baseRate: 3200,
    deposit: 1500,
    status: "Overdue",
    tags: ["#Black", "#Tuxedo", "#Formal"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
  },
  {
    id: "ITEM-1004",
    name: "Navy Blue Slim Fit Suit",
    category: "suits",
    baseRate: 2800,
    deposit: 1000,
    status: "Available",
    tags: ["#Navy", "#Modern", "#Business"],
    imageUrl: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500&q=80",
  },
  {
    id: "ITEM-1005",
    name: "White Barong Tagalog",
    category: "barong",
    baseRate: 2500,
    deposit: 1000,
    status: "Rented",
    tags: ["#Barong", "#Filipiniana", "#White"],
    imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80",
  },
  {
    id: "ITEM-1006",
    name: "Crimson Red Debutante Ball Gown",
    category: "gowns",
    baseRate: 6000,
    deposit: 2500,
    status: "Available",
    tags: ["#Debut", "#Ballgown", "#Red"],
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
  },
  {
    id: "ITEM-1007",
    name: "Charcoal Grey 3-Piece Suit",
    category: "suits",
    baseRate: 3500,
    deposit: 1500,
    status: "Maintenance",
    tags: ["#Grey", "#Wedding", "#Vintage"],
    imageUrl: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=500&q=80",
  },
  {
    id: "ITEM-1008",
    name: "Jusi Piña Barong",
    category: "barong",
    baseRate: 3000,
    deposit: 1500,
    status: "Available",
    tags: ["#Premium", "#Wedding", "#Beige"],
    imageUrl: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=500&q=80",
  },
  {
    id: "ITEM-1009",
    name: "Champagne Bridesmaid Dress",
    category: "gowns",
    baseRate: 2000,
    deposit: 1000,
    status: "Available",
    tags: ["#Bridesmaid", "#Champagne", "#Elegant"],
    imageUrl: "https://images.unsplash.com/photo-1583391733958-d25e07fac04f?w=500&q=80",
  }
];

// NEW: Add the transactions data
export const TRANSACTIONS = [
  {
    txId: "TXN-2001",
    customerName: "Kathryn Bernardo",
    itemId: "ITEM-1006",
    dueDate: "2026-02-15",
    status: "completed",
  },
  {
    txId: "TXN-2002",
    customerName: "Joshua Garcia",
    itemId: "ITEM-1004",
    dueDate: "2026-02-20",
    status: "completed",
  },
  {
    txId: "TXN-2004",
    customerName: "Nadine Lustre",
    itemId: "ITEM-1003",
    dueDate: "2026-02-28",
    status: "overdue",
  },
  {
    txId: "TXN-2006",
    customerName: "Sofia Andres",
    itemId: "ITEM-1001",
    dueDate: "2026-03-06",
    status: "active",
  },
  {
    txId: "TXN-2008",
    customerName: "Dahyun Santos",
    itemId: "ITEM-1005",
    dueDate: "2026-03-02",
    status: "active",
  },
  {
    txId: "TXN-2009",
    customerName: "Alden Richards",
    itemId: "ITEM-1008",
    dueDate: "2026-03-08",
    status: "active",
  },
  {
    txId: "TXN-2010",
    customerName: "Liza Soberano",
    itemId: "ITEM-1009",
    dueDate: "2026-03-10",
    status: "active",
  }
];

export const REVENUE_STATS = {
  totalRevenue: 345400,
  monthlyGrowth: 14.2,
  pendingDeposits: 12500,
  completedRentals: 84
};

export const MONTHLY_DATA = [
  { month: 'Oct', revenue: 32000 },
  { month: 'Nov', revenue: 48000 },
  { month: 'Dec', revenue: 76000 }, // Peak holiday/wedding season
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 28400 }, // Current month
];

export const POPULAR_CATEGORIES = [
  { name: 'Gowns', count: 42, color: '#bf4a53' },
  { name: 'Suits', count: 28, color: '#111010' },
  { name: 'Barong', count: 14, color: '#8e8e93' },
];

export const GOWN_RENTAL_DATA = [
  { type: 'Wedding', count: 45, trend: '+12%' },
  { type: 'Debut', count: 32, trend: '+5%' },
  { type: 'Evening', count: 28, trend: '-2%' },
  { type: 'Filipiñana', count: 15, trend: '+8%' },
];