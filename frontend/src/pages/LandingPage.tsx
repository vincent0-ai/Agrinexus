import { ShoppingCart, Cpu, TrendingUp, Users, Package, ShoppingBag, Leaf } from "lucide-react";
import { GREEN, AMBER } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export function LandingPage() {
  const { setPage } = useAuth();

  return (
    <div className="min-h-screen bg-white overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
            <Leaf className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-extrabold" style={{ color: GREEN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AgriNexus</span>
        </div>
        <div className="flex items-center gap-8 text-sm">
          {["Features", "How it Works", "Pricing"].map((l) => (
            <a key={l} href="#" className="text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          ))}
          <button
            onClick={() => setPage("login")}
            className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: GREEN }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-2 min-h-[560px]">
        <div className="flex flex-col justify-center px-16 py-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-7" style={{ background: GREEN + "15", color: GREEN }}>
            <Leaf className="w-3 h-3" /> Kenya&apos;s #1 AgriTech Platform
          </div>
          <h1 className="text-5xl font-black leading-[1.12] mb-5" style={{ color: "#1A2E22", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            From Farm<br />to Market,<br /><span style={{ color: GREEN }}>Digitally.</span>
          </h1>
          <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
            Connect directly with buyers. Real-time prices, IoT monitoring, and AI-powered crop intelligence — all in one platform.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setPage("login")}
              className="px-7 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ background: GREEN }}
            >
              <Leaf className="w-4 h-4" /> I&apos;m a Farmer
            </button>
            <button
              onClick={() => setPage("login")}
              className="px-7 py-3 rounded-xl font-semibold border-2 transition-colors hover:bg-amber-50 flex items-center gap-2"
              style={{ borderColor: AMBER, color: AMBER }}
            >
              <ShoppingBag className="w-4 h-4" /> I&apos;m a Buyer
            </button>
          </div>
          <div className="flex gap-8 mt-10 pt-8 border-t border-border">
            {[["12K+", "Farmers"], ["8K+", "Buyers"], ["KSh 2B+", "Transacted"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-xl font-bold" style={{ color: GREEN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden bg-emerald-50">
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&h=620&fit=crop&auto=format" alt="Farmer using a tablet in a lush farm field" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15), transparent 60%)" }} />
          <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: GREEN }}>
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-bold text-foreground">Price Alert</p>
            </div>
            <p className="text-2xl font-black" style={{ color: GREEN, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>+15%</p>
            <p className="text-xs text-muted-foreground">Tomatoes · Next 2 weeks</p>
          </div>
          <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Farm Health</p>
            <p className="text-2xl font-black" style={{ color: "#059669", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>92%</p>
            <p className="text-xs text-emerald-600 font-medium">● All sensors optimal</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: AMBER }}>Platform Features</p>
            <h2 className="text-3xl font-black" style={{ color: "#1A2E22", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Everything you need to grow</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: ShoppingCart, title: "Smart Marketplace",  desc: "Buy and sell directly. No middlemen. Verified farmers, real-time prices, and secure payments.", color: GREEN     },
              { icon: Cpu,          title: "IoT Farm Monitor",   desc: "Track soil moisture, temperature, humidity, and light from anywhere via smart wireless sensors.",  color: "#1A5276" },
              { icon: TrendingUp,   title: "AI Market Intel",    desc: "Get AI-powered price predictions, demand hotspots, and crop recommendations updated daily.",        color: AMBER     },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border p-7 hover:shadow-lg transition-shadow bg-card">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: f.color + "15" }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-8" style={{ background: GREEN + "08" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: AMBER }}>Simple Process</p>
            <h2 className="text-3xl font-black" style={{ color: "#1A2E22", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How it works</h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Account", desc: "Sign up as a farmer or buyer. Verify your identity and complete your profile in minutes.", icon: Users      },
              { step: "02", title: "List or Browse",      desc: "Farmers list produce with photos and prices. Buyers browse, filter, and compare offers.",   icon: Package    },
              { step: "03", title: "Transact & Grow",     desc: "Secure payments, real-time order tracking, and AI insights to maximise your revenue.",      icon: TrendingUp },
            ].map((s) => (
              <div key={s.step} className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black" style={{ color: GREEN + "30", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.step}</span>
                  <div className="h-px flex-1" style={{ background: GREEN + "20" }} />
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: GREEN }}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-2 text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: GREEN }} className="px-8 py-10">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5" style={{ color: AMBER }} />
              <span className="font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AgriNexus</span>
            </div>
            <p className="text-white/40 text-sm">© 2026 AgriNexus Ltd. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-white/50">
            {["About", "Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}