import { Leaf } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (page: string) => void;
  currentUser?: {
    role: 'farmer' | 'buyer' | 'admin' | null;
    name: string;
  };
  onLogout?: () => void;
}

export function Navbar({ onNavigate, currentUser, onLogout }: NavbarProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('agrismart_user');
      localStorage.removeItem('agrismart_token');
      if (onNavigate) {
        onNavigate('home');
      }
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <div className="bg-[#2d5016] p-2 rounded-lg">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-[#2d5016]">AgriSmart</span>
          </div>
          
          <div className="flex items-center gap-6">
            {!currentUser?.role && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="text-[#2d5016] hover:text-[#7fb069] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('signup')}
                  className="bg-[#7fb069] text-white px-6 py-2 rounded-full hover:bg-[#659b5e] transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
            
            {currentUser?.role && (
              <div className="flex items-center gap-4">
                <span className="text-[#2d5016]">Hello, {currentUser.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}