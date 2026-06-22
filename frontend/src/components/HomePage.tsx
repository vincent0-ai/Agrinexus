import { ImageWithFallback } from './image/ImageWithFallback';
import { Leaf, TrendingUp, Users, Shield } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2d5016] to-[#659b5e] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={50} />
              <span className="text-[#d4a574] ">AgriSmart Marketplace</span>
            </div>
            <h1 className="text-white">
              Empowering Farmers, Connecting Markets
            </h1>
            <p className="text-blue/90">
              Join the digital revolution in agriculture. Connect directly with farmers,
              get fresh produce, and support sustainable farming practices.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="bg-white text-[#2d5016] px-8 py-3 rounded-full hover:bg-[#fffbf3] transition-all shadow-lg"
              >
                Join as Farmer
              </button>
              <button
                onClick={() => onNavigate('buyer-dashboard')}
                className="bg-[#d4a574] text-white px-8 py-3 rounded-full hover:bg-[#8b6f47] transition-all shadow-lg"
              >
                Browse Products
              </button>
            </div>
          </div>
          
          <div className="relative">
            <ImageWithFallback
              src="https://plus.unsplash.com/premium_photo-1661420226112-311050ce30da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybWVyfGVufDB8fDB8fHww"
              alt="Farmer in field"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2>Why Choose AgriSmart?</h2>
            <p>Bringing the farm to your doorstep with technology</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#7fb069] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3>Direct Connection</h3>
              <p>
                Connect directly with farmers and eliminate middlemen. 
                Get the freshest produce at fair prices.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#659b5e] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3>Better Prices</h3>
              <p>
                Farmers get better margins, buyers get competitive prices. 
                Everyone wins in our marketplace.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#d4a574] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3>Quality Assured</h3>
              <p>
                All farmers are verified. Every product meets our 
                quality standards for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2>Fresh From The Farm</h2>
            <p>Explore our wide range of farm-fresh products</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Vegetables', img: 'https://images.unsplash.com/photo-1665315302321-46989ca7829a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MjE5NjY2OXww&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Fruits', img: 'https://images.unsplash.com/photo-1667885098658-7e34d751fded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwbWFya2V0fGVufDF8fHx8MTc2MjA5NzgzOHww&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Dairy', img: 'https://images.unsplash.com/photo-1635714293982-65445548ac42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjIxMzQxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Cereals', img: 'https://images.unsplash.com/photo-1606495002933-354ea2413e94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGNlcmVhbHMlMjBncmFpbnN8ZW58MXx8fHwxNzYyMTk2NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' }
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => onNavigate('buyer-dashboard')}
                className="relative rounded-2xl overflow-hidden cursor-pointer group h-48"
              >
                <ImageWithFallback
                  src={category.img}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">{category.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d5016] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf size={32} />
            <span>AgriSmart</span>
          </div>
          <p className="text-white/80">
            © 2025 AgriSmart. Empowering farmers, connecting markets.
          </p>
        </div>
      </footer>
    </div>
  );
}
