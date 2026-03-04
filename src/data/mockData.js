export const CATALOG_ITEMS = [
  {
    id: "ITEM-1001",
    name: "Ivory Wedding Gown",
    category: "gowns",
    baseRate: 5500,
    deposit: 2000,
    status: "Available",
    tags: ["#Wedding", "#Formal", "#Ivory"],
    imageUrl: "https://images.unsplash.com/photo-1519657337289-077653f724ed?w=200&q=80",
  },
  {
    id: "ITEM-1003",
    name: "Classic Black Tuxedo",
    category: "suits",
    baseRate: 3200,
    deposit: 1500,
    status: "Available",
    tags: ["#Black", "#Tuxedo", "#Formal"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: "ITEM-1005",
    name: "White Barong Tagalog",
    category: "barong",
    baseRate: 2500,
    deposit: 1000,
    status: "Available",
    tags: ["#Barong", "#Filipiniana", "#White"],
    imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80",
  }
];

// NEW: Add the transactions data
export const TRANSACTIONS = [
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
  }
];