# 🌱 AgriSmart - Farm Produce Marketplace
frontend link=https://agri-smart-a8mz.vercel.app
backend link=https://agri-smart-backend.onrender.com

A modern, eco-friendly farm produce marketplace built with the MERN stack, featuring **Clerk authentication**, role-based access control, and real-time product management.

## ✨ Features

### 🔐 Authentication (Clerk Integration)
- Secure authentication powered by Clerk
- Email/password and social login support
- Role-based access (Farmer, Buyer, Admin)
- Auto-sync to MongoDB
- No admin approval required for Clerk users

### 👨‍🌾 Farmer Features
- Add and manage products
- View and respond to buyer messages
- Track product inventory
- Edit product details
- Delete products

### 🛒 Buyer Features
- Browse fresh farm products
- Filter by category (Vegetables, Fruits, Dairy, Cereals)
- Search products by name/description
- View farmer details
- Contact farmers directly
- See product availability and pricing

### ⚙️ Admin Features
- Manage all users (view, approve, delete)
- Manage all products (view, delete)
- View user statistics
- Monitor platform activity

## 🎨 Design

- **Theme**: Eco-friendly green palette (#7fb069, #2d5016, #fffbf3)
- **UI**: Modern, clean, and responsive
- **Components**: Rounded cards, smooth transitions, intuitive icons
- **Mobile-friendly**: Fully responsive design

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS 4.0
- Clerk React SDK
- Lucide React Icons
- Vite

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for API tokens
- Clerk for authentication
- bcrypt for legacy password hashing
- CORS enabled

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Clerk account ([sign up free](https://clerk.com))

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd agrismart

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up Clerk

1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your Publishable Key and Secret Key from the API Keys page

### 3. Configure Environment Variables

**Frontend** (create `.env` in root):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Backend** (create `backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/agrismart
JWT_SECRET=your_jwt_secret_here_change_in_production
CLERK_SECRET_KEY=sk_test_your_secret_key_here
PORT=5000
```

See `.env.example` files for templates.

### 4. Start MongoDB

**Local MongoDB**:
```bash
mongod
```

**Or use MongoDB Atlas** (cloud):
- Update `MONGODB_URI` in `backend/.env` with your connection string

### 5. Start the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

### 6. Access the App

Open [http://localhost:5173](http://localhost:5173) (or your Vite dev port)

## 📖 Usage Guide

### Sign Up

1. Click **Sign Up** on the homepage
2. Create account using Clerk (email or social login)
3. Complete role selection (Farmer or Buyer)
4. Enter phone number and location
5. Automatic redirect to your dashboard!

### Sign In

1. Click **Login** on the homepage
2. Sign in with your Clerk credentials
3. Automatic redirect based on your role

### As a Farmer

1. **Add Products**: Click "Add New Product" to list your produce
2. **Manage Products**: View, edit, or delete your products
3. **View Messages**: Check buyer inquiries in the Messages tab
4. **Update Profile**: View and manage your profile information

### As a Buyer

1. **Browse Products**: View all available farm products
2. **Filter**: Use category filters or search bar
3. **Contact Farmers**: Click "Contact Farmer" to send a message
4. **View Details**: See product prices, quantities, and farmer info

### As an Admin

To create an admin user, see [CLERK_SETUP_GUIDE.md](./CLERK_SETUP_GUIDE.md)

Admin capabilities:
- View and manage all users
- View and manage all products
- Delete users or products
- Monitor platform statistics

## 📁 Project Structure

```
agrismart/
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx
│   │   ├── BuyerDashboard.tsx
│   │   ├── FarmerDashboard.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── RoleSelection.tsx     # NEW - Role selection after signup
│   │   ├── Navbar.tsx
│   │   └── ui/                    # ShadCN UI components
│   ├── utils/
│   │   └── mockData.ts            # Demo data for offline mode
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx                     # Main app with Clerk provider
├── backend/
│   ├── models/
│   │   ├── User.js                # Updated for Clerk integration
│   │   ├── Product.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js                # Updated with Clerk sync endpoints
│   │   ├── products.js
│   │   ├── messages.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── .env.example
├── backend/.env.example
├── CLERK_SETUP_GUIDE.md           # Detailed Clerk setup instructions
├── API_ENDPOINTS.md               # API documentation
└── README.md
```

## 🔑 Key Features Explained

### Clerk Authentication Flow

1. **Sign Up**: User creates account via Clerk
2. **Role Selection**: User chooses Farmer or Buyer role
3. **Sync to MongoDB**: User data saved to MongoDB with Clerk ID
4. **Auto-Approval**: No admin approval needed (instant access)
5. **Dashboard Redirect**: Automatic redirect based on user role

### No Admin Approval Required

- All Clerk users are **auto-approved** (`approved: true`)
- Immediate access to dashboards after signup
- No waiting for admin to manually approve accounts
- Legacy users (password-based) still support approval flow

### Role-Based Access

- **Farmers**: Product management, message inbox, profile
- **Buyers**: Product browsing, filtering, farmer contact
- **Admins**: Full platform management, user/product oversight

### Backend Integration

- MongoDB stores user data with Clerk IDs
- Clerk handles authentication and session management
- Backend provides data persistence and business logic
- API endpoints for CRUD operations

### Demo Mode

- Works without backend connection
- Uses mock data for all features
- Perfect for testing and demonstrations
- Graceful fallback when backend unavailable

## 🌐 API Endpoints

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete API documentation.

**Key endpoints:**
- `POST /api/auth/clerk-sync` - Sync Clerk user to MongoDB
- `GET /api/auth/clerk-user/:clerkId` - Get user by Clerk ID
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (farmer)
- `POST /api/messages` - Send message (buyer)
- `GET /api/admin/users` - Get all users (admin)

## 🔧 Development

### Run Backend in Dev Mode
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Environment Modes
- **Development**: `NODE_ENV=development`
- **Production**: `NODE_ENV=production`

### Database Seeding (Optional)
```bash
cd backend
npm run seed  # Populate with sample data
```

## 📝 Configuration Files

- **Frontend config**: `vite.config.ts`
- **Tailwind config**: `tailwind.config.js` (v4.0 - uses CSS)
- **TypeScript config**: `tsconfig.json`
- **Backend config**: `backend/.env`

## 🐛 Troubleshooting

### "User not found" after signup
- Ensure backend is running on port 5000
- Check MongoDB connection
- Verify Clerk keys in `.env`

### Role selection not appearing
- Clear browser localStorage
- Sign out and sign back in
- Check console for errors

### Backend connection issues
- Verify MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- Ensure port 5000 is available

See [CLERK_SETUP_GUIDE.md](./CLERK_SETUP_GUIDE.md) for more troubleshooting tips.

## 🔒 Security

- ✅ Passwords handled securely by Clerk
- ✅ JWT tokens for API authentication
- ✅ Environment variables for sensitive data
- ✅ CORS configured for frontend
- ✅ MongoDB connection string secured
- ✅ bcrypt for legacy password hashing

**Production Checklist:**
- [ ] Use HTTPS
- [ ] Set strong JWT_SECRET
- [ ] Configure production CORS
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable Clerk production keys
- [ ] Set secure cookie options
- [ ] Implement rate limiting
- [ ] Add input validation

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:
- Check [CLERK_SETUP_GUIDE.md](./CLERK_SETUP_GUIDE.md)
- Review [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) - Authentication platform
- [MongoDB](https://mongodb.com) - Database
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons
- [React](https://react.dev) - Frontend framework

---

**Built with ❤️ for farmers and buyers**
author: phillip kioko kimonyi, student plp july 2025 cohort
Happy farming! 🌾
