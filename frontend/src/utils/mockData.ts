// // Mock data for demo purposes when backend is not available

// export const mockProducts = [
//   {
//     _id: '1',
//     name: 'Organic Tomatoes',
//     category: 'Vegetables',
//     price: 3.99,
//     quantity: 150,
//     unit: 'kg',
//     description: 'Fresh organic tomatoes grown without pesticides. Perfect for salads and cooking.',
//     image: 'https://images.unsplash.com/photo-1665315302321-46989ca7829a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MjE5NjY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
//     farmer: {
//       _id: 'farmer1',
//       name: 'John Smith',
//       email: 'john@farm.com',
//       phone: '+1-555-0123',
//       location: 'Green Valley Farm, CA'
//     },
//     approved: true,
//     createdAt: new Date('2024-10-15')
//   },
//   {
//     _id: '2',
//     name: 'Fresh Strawberries',
//     category: 'Fruits',
//     price: 5.99,
//     quantity: 80,
//     unit: 'kg',
//     description: 'Sweet and juicy strawberries picked fresh daily. Great for desserts and smoothies.',
//     image: 'https://images.unsplash.com/photo-1667885098658-7e34d751fded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwbWFya2V0fGVufDF8fHx8MTc2MjA5NzgzOHww&ixlib=rb-4.1.0&q=80&w=1080',
//     farmer: {
//       _id: 'farmer2',
//       name: 'Maria Garcia',
//       email: 'maria@freshfarms.com',
//       phone: '+1-555-0456',
//       location: 'Sunny Acres, FL'
//     },
//     approved: true,
//     createdAt: new Date('2024-10-20')
//   },
//   {
//     _id: '3',
//     name: 'Farm Fresh Milk',
//     category: 'Dairy',
//     price: 4.50,
//     quantity: 200,
//     unit: 'liters',
//     description: 'Pure, pasteurized milk from grass-fed cows. Rich in calcium and vitamins.',
//     image: 'https://images.unsplash.com/photo-1635714293982-65445548ac42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjIxMzQxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
//     farmer: {
//       _id: 'farmer3',
//       name: 'Robert Johnson',
//       email: 'robert@dairy.com',
//       phone: '+1-555-0789',
//       location: 'Highland Dairy, WI'
//     },
//     approved: true,
//     createdAt: new Date('2024-10-18')
//   },
//   {
//     _id: '4',
//     name: 'Organic Wheat',
//     category: 'Cereals',
//     price: 2.99,
//     quantity: 500,
//     unit: 'kg',
//     description: 'Premium organic wheat, perfect for baking and milling into flour.',
//     image: 'https://images.unsplash.com/photo-1606495002933-354ea2413e94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGNlcmVhbHMlMjBncmFpbnN8ZW58MXx8fHwxNzYyMTk2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
//     farmer: {
//       _id: 'farmer4',
//       name: 'Sarah Williams',
//       email: 'sarah@grains.com',
//       phone: '+1-555-0321',
//       location: 'Golden Fields, KS'
//     },
//     approved: true,
//     createdAt: new Date('2024-10-22')
//   },
//   {
//     _id: '5',
//     name: 'Bell Peppers',
//     category: 'Vegetables',
//     price: 4.25,
//     quantity: 100,
//     unit: 'kg',
//     description: 'Colorful bell peppers - red, yellow, and green. Perfect for stir-fries and salads.',
//     image: 'https://images.unsplash.com/photo-1665315302321-46989ca7829a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MjE5NjY2OXww&ixlib=rb-4.1.0&q=80&w=1080',
//     farmer: {
//       _id: 'farmer1',
//       name: 'John Smith',
//       email: 'john@farm.com',
//       phone: '+1-555-0123',
//       location: 'Green Valley Farm, CA'
//     },
//     approved: true,
//     createdAt: new Date('2024-10-25')
//   },
//   {
//     _id: '6',
//     name: 'Fresh Oranges',
//     category: 'Fruits',
//     price: 3.50,
//     quantity: 120,
//     unit: 'kg',
//     description: 'Juicy Valencia oranges packed with Vitamin C. Great for fresh juice!',
//     image: 'https://images.unsplash.com/photo-1667885098658-7e34d751fded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwbWFya2V0fGVufDF8fHx8MTc2MjA5NzgzOHww&ixlib=rb-4.1.0&q=80&w=1080',
//     farmer: {
//       _id: 'farmer2',
//       name: 'Maria Garcia',
//       email: 'maria@freshfarms.com',
//       phone: '+1-555-0456',
//       location: 'Sunny Acres, FL'
//     },
//     approved: true,
//     createdAt: new Date('2024-10-28')
//   }
// ];

// export const mockMessages = [
//   {
//     _id: 'msg1',
//     buyerName: 'Emily Chen',
//     buyerEmail: 'emily@example.com',
//     buyerPhone: '+1-555-1111',
//     productName: 'Organic Tomatoes',
//     message: 'Hi! I\'m interested in ordering 50kg of organic tomatoes. Are they available for delivery this week?',
//     read: false,
//     createdAt: new Date('2024-11-01')
//   },
//   {
//     _id: 'msg2',
//     buyerName: 'David Lee',
//     buyerEmail: 'david@example.com',
//     buyerPhone: '+1-555-2222',
//     productName: 'Bell Peppers',
//     message: 'Can you provide these in bulk? I need about 200kg for my restaurant. What\'s your best price?',
//     read: false,
//     createdAt: new Date('2024-11-02')
//   },
//   {
//     _id: 'msg3',
//     buyerName: 'Lisa Martinez',
//     buyerEmail: 'lisa@example.com',
//     buyerPhone: '+1-555-3333',
//     productName: 'Organic Tomatoes',
//     message: 'Are these GMO-free? I\'m looking for organic produce for my health food store.',
//     read: true,
//     createdAt: new Date('2024-10-30')
//   }
// ];

// export const mockUsers = [
//   {
//     _id: 'user1',
//     name: 'John Smith',
//     email: 'john@farm.com',
//     role: 'farmer',
//     phone: '+1-555-0123',
//     location: 'Green Valley Farm, CA',
//     approved: true,
//     createdAt: new Date('2024-09-15')
//   },
//   {
//     _id: 'user2',
//     name: 'Maria Garcia',
//     email: 'maria@freshfarms.com',
//     role: 'farmer',
//     phone: '+1-555-0456',
//     location: 'Sunny Acres, FL',
//     approved: true,
//     createdAt: new Date('2024-09-20')
//   },
//   {
//     _id: 'user3',
//     name: 'Robert Johnson',
//     email: 'robert@dairy.com',
//     role: 'farmer',
//     phone: '+1-555-0789',
//     location: 'Highland Dairy, WI',
//     approved: true,
//     createdAt: new Date('2024-09-25')
//   },
//   {
//     _id: 'user4',
//     name: 'Emily Chen',
//     email: 'emily@example.com',
//     role: 'buyer',
//     phone: '+1-555-1111',
//     location: 'San Francisco, CA',
//     approved: true,
//     createdAt: new Date('2024-10-01')
//   },
//   {
//     _id: 'user5',
//     name: 'David Lee',
//     email: 'david@example.com',
//     role: 'buyer',
//     phone: '+1-555-2222',
//     location: 'Miami, FL',
//     approved: true,
//     createdAt: new Date('2024-10-05')
//   },
//   {
//     _id: 'user6',
//     name: 'Sarah Williams',
//     email: 'sarah@grains.com',
//     role: 'farmer',
//     phone: '+1-555-0321',
//     location: 'Golden Fields, KS',
//     approved: false,
//     createdAt: new Date('2024-10-28')
//   }
// ];

// // Demo credentials
// export const demoCredentials = {
//   farmer: {
//     email: 'farmer@demo.com',
//     password: 'demo123',
//     user: {
//       _id: 'demo-farmer',
//       name: 'Demo Farmer',
//       email: 'farmer@demo.com',
//       role: 'farmer',
//       phone: '+1-555-DEMO',
//       location: 'Demo Farm, USA',
//       approved: true,
//       createdAt: new Date()
//     }
//   },
//   buyer: {
//     email: 'buyer@demo.com',
//     password: 'demo123',
//     user: {
//       _id: 'demo-buyer',
//       name: 'Demo Buyer',
//       email: 'buyer@demo.com',
//       role: 'buyer',
//       phone: '+1-555-DEMO',
//       location: 'Demo City, USA',
//       approved: true,
//       createdAt: new Date()
//     }
//   },
//   admin: {
//     email: 'admin@demo.com',
//     password: 'demo123',
//     user: {
//       _id: 'demo-admin',
//       name: 'Demo Admin',
//       email: 'admin@demo.com',
//       role: 'admin',
//       phone: '+1-555-DEMO',
//       location: 'HQ, USA',
//       approved: true,
//       createdAt: new Date()
//     }
//   }
// };
