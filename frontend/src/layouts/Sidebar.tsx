import {
  LayoutDashboard, Package, ShoppingCart, Cpu, CloudSun, TrendingUp,
  Settings, LogOut, Heart,
} from "lucide-react";
import { Leaf } from "lucide-react";
import { cn } from "@/utils/cn";
import { GREEN, AMBER, FARMER_NAV, BUYER_NAV } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Package, ShoppingCart, Cpu, CloudSun, TrendingUp, Heart,
};

export function Sidebar() {
  const { role, setRole, page, setPage } = useAuth();
  const nav = role === "farmer" ? FARMER_NAV : BUYER_NAV;

  return (
    <aside className="w-60 min-h-screen flex flex-col flex-shrink-0" style={{ background: GREEN }}>
      <div className="p-5 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: AMBER }}>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AgriNexus
          </span>
        </div>
        <p className="text-xs text-white/40 mt-1 pl-0.5">Farm to Market, Digitally</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map((item) => {
          const Icon = ICON_MAP[item.iconName] ?? Package;
          const active = page === item.id;
          return (
            <button
              key={item.label}
              onClick={() => setPage(item.id as Parameters<typeof setPage>[0])}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                active ? "" : "text-white/55 hover:text-white hover:bg-white/10"
              )}
              style={active ? { background: AMBER, color: "#1A2E22" } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 pt-0 border-t border-white/10 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button
          onClick={() => { setRole(null); setPage("landing"); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/55 hover:text-red-300 hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
