import { useState, useEffect } from 'react';
import { Leaf, Package, PlusCircle, MessageCircle, User, LogOut, Edit2, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './image/ImageWithFallback';

interface FarmerDashboardProps {
  onNavigate: (page: string) => void;
  user: any;
  onLogout?: () => void;
}

export function FarmerDashboard({ onNavigate, user, onLogout }: FarmerDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchMessages();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/products/my-products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      }
    } catch (error) {
      // Backend not available - use mock data (expected in demo mode)
      // const { mockProducts } = await import('../utils/mockData');
      // setProducts(mockProducts.slice(0, 3)); // Show first 3 as farmer's products
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/messages/farmer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (error) {
      // Backend not available - use mock data (expected in demo mode)
      // const { mockMessages } = await import('../utils/mockData');
      // setMessages(mockMessages);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('agrismart_token');

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        alert('Product added successfully!');
        setShowAddForm(false);
        setNewProduct({
          name: '',
          category: 'Vegetables',
          price: '',
          quantity: '',
          unit: 'kg',
          description: '',
          image: ''
        });
        fetchProducts();
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      // Demo mode - backend not available
      alert('Demo Mode: Product would be added. Connect your backend to enable real product creation.');
      // Simulate success
      const newProductWithId = {
        ...newProduct,
        _id: Date.now().toString(),
        farmer: user,
        approved: true,
        createdAt: new Date()
      };
      setProducts([newProductWithId, ...products]);
      setShowAddForm(false);
      setNewProduct({
        name: '',
        category: 'Vegetables',
        price: '',
        quantity: '',
        unit: 'kg',
        description: '',
        image: ''
      });
    }

    setLoading(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      // Demo mode - backend not available
      alert('Demo Mode: Product would be deleted. Connect your backend to enable real deletion.');
      setProducts(products.filter(p => p._id !== productId));
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf3] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2d5016] text-white p-6 space-y-6">
        <div className="flex items-center gap-2 pb-6 border-b border-white/20">
          <Leaf size={32} />
          <span>Farmer Portal</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-[#7fb069]' : 'hover:bg-white/10'
            }`}
          >
            <Package size={20} />
            <span>My Products</span>
          </button>

          <button
            onClick={() => { setActiveTab('add'); setShowAddForm(true); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'add' ? 'bg-[#7fb069]' : 'hover:bg-white/10'
            }`}
          >
            <PlusCircle size={20} />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'messages' ? 'bg-[#7fb069]' : 'hover:bg-white/10'
            }`}
          >
            <MessageCircle size={20} />
            <span>Messages</span>
            {messages.length > 0 && (
              <span className="ml-auto bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-[#7fb069]' : 'hover:bg-white/10'
            }`}
          >
            <User size={20} />
            <span>Profile</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('agrismart_user');
              localStorage.removeItem('agrismart_token');
              onNavigate('home');
              if (onLogout) onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2>Welcome back, {user?.name || 'Farmer'}!</h2>
            <p>Manage your products and connect with buyers</p>
          </div>

          {/* My Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3>My Products</h3>
                <button
                  onClick={() => { setActiveTab('add'); setShowAddForm(true); }}
                  className="bg-[#7fb069] text-white px-6 py-2 rounded-full hover:bg-[#659b5e] transition-colors flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Add New Product
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <ImageWithFallback
                      src={product.image || 'https://images.unsplash.com/photo-1665315302321-46989ca7829a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MjE5NjY2OXww&ixlib=rb-4.1.0&q=80&w=1080'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[#2d5016]">{product.name}</h3>
                        <span className="bg-[#7fb069]/20 text-[#2d5016] px-3 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <div className="text-[#7fb069]">${product.price}/{product.unit}</div>
                          <div className="text-sm text-gray-500">Stock: {product.quantity} {product.unit}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Package className="mx-auto mb-4 text-gray-400" size={64} />
                  <p className="text-gray-500">No products yet. Add your first product!</p>
                </div>
              )}
            </div>
          )}

          {/* Add Product Tab */}
          {activeTab === 'add' && showAddForm && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="mb-6">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-2 text-[#2d5016]">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                      placeholder="Fresh Tomatoes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#2d5016]">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                    >
                      <option>Vegetables</option>
                      <option>Fruits</option>
                      <option>Dairy</option>
                      <option>Cereals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#2d5016]">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                      placeholder="10.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#2d5016]">Quantity Available</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                        placeholder="100"
                      />
                      <select
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                      >
                        <option>kg</option>
                        <option>lbs</option>
                        <option>units</option>
                        <option>liters</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#2d5016]">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                    placeholder="Describe your product..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#2d5016]">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#7fb069] text-white py-3 rounded-xl hover:bg-[#659b5e] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-8 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="mb-6">Messages from Buyers</h3>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message._id} className="border border-gray-200 rounded-xl p-5 hover:border-[#7fb069] transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[#2d5016]">{message.buyerName}</div>
                        <div className="text-sm text-gray-500">{message.buyerEmail}</div>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-gray-700 mb-2">
                      <span className="text-sm text-gray-500">Product: </span>
                      {message.productName}
                    </div>
                    <p className="text-gray-600">{message.message}</p>
                    <button className="mt-3 text-[#7fb069] hover:text-[#659b5e] text-sm">
                      Reply →
                    </button>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <MessageCircle className="mx-auto mb-4 text-gray-400" size={64} />
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="mb-6">My Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="w-20 h-20 bg-[#7fb069] rounded-full flex items-center justify-center text-white text-2xl">
                    {user?.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <div className="text-[#2d5016]">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    <div className="text-[#2d5016]">{user?.phone}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Location</label>
                    <div className="text-[#2d5016]">{user?.location}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Role</label>
                    <div className="text-[#2d5016] capitalize">{user?.role}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Member Since</label>
                    <div className="text-[#2d5016]">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}