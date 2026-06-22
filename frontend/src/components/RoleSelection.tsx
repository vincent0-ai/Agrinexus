import { useState } from 'react';
import { UserCircle, Tractor, ShoppingBag, MapPin, Phone, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';


interface RoleSelectionProps {
  onComplete: () => void;
}

export function RoleSelection({ onComplete }: RoleSelectionProps) {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | ''>('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sync user data to MongoDB
      const response = await fetch(`${API_URL}/api/auth/clerk-sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName || user?.firstName || 'User',
          role: selectedRole,
          phone,
          location,
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('agrismart_user', JSON.stringify(data.user));
        
        // Store JWT token for API authentication
        if (data.token) {
          localStorage.setItem('agrismart_token', data.token);
        }
        
        // Update Clerk user metadata
        await user?.update({
          unsafeMetadata: {
            role: selectedRole,
            phone,
            location,
          }
        });

        onComplete();
      } else {
        setError(data.message || 'Failed to complete setup');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fffbf3] to-[#7fb069]/10">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-[#2d5016] p-4 rounded-full">
                <UserCircle className="text-white" size={40} />
              </div>
            </div>
            <h2>Complete Your Profile</h2>
            <p>Tell us a bit about yourself to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-3 text-[#2d5016]">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Farmer Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('farmer')}
                  className={`p-6 border-2 rounded-2xl transition-all ${
                    selectedRole === 'farmer'
                      ? 'border-[#7fb069] bg-[#7fb069]/10 shadow-lg'
                      : 'border-gray-200 hover:border-[#7fb069]/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      selectedRole === 'farmer' ? 'bg-[#7fb069]' : 'bg-gray-100'
                    }`}>
                      <Tractor className={`${
                        selectedRole === 'farmer' ? 'text-white' : 'text-gray-600'
                      }`} size={28} />
                    </div>
                    <div>
                      <div className="text-[#2d5016] mb-1">Farmer</div>
                      <div className="text-xs text-gray-600">
                        Sell your farm products
                      </div>
                    </div>
                  </div>
                </button>

                {/* Buyer Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-6 border-2 rounded-2xl transition-all ${
                    selectedRole === 'buyer'
                      ? 'border-[#7fb069] bg-[#7fb069]/10 shadow-lg'
                      : 'border-gray-200 hover:border-[#7fb069]/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      selectedRole === 'buyer' ? 'bg-[#7fb069]' : 'bg-gray-100'
                    }`}>
                      <ShoppingBag className={`${
                        selectedRole === 'buyer' ? 'text-white' : 'text-gray-600'
                      }`} size={28} />
                    </div>
                    <div>
                      <div className="text-[#2d5016] mb-1">Buyer</div>
                      <div className="text-xs text-gray-600">
                        Browse fresh products
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm mb-2 text-[#2d5016]">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069] focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm mb-2 text-[#2d5016]">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fb069] focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedRole}
              className="w-full bg-[#7fb069] text-white py-3 rounded-xl hover:bg-[#659b5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Setting up your account...
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}