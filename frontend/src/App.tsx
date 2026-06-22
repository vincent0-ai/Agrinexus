import { useState, useEffect } from 'react';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AdminPanel } from './components/AdminPanel';
// import { DemoModeBanner } from './components/DemoModeBanner';
import { RoleSelection } from './components/RoleSelection';

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY) || '';

// Check if Clerk key is valid (starts with pk_test_ or pk_live_ and has more than just the prefix)
const isValidClerkKey = (key: string) => {
  return key && (key.startsWith('pk_test_') || key.startsWith('pk_live_')) && key.length > 20;
};

const CLERK_ENABLED = isValidClerkKey(CLERK_PUBLISHABLE_KEY);

// Component that uses Clerk hooks (only used when Clerk is enabled)
function ClerkAppContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check if user needs role selection
  useEffect(() => {
    if (!isLoaded) return;

    const checkUserSetup = async () => {
      if (user) {
        // Check if user has role in metadata
        const role = user.unsafeMetadata?.role;
        
        if (!role) {
          // User needs to select a role
          setNeedsRoleSelection(true);
          setIsLoading(false);
          return;
        }

        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('agrismart_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          
          // Navigate to appropriate dashboard
          if (userData.role === 'farmer') {
            setCurrentPage('farmer-dashboard');
          } else if (userData.role === 'buyer') {
            setCurrentPage('buyer-dashboard');
          } else if (userData.role === 'admin') {
            setCurrentPage('admin-panel');
          }
        } else {
          // Fetch user data from backend
          try {
            const response = await fetch(`${API_URL}/api/auth/clerk-user/${user.id}`);
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('agrismart_user', JSON.stringify(data.user));
              setCurrentUser(data.user);
              
              // Generate token for existing user if not present
              if (!localStorage.getItem('agrismart_token')) {
                // Re-sync to get token
                const syncResponse = await fetch(`${API_URL}/api/auth/clerk-sync`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName || user.firstName || 'User',
                    role: data.user.role,
                    phone: data.user.phone,
                    location: data.user.location,
                  })
                });
                if (syncResponse.ok) {
                  const syncData = await syncResponse.json();
                  if (syncData.token) {
                    localStorage.setItem('agrismart_token', syncData.token);
                  }
                }
              }
              
              // Navigate to appropriate dashboard
              if (data.user.role === 'farmer') {
                setCurrentPage('farmer-dashboard');
              } else if (data.user.role === 'buyer') {
                setCurrentPage('buyer-dashboard');
              } else if (data.user.role === 'admin') {
                setCurrentPage('admin-panel');
              }
            } else {
              // User not in database, needs role selection
              setNeedsRoleSelection(true);
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            // If backend is down, check metadata
            if (role) {
              const userData = {
                _id: user.id,
                clerkId: user.id,
                name: user.fullName || user.firstName || 'User',
                email: user.primaryEmailAddress?.emailAddress,
                role: role as string,
                phone: user.unsafeMetadata?.phone || '',
                location: user.unsafeMetadata?.location || '',
                approved: true,
              };
              localStorage.setItem('agrismart_user', JSON.stringify(userData));
              setCurrentUser(userData);
              
              // Navigate to appropriate dashboard
              if (role === 'farmer') {
                setCurrentPage('farmer-dashboard');
              } else if (role === 'buyer') {
                setCurrentPage('buyer-dashboard');
              } else if (role === 'admin') {
                setCurrentPage('admin-panel');
              }
            }
          }
        }
      } else {
        // Not signed in
        setCurrentPage('home');
      }
      
      setIsLoading(false);
    };

    checkUserSetup();
  }, [user, isLoaded]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('agrismart_user');
    localStorage.removeItem('agrismart_token');
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleRoleSelectionComplete = () => {
    setNeedsRoleSelection(false);
    // Reload to fetch user data
    window.location.reload();
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#fffbf3] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#2d5016] text-2xl mb-4">🌱 AgriSmart</div>
          <div className="text-[#7fb069]">Loading...</div>
        </div>
      </div>
    );
  }

  // Show role selection if needed
  if (user && needsRoleSelection) {
    return <RoleSelection onComplete={handleRoleSelectionComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Demo Mode Banner */}
      {/* {showDemoBanner && <DemoModeBanner />} */}
      
      {/* Show navbar on all pages except dashboards */}
      {!currentPage.includes('dashboard') && currentPage !== 'admin-panel' && (
        <Navbar 
          onNavigate={handleNavigate} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Render current page */}
      <div className="w-full">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />}
        {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
        {currentPage === 'farmer-dashboard' && <FarmerDashboard onNavigate={handleNavigate} user={currentUser} onLogout={handleLogout} />}
        {currentPage === 'buyer-dashboard' && <BuyerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentPage === 'admin-panel' && <AdminPanel onNavigate={handleNavigate} onLogout={handleLogout} />}
      </div>
    </div>
  );
}

// Legacy app content (without Clerk - uses traditional auth)
function LegacyAppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('agrismart_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser(userData);
      
      // Navigate to appropriate dashboard
      if (userData.role === 'farmer') {
        setCurrentPage('farmer-dashboard');
      } else if (userData.role === 'buyer') {
        setCurrentPage('buyer-dashboard');
      } else if (userData.role === 'admin') {
        setCurrentPage('admin-panel');
      }
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('agrismart_user');
    localStorage.removeItem('agrismart_token');
    setCurrentUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Demo Mode Banner */}
      {/* {showDemoBanner && <DemoModeBanner />} */}
      
      {/* Show navbar on all pages except dashboards */}
      {!currentPage.includes('dashboard') && currentPage !== 'admin-panel' && (
        <Navbar 
          onNavigate={handleNavigate} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Render current page */}
      <div className="w-full">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />}
        {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
        {currentPage === 'farmer-dashboard' && <FarmerDashboard onNavigate={handleNavigate} user={currentUser} onLogout={handleLogout} />}
        {currentPage === 'buyer-dashboard' && <BuyerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentPage === 'admin-panel' && <AdminPanel onNavigate={handleNavigate} onLogout={handleLogout} />}
      </div>
    </div>
  );
}

export default function App() {
  // If Clerk is not enabled, use legacy auth
  if (!CLERK_ENABLED) {
    console.log('ℹ️ AgriSmart running in Legacy Auth mode. To enable Clerk authentication, add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
    return <LegacyAppContent />;
  }

  // Use Clerk authentication
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkAppContent />
    </ClerkProvider>
  );
}