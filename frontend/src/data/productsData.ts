export const allProducts = [
  { id: 1, name: "Organic Tomatoes",  category: "Vegetables", farmer: "Wanjiku Farm",   county: "Kiambu",   price: 65,  unit: "kg",    qty: 500,  rating: 4.8, img: "1546094096-0df4bcaaa337" },
  { id: 2, name: "Fresh Avocados",    category: "Fruits",     farmer: "Kamau Organics", county: "Nakuru",   price: 120, unit: "kg",    qty: 300,  rating: 4.9, img: "1523049673857-eb18f1dcc2aa" },
  { id: 3, name: "Maize (Dry)",       category: "Grains",     farmer: "Njoroge Agri",   county: "Meru",     price: 55,  unit: "kg",    qty: 2000, rating: 4.6, img: "1551754655-a9b74a59ad7c" },
  { id: 4, name: "Sukuma Wiki",       category: "Vegetables", farmer: "Achieng Fields", county: "Kisumu",   price: 30,  unit: "bunch", qty: 800,  rating: 4.7, img: "1510130387799-9f7ae0034e3e" },
  { id: 5, name: "French Beans",      category: "Vegetables", farmer: "Wanjiku Farm",   county: "Kiambu",   price: 85,  unit: "kg",    qty: 400,  rating: 4.5, img: "1592924357228-91a4daadcfea" },
  { id: 6, name: "Passion Fruits",    category: "Fruits",     farmer: "Mutua Fresh",    county: "Machakos", price: 95,  unit: "kg",    qty: 250,  rating: 4.8, img: "1491553895911-0055eca6402d" },
  { id: 7, name: "Fresh Milk",        category: "Dairy",      farmer: "Kamau Organics", county: "Nakuru",   price: 45,  unit: "litre", qty: 1500, rating: 4.9, img: "1550583724-b2692b85b150" },
  { id: 8, name: "Potatoes (Shangi)", category: "Vegetables", farmer: "Njoroge Agri",   county: "Kiambu",   price: 35,  unit: "kg",    qty: 3000, rating: 4.4, img: "1518977956812-cd3dbadaaf31" },
];

export const farmerProducts = [
  { id: 1, name: "Organic Tomatoes", category: "Vegetables", price: 65, unit: "kg",    qty: 500, status: "Active",       img: "1546094096-0df4bcaaa337" },
  { id: 2, name: "French Beans",     category: "Vegetables", price: 85, unit: "kg",    qty: 400, status: "Active",       img: "1592924357228-91a4daadcfea" },
  { id: 3, name: "Spinach",          category: "Vegetables", price: 40, unit: "bunch", qty: 0,   status: "Out of Stock", img: "1510130387799-9f7ae0034e3e" },
  { id: 4, name: "Onions",           category: "Vegetables", price: 55, unit: "kg",    qty: 200, status: "Pending",      img: "1518977956812-cd3dbadaaf31" },
];

export const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Dairy"];
export const COUNTIES   = ["Kiambu", "Nakuru", "Meru", "Kisumu", "Machakos"];
