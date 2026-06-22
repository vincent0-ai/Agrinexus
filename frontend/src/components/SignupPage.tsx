import { SignUp } from '@clerk/clerk-react';
import { Leaf } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fffbf3] to-[#7fb069]/10">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-[#2d5016] p-3 rounded-full">
                <Leaf className="text-white" size={32} />
              </div>
            </div>
            <h2>Join AgriSmart</h2>
            <p>Create your account and get started</p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white border-2 border-gray-200 hover:border-[#7fb069]",
                  formButtonPrimary: "bg-[#7fb069] hover:bg-[#659b5e]",
                  footerActionLink: "text-[#7fb069] hover:text-[#659b5e]",
                }
              }}
              redirectUrl="/"
              signInUrl="/login"
            />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[#7fb069] hover:text-[#659b5e]"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}