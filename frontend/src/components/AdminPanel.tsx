import { useState, useEffect } from 'react';
import { Users, Package, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function AdminPanel({ onNavigate, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      // Backend not available - use mock data (expected in demo mode)
      // const { mockUsers } = await import('../utils/mockData');
      // setUsers(mockUsers);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/products`, {
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
      // setProducts(mockProducts);
    }
  };

  const handleApproveUser = async (userId: string) => {
    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('User approved successfully');
        fetchUsers();
      }
    } catch (error) {
      // Demo mode - backend not available
      // alert('Demo Mode: User would be approved. Connect your backend to enable real approval.');
      // setUsers(users.map(u => u._id === userId ? {...u, approved: true} : u));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      // // Demo mode - backend not available
      // alert('Demo Mode: User would be deleted. Connect your backend to enable real deletion.');
      // setUsers(users.filter(u => u._id !== userId));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('agrismart_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
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
      // alert('Demo Mode: Product would be deleted. Connect your backend to enable real deletion.');
      // setProducts(products.filter(p => p._id !== productId));
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
          <h2>Admin Panel</h2>
          <p>Manage users and products</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'users'
                ? 'bg-[#7fb069] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'products'
                ? 'bg-[#7fb069] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package size={20} />
            Products ({products.length})
          </button>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2d5016] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Joined</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-[#2d5016]">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm bg-[#7fb069]/20 text-[#2d5016] capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.location}</td>
                      <td className="px-6 py-4">
                        {user.approved ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle size={16} />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-yellow-600 text-sm">
                            <XCircle size={16} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {!user.approved && (
                            <button
                              onClick={() => handleApproveUser(user._id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-16">
                  <Users className="mx-auto mb-4 text-gray-400" size={64} />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Table */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2d5016] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Quantity</th>
                    <th className="px-6 py-4 text-left">Farmer</th>
                    <th className="px-6 py-4 text-left">Added</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-[#2d5016]">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm bg-[#7fb069]/20 text-[#2d5016]">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#7fb069]">
                        ${product.price}/{product.unit}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.quantity} {product.unit}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.farmer?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <Package className="mx-auto mb-4 text-gray-400" size={64} />
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}