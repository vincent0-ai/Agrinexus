import { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, MapPin } from 'lucide-react';
import { ImageWithFallback } from './image/ImageWithFallback';

interface BuyerDashboardProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function BuyerDashboard({ onNavigate, onLogout }: BuyerDashboardProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  
  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Cereals'];
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      // // Backend not available - use mock data (this is expected in demo mode)
      // const { mockProducts } = await import('../utils/mockData');
      // setProducts(mockProducts);
      // setFilteredProducts(mockProducts);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleContactFarmer = async (product: any) => {
    const message = prompt(`Send a message to ${product.farmer?.name || 'the farmer'} about ${product.name}:`);
    if (!message) return;

    const token = localStorage.getItem('agrismart_token');
    
    // Check if user is logged in
    if (!token) {
      alert('Please login as a buyer to contact farmers');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          farmerId: product.farmer._id,
          productId: product._id,
          message
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message. Please login first.');
      }
    } catch (error) {
      // Demo mode - backend not available
      alert('server connection problem ' + product.farmer?.name + '. try again or contact admin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3] py-8 px-4">
            <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        <button
  onClick={() => onNavigate('home')}
  className="mt-4 bg-[#2d5016] text-white px-4 py-2 rounded hover:bg-[#244213]"
>
  ← Back to Home
</button>

          <h2>Browse Fresh Products</h2>
          <p>Connect directly with farmers and get the freshest produce</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    selectedCategory === category
                      ? 'bg-[#7fb069] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={product.image || 'https://images.unsplash.com/photo-1665315302321-46989ca7829a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MjE5NjY2OXww&ixlib=rb-4.1.0&q=80&w=1080'}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#7fb069] text-white px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-[#2d5016] mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <div className="text-[#7fb069]">${product.price}/{product.unit}</div>
                      <div className="text-sm text-gray-500">Available: {product.quantity} {product.unit}</div>
                    </div>
                  </div>

                  {/* Farmer Info */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{product.farmer?.name || 'Verified Farmer'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{product.farmer?.location || 'Local Farm'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleContactFarmer(product)}
                    className="w-full bg-[#7fb069] text-white py-3 rounded-xl hover:bg-[#659b5e] transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Contact Farmer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Filter className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-500">No products found matching your criteria</p>
          </div>
        )}
      </div>
      </div>
    
  );
}